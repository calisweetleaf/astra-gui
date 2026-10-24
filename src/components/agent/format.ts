import { colors } from '../../theme/tokens';
import type { Machine, SessionStatus, SessionSummary } from '../../transport';
import type { Tone } from '../ui/Chip';

type StatusMeta = {
  label: string;
  tone: Tone;
  color: string;
  pulse: boolean;
};

const STATUS_META: Record<SessionStatus, StatusMeta> = {
  running: { label: 'RUNNING', tone: 'live', color: colors.live, pulse: true },
  idle: { label: 'IDLE', tone: 'neutral', color: colors.textMuted, pulse: false },
  'awaiting-approval': { label: 'AWAITING APPROVAL', tone: 'warning', color: colors.warning, pulse: false },
  error: { label: 'ERROR', tone: 'danger', color: colors.danger, pulse: false },
};

export function sessionStatusMeta(status: SessionStatus): StatusMeta {
  return STATUS_META[status];
}

/** Demo fixtures carry fixed timestamps, so an absolute UTC clock is the only truthful rendering. */
export function formatClock(ts: number): string {
  return `${new Date(ts).toISOString().slice(11, 16)} UTC`;
}

export function countByStatus(sessions: SessionSummary[], status: SessionStatus): number {
  return sessions.filter((session) => session.status === status).length;
}

export function machineFor(machines: Machine[], deviceId: string): Machine | undefined {
  return machines.find((machine) => machine.id === deviceId);
}

export function newestFirst(sessions: SessionSummary[]): SessionSummary[] {
  return [...sessions].sort((a, b) => b.updatedTs - a.updatedTs);
}
