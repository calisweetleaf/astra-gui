import { useLocalSearchParams } from 'expo-router';
import type { ProviderDef } from '../../providers/registry';
import { useAstra } from '../../state/agent-store';

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function useProviderParam(): ProviderDef | undefined {
  const { providers } = useAstra();
  const { provider } = useLocalSearchParams<{ provider?: string | string[] }>();
  const id = first(provider);
  return providers.find((candidate) => candidate.id === id);
}

export function useSessionParam(): string {
  const { sid } = useLocalSearchParams<{ sid?: string | string[] }>();
  return first(sid) ?? '';
}

export function useMachineParam(): string {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  return first(id) ?? '';
}
