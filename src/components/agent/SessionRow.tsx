import { useRouter } from 'expo-router';
import { providers } from '../../providers/registry';
import type { SessionSummary } from '../../transport';
import { ListRow } from '../ui/ListRow';
import { StatusDot } from '../ui/StatusDot';
import { formatClock, sessionStatusMeta } from './format';

type SessionRowProps = {
  session: SessionSummary;
  machineName?: string;
};

export function SessionRow({ session, machineName }: SessionRowProps) {
  const router = useRouter();
  const meta = sessionStatusMeta(session.status);
  const providerName = providers.find((provider) => provider.id === session.provider)?.name ?? session.provider;
  const detail = [meta.label, providerName, machineName, formatClock(session.updatedTs)]
    .filter((part): part is string => Boolean(part))
    .join(' · ');

  return (
    <ListRow
      title={session.title}
      subtitle={detail}
      leading={<StatusDot color={meta.color} pulse={meta.pulse} />}
      accessibilityLabel={`${session.title}, ${detail}`}
      onPress={() => router.push(`/agent/${session.provider}/session/${session.id}` as never)}
    />
  );
}
