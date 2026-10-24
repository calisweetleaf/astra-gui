import type {
  AgentTransport,
  Machine,
  ProviderId,
  SessionSummary,
  StreamEvent,
  StreamEventKind,
} from './types';

/**
 * DemoTransport — the ONLY wired AgentTransport in this build.
 *
 * Deterministic fixtures: fixed base timestamp, counter-derived ids,
 * no Date.now(), no Math.random(), no networking. `approve()` resolves
 * after a short delay and leaks nothing.
 */

/** Providers the demo actually simulates; everything else reports unplanned. */
const ACTIVE: readonly ProviderId[] = ['droid', 'codex'];

const BASE_TS = 1_760_000_000_000;
const APPROVAL_DELAY_MS = 150;

let seq = 0;
function nextSeq(): number {
  seq += 1;
  return seq;
}

function ev(kind: StreamEventKind, text: string, meta?: StreamEvent['meta']): StreamEvent {
  const n = nextSeq();
  return {
    id: `demo-${String(n).padStart(4, '0')}`,
    ts: BASE_TS + n * 1_000,
    kind,
    text,
    ...(meta === undefined ? {} : { meta }),
  };
}

function fixtures(provider: ProviderId, device: Machine): SessionSummary[] {
  switch (provider) {
    case 'droid':
      return [
        {
          id: 'droid-s1',
          title: 'Warren routing pass',
          provider,
          deviceId: device.id,
          updatedTs: BASE_TS - 60_000,
          status: 'running',
        },
        {
          id: 'droid-s2',
          title: 'Approve theme tokens diff',
          provider,
          deviceId: device.id,
          updatedTs: BASE_TS - 300_000,
          status: 'awaiting-approval',
        },
        {
          id: 'droid-s3',
          title: 'Idle repl scratchpad',
          provider,
          deviceId: device.id,
          updatedTs: BASE_TS - 900_000,
          status: 'idle',
        },
      ];
    case 'codex':
      return [
        {
          id: 'codex-s1',
          title: 'Plan: transport audit',
          provider,
          deviceId: device.id,
          updatedTs: BASE_TS - 120_000,
          status: 'running',
        },
        {
          id: 'codex-s2',
          title: 'Build: registry types',
          provider,
          deviceId: device.id,
          updatedTs: BASE_TS - 600_000,
          status: 'idle',
        },
      ];
    default:
      return [];
  }
}

export const DemoTransport: AgentTransport = {
  async listSessions(device, provider) {
    return fixtures(provider, device);
  },

  async *send(_device, provider, sessionId, input) {
    if (!ACTIVE.includes(provider)) {
      yield ev(
        'system',
        `${provider} is registered as planned — not connected in this demo build.`,
      );
      return;
    }

    yield ev('command', `$ ${input.trim()}`);
    yield ev('output', `[${provider}] session ${sessionId} — streaming (demo).`);

    yield ev('tool', 'tool: read src/theme/tokens.ts', {
      tool: 'read',
      path: 'src/theme/tokens.ts',
    });

    yield ev(
      'diff',
      [
        '--- a/src/theme/tokens.ts',
        '+++ b/src/theme/tokens.ts',
        '@@ -12,6 +12,7 @@',
        '+export const glass = { command: \'rgba(8,12,18,0.96)\' };',
      ].join('\n'),
      { additions: 1, deletions: 0 },
    );

    yield ev('approval', 'approval required: apply the staged diff?', {
      approvalId: `${sessionId}-approval-1`,
    });

    yield ev('output', 'demo stream complete — no real agent was contacted.');
  },

  async approve(_device, _provider, _sessionId, _approvalId, _decision) {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, APPROVAL_DELAY_MS);
    });
  },
};
