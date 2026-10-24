import { useEffect, useState } from 'react';
import { useAstra } from '../../state/agent-store';
import type { Machine, ProviderId, StreamEvent, StreamEventKind } from '../../transport';

export type ReplayRequest = {
  key: string;
  machine: Machine;
  provider: ProviderId;
  sessionId: string;
  input: string;
};

export type ReplayResult = {
  request: ReplayRequest;
  events: StreamEvent[];
};

type ReplayState = {
  results: ReplayResult[];
  loading: boolean;
  failure: string | null;
};

/**
 * Drives each request through the transport and keeps only the wanted event
 * kinds. Callers must keep `requests` and `kinds` referentially stable across
 * renders (memoize / module constants) or the replay restarts every render.
 */
export function useTransportReplay(requests: ReplayRequest[], kinds: StreamEventKind[]): ReplayState {
  const { transport } = useAstra();
  const [state, setState] = useState<ReplayState>({ results: [], loading: requests.length > 0, failure: null });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setState((prev) => ({ ...prev, loading: requests.length > 0, failure: null }));
      const results: ReplayResult[] = [];
      for (const request of requests) {
        const events: StreamEvent[] = [];
        for await (const event of transport.send(request.machine, request.provider, request.sessionId, request.input)) {
          if (kinds.includes(event.kind)) events.push(event);
        }
        results.push({ request, events });
      }
      return results;
    };

    run()
      .then((results) => {
        if (!cancelled) setState({ results, loading: false, failure: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const reason = error instanceof Error ? error.message : 'unknown transport failure';
        setState({ results: [], loading: false, failure: reason });
      });

    return () => {
      cancelled = true;
    };
  }, [transport, requests, kinds]);

  return state;
}
