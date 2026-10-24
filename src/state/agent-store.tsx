import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { providers as catalog, seedMachines, type ProviderDef } from '../providers/registry';
import { LanTransport, bridgeRequest, savePairingToken, type BridgeHealth } from '../transport/lan';
import type { AgentSettings, AgentTransport, Machine, ProviderId, SessionSummary } from '../transport/types';

const ADDRESS_KEY = 'astra.rig-addresses.v2';
const SETTINGS_KEY = 'astra.agent-settings.v1';
const SELECTED_KEY = 'astra.selected-machine';
const emptySettings = (): Record<ProviderId, AgentSettings> => Object.fromEntries(catalog.map(p => [p.id, {
  model: '', mode: 'plan', autonomy: 'readonly', effort: 'medium', extra: {},
}])) as Record<ProviderId, AgentSettings>;
function validAddress(address: string): boolean {
  try { const u = new URL(address); return ['http:', 'https:'].includes(u.protocol) && !!u.hostname && !u.username && !u.password && !u.search && !u.hash && (u.pathname === '/' || u.pathname === ''); }
  catch { return false; }
}
interface AstraContextValue {
  machines: Machine[]; sessions: SessionSummary[]; settings: Record<ProviderId, AgentSettings>;
  providers: ProviderDef[]; selectedMachine: Machine; selectMachine: (id: string) => void;
  health: Partial<Record<string, BridgeHealth>>; connectionErrors: Record<string, string>;
  transport: AgentTransport; warning: string | null; ready: boolean;
  refresh: () => Promise<void>;
  pairMachine: (id: string, address: string, token: string) => Promise<void>;
  updateAddress: (id: string, address: string) => void;
  updateSettings: (id: ProviderId, patch: Partial<AgentSettings>) => void;
}
const AstraContext = createContext<AstraContextValue | null>(null);
export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [machines, setMachines] = useState(seedMachines);
  const [settings, setSettings] = useState(emptySettings);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [health, setHealth] = useState<Partial<Record<string, BridgeHealth>>>({});
  const [connectionErrors, setConnectionErrors] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState(seedMachines[0].id);
  const [warning, setWarning] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const refreshing = useRef(false);
  const settingsRef = useRef(settings);
  const machinesRef = useRef(machines);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => {
    void (async () => {
      try {
        const [rawAddresses, rawSettings, selected] = await Promise.all([AsyncStorage.getItem(ADDRESS_KEY), AsyncStorage.getItem(SETTINGS_KEY), AsyncStorage.getItem(SELECTED_KEY)]);
        if (!alive.current) return;
        const addresses: unknown = rawAddresses ? JSON.parse(rawAddresses) : {};
        const stored: unknown = rawSettings ? JSON.parse(rawSettings) : {};
        if (addresses && typeof addresses === 'object') {
          const next = seedMachines.map(m => {
            const value = (addresses as Record<string, unknown>)[m.id];
            if (m.id === 'kubuntu' && value === 'http://192.168.1.42:8765') return m;
            return typeof value === 'string' && validAddress(value) ? { ...m, address: value } : m;
          });
          machinesRef.current = next; setMachines(next);
        }
        if (stored && typeof stored === 'object') {
          const next = emptySettings();
          for (const p of catalog) {
            const patch = (stored as Record<string, unknown>)[p.id];
            if (!patch || typeof patch !== 'object') continue;
            const value = patch as Partial<AgentSettings>;
            const extra: Record<string, string> = {};
            if (value.extra && typeof value.extra === 'object') for (const [key, item] of Object.entries(value.extra)) if (typeof item === 'string') extra[key] = item;
            next[p.id] = { ...next[p.id], extra };
          }
          settingsRef.current = next; setSettings(next);
        }
        if (seedMachines.some(m => m.id === selected)) setSelectedId(selected!);
      } catch (error) { if (alive.current) setWarning('Local settings could not be loaded: ' + String(error)); }
      finally { if (alive.current) setReady(true); }
    })();
  }, []);
  const refresh = useCallback(async () => {
    if (refreshing.current || !ready) return;
    refreshing.current = true;
    try {
      const results = await Promise.all(machinesRef.current.map(async machine => {
        try {
          if (!validAddress(machine.address)) return { machine, error: 'Not configured' };
          const status = await bridgeRequest<BridgeHealth>(machine, '/v1/health');
          if (status.protocol !== 1) throw new Error('Unsupported bridge protocol.');
          const list = await bridgeRequest<SessionSummary[]>(machine, '/v1/sessions?device=' + machine.id);
          return { machine, status, list };
        } catch (error) { return { machine, error: error instanceof Error ? error.message : String(error) }; }
      }));
      if (!alive.current) return;
      setHealth(Object.fromEntries(results.filter(r => r.status).map(r => [r.machine.id, r.status])));
      setConnectionErrors(Object.fromEntries(results.filter(r => r.error).map(r => [r.machine.id, r.error!])));
      setSessions(results.flatMap(r => r.list ?? []));
    } finally { refreshing.current = false; }
  }, [ready]);
  useEffect(() => {
    if (!ready) return;
    void refresh();
    const timer = setInterval(() => { if (AppState.currentState === 'active') void refresh(); }, 5000);
    const sub = AppState.addEventListener('change', state => { if (state === 'active') void refresh(); });
    return () => { clearInterval(timer); sub.remove(); };
  }, [ready, refresh]);
  const updateAddress = useCallback((id: string, address: string) => {
    if (!validAddress(address)) { setWarning('Use a bridge URL without credentials, query or path.'); return; }
    const next = machinesRef.current.map(m => m.id === id ? { ...m, address } : m);
    machinesRef.current = next; setMachines(next);
    void AsyncStorage.setItem(ADDRESS_KEY, JSON.stringify(Object.fromEntries(next.map(m => [m.id, m.address])))).catch(error => setWarning('Address persistence failed: ' + String(error)));
  }, []);
  const pairMachine = useCallback(async (id: string, address: string, token: string) => {
    if (!validAddress(address)) throw new Error('Use http(s)://host:port without credentials or a path.');
    if (token.trim() && token.trim().length < 32) throw new Error('Enter the complete token, or leave it empty for the local trusted-phone service.');
    const machine = machinesRef.current.find(m => m.id === id);
    if (!machine) throw new Error('Unknown machine.');
    // Store only in the native credential vault, never AsyncStorage or logs.
    const status = await bridgeRequest<BridgeHealth>({ ...machine, address }, '/v1/health', undefined, undefined, token.trim());
    if (status.protocol !== 1) throw new Error('Unsupported bridge protocol.');
    if (token.trim()) await savePairingToken(id, token.trim());
    updateAddress(id, address);
    setHealth(prev => ({ ...prev, [id]: status }));
    await refresh();
  }, [refresh, updateAddress]);
  const updateSettings = useCallback((id: ProviderId, patch: Partial<AgentSettings>) => {
    const next = { ...settingsRef.current, [id]: { ...settingsRef.current[id], ...patch } };
    settingsRef.current = next; setSettings(next);
    void AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(error => setWarning('Settings persistence failed: ' + String(error)));
  }, []);
  const selectMachine = useCallback((id: string) => {
    setSelectedId(id);
    void AsyncStorage.setItem(SELECTED_KEY, id).catch(error => setWarning(String(error)));
  }, []);
  const selectedMachine = machines.find(m => m.id === selectedId) ?? machines[0];
  const providers = useMemo(() => catalog.map(p => ({ ...p, project: settings[p.id].extra.workspace || health[selectedMachine.id]?.cwd || 'Not paired', status: health[selectedMachine.id]?.providers[p.id]?.available ? 'active' as const : 'planned' as const })), [health, selectedMachine.id, settings]);
  return <AstraContext.Provider value={{ machines, sessions, settings, providers, selectedMachine, selectMachine, health, connectionErrors, transport: LanTransport, warning, ready, refresh, pairMachine, updateAddress, updateSettings }}>{children}</AstraContext.Provider>;
}
export function useAstra(): AstraContextValue {
  const value = useContext(AstraContext);
  if (!value) throw new Error('useAstra must be used inside AgentProvider.');
  return value;
}
