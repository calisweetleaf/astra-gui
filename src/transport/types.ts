/** Native client transport contract. LAN transport owns real host sessions. */

export type ProviderId = 'droid' | 'codex' | 'opencode' | 'antigravity' | 'deepseek';

export type ProviderStatus = 'active' | 'planned';

export type StreamEventKind =
  | 'command'
  | 'output'
  | 'tool'
  | 'diff'
  | 'approval'
  | 'error'
  | 'system';

export interface StreamEvent {
  id: string;
  ts: number;
  kind: StreamEventKind;
  text: string;
  meta?: Record<string, string | number | boolean>;
}

export type SessionStatus = 'running' | 'idle' | 'awaiting-approval' | 'error';

export interface SessionSummary {
  id: string;
  title: string;
  provider: ProviderId;
  deviceId: string;
  updatedTs: number;
  status: SessionStatus;
}

export type ExecutionMode = 'build' | 'plan';

export type Autonomy = 'readonly' | 'assisted' | 'full';

export interface AgentSettings {
  model: string;
  mode: ExecutionMode;
  autonomy: Autonomy;
  effort: 'low' | 'medium' | 'high';
  extra: Record<string, string>;
}

export interface Machine {
  id: string;
  name: string;
  os: string;
  address: string;
}

export interface AgentTransport {
  listSessions(device: Machine, provider: ProviderId): Promise<SessionSummary[]>;
  send(
    device: Machine,
    provider: ProviderId,
    sessionId: string,
    input: string,
  ): AsyncIterable<StreamEvent>;
  approve(
    device: Machine,
    provider: ProviderId,
    sessionId: string,
    approvalId: string,
    decision: 'allow' | 'deny',
  ): Promise<void>;
}
