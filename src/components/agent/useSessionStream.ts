import { useCallback, useEffect, useRef, useState } from 'react';
import { useAstra } from '../../state/agent-store';
import type { Machine, ProviderId, StreamEvent } from '../../transport';

type SessionStream = {
  events: StreamEvent[];
  busy: boolean;
  submit: (input: string) => Promise<void>;
};

const SESSION_BANNER =
  'Demo transport: fixtures only, no agent process is contacted. Send a command to replay the demo stream.';

export function useSessionStream(machine: Machine, provider: ProviderId, sessionId: string): SessionStream {
  const { transport } = useAstra();
  const [events, setEvents] = useState<StreamEvent[]>(() => [
    { id: `local-banner-${sessionId}`, ts: 0, kind: 'system', text: SESSION_BANNER },
  ]);
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);
  const localSeq = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const submit = useCallback(
    async (input: string) => {
      const trimmed = input.trim();
      if (trimmed.length === 0) return;
      setBusy(true);
      try {
        for await (const event of transport.send(machine, provider, sessionId, trimmed)) {
          if (!mounted.current) return;
          setEvents((prev) => [...prev, event]);
        }
      } catch (error) {
        if (!mounted.current) return;
        localSeq.current += 1;
        const reason = error instanceof Error ? error.message : 'unknown transport failure';
        setEvents((prev) => [
          ...prev,
          { id: `local-error-${sessionId}-${localSeq.current}`, ts: 0, kind: 'error', text: reason },
        ]);
      } finally {
        if (mounted.current) setBusy(false);
      }
    },
    [transport, machine, provider, sessionId],
  );

  return { events, busy, submit };
}
