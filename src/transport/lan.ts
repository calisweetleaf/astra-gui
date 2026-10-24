import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { AgentSettings, AgentTransport, Machine, ProviderId, SessionSummary } from './types';

const volatileTokens = new Map<string, string>();
const tokenKey = (id: string) => 'astra.bridge.' + id;
export async function savePairingToken(id: string, token: string): Promise<void> {
  if (Platform.OS === 'web') { volatileTokens.set(id, token); return; }
  await SecureStore.setItemAsync(tokenKey(id), token, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
}
export async function pairingToken(id: string): Promise<string | null> {
  if (Platform.OS === 'web') return volatileTokens.get(id) ?? null;
  return SecureStore.getItemAsync(tokenKey(id));
}
export interface BridgeHealth {
  name: string; cwd: string; root: string; protocol: number;
  providers: Partial<Record<ProviderId, { available: boolean; binary: string | null }>>;
}
export interface TerminalScreen { revision: number; text: string; exited: boolean; exitCode: number | null }
export async function bridgeRequest<T>(machine: Machine, path: string, data?: unknown, method?: string, tokenOverride?: string): Promise<T> {
  const token = tokenOverride ?? await pairingToken(machine.id);
  const base = new URL(machine.address);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw new Error('Invalid bridge address.');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(machine.address.replace(/\/$/, '') + path, {
      method: method ?? (data === undefined ? 'GET' : 'POST'),
      headers: { ...(token ? { Authorization: 'Bearer ' + token } : {}), 'Content-Type': 'application/json' },
      ...(data === undefined ? {} : { body: JSON.stringify(data) }), signal: controller.signal,
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? 'Bridge request failed (' + response.status + ').');
    return payload as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('Bridge timed out. Check the host and private-network connection.');
    throw error;
  } finally { clearTimeout(timer); }
}
export const LanTransport: AgentTransport = {
  listSessions: (machine, provider) => bridgeRequest<SessionSummary[]>(machine, '/v1/sessions?provider=' + provider + '&device=' + encodeURIComponent(machine.id)),
  async *send(machine, _provider, sessionId, input) {
    await bridgeRequest(machine, '/v1/sessions/' + encodeURIComponent(sessionId) + '/input', { text: input });
    yield { id: 'sent-' + Date.now(), ts: Date.now(), kind: 'command', text: input };
  },
  async approve() { throw new Error('Respond to the real agent approval in its terminal. No synthetic approval API is used.'); },
};
export const createSession = (machine: Machine, provider: ProviderId, settings: AgentSettings) =>
  bridgeRequest<SessionSummary>(machine, '/v1/sessions?device=' + encodeURIComponent(machine.id), { provider, settings });
export const readScreen = (machine: Machine, id: string) => bridgeRequest<TerminalScreen>(machine, '/v1/sessions/' + id + '/screen');
export const sendKey = (machine: Machine, id: string, key: string) => bridgeRequest(machine, '/v1/sessions/' + id + '/input', { key });
export const stopSession = (machine: Machine, id: string) => bridgeRequest(machine, '/v1/sessions/' + id, undefined, 'DELETE');
