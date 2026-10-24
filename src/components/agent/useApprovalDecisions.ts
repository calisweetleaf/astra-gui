import { useCallback, useEffect, useRef, useState } from 'react';
import { useAstra } from '../../state/agent-store';
import type { Machine, ProviderId, StreamEvent } from '../../transport';

export type ApprovalState = 'pending' | 'sending' | 'allow' | 'deny' | 'failed';

export type ApprovalTarget = {
  machine: Machine;
  provider: ProviderId;
  sessionId: string;
  approvalId: string;
};

export function approvalIdOf(event: StreamEvent): string {
  const declared = event.meta?.approvalId;
  return typeof declared === 'string' ? declared : event.id;
}

export function useApprovalDecisions() {
  const { transport } = useAstra();
  const [states, setStates] = useState<Record<string, ApprovalState>>({});
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const decide = useCallback(
    async (target: ApprovalTarget, decision: 'allow' | 'deny') => {
      const { machine, provider, sessionId, approvalId } = target;
      setStates((prev) => ({ ...prev, [approvalId]: 'sending' }));
      try {
        await transport.approve(machine, provider, sessionId, approvalId, decision);
        if (mounted.current) setStates((prev) => ({ ...prev, [approvalId]: decision }));
      } catch {
        if (mounted.current) setStates((prev) => ({ ...prev, [approvalId]: 'failed' }));
      }
    },
    [transport],
  );

  return { states, decide };
}
