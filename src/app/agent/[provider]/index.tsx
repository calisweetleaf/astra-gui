import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PlannedNotice, UnknownRoute } from '../../../components/agent/Notices';
import { SessionRow } from '../../../components/agent/SessionRow';
import { formatClock, machineFor, newestFirst, sessionStatusMeta } from '../../../components/agent/format';
import { useProviderParam } from '../../../components/agent/useRouteParams';
import { Button } from '../../../components/ui/Button';
import { Chip } from '../../../components/ui/Chip';
import { GlassPanel } from '../../../components/ui/GlassPanel';
import { ListRow } from '../../../components/ui/ListRow';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Shell } from '../../../components/ui/Shell';
import { StatusDot } from '../../../components/ui/StatusDot';
import type { ProviderDef } from '../../../providers/registry';
import { createSession } from '../../../transport/lan';
import { useAstra } from '../../../state/agent-store';
import { colors, fonts, space, type as typeScale } from '../../../theme/tokens';

export default function ProviderScreen() {
  const provider = useProviderParam();
  if (!provider) {
    return <UnknownRoute title="Unknown agent" detail="The requested agent is not in the provider registry." />;
  }
  if (provider.status === 'planned') {
    return (
      <Shell title={provider.name} eyebrow={`${provider.maker} · planned`} back>
        <PlannedNotice provider={provider} />
      </Shell>
    );
  }
  return <ActiveProvider provider={provider} />;
}

function ActiveProvider({ provider }: { provider: ProviderDef }) {
  const router = useRouter();
  const { machines, sessions, settings, selectedMachine, refresh } = useAstra();
  const [starting, setStarting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const start = async () => {
    setStarting(true); setFailure(null);
    try {
      const session = await createSession(selectedMachine, provider.id, settings[provider.id]);
      await refresh();
      router.push(`/agent/${provider.id}/session/${session.id}` as never);
    } catch (error) { setFailure(error instanceof Error ? error.message : String(error)); }
    finally { setStarting(false); }
  };
  const current = settings[provider.id];

  const own = useMemo(
    () => newestFirst(sessions.filter((session) => session.provider === provider.id && session.deviceId === selectedMachine.id)),
    [sessions, provider.id, selectedMachine.id],
  );
  const focus = own.find((session) => session.status === 'running') ?? own[0];
  const focusMeta = focus ? sessionStatusMeta(focus.status) : undefined;
  const base = `/agent/${provider.id}`;

  return (
    <Shell title={provider.name} eyebrow={`${provider.maker} · ${provider.project}`} back>
      <View style={styles.chips}>
        <Chip
          label="Launch configuration"
          icon="cpu"
          onPress={() => router.push(`${base}/settings` as never)}
          accessibilityLabel={`Model ${current.model || 'unset'}, open settings`}
        />
        <Chip
          label={selectedMachine.name}
          icon="sliders"
          onPress={() => router.push(`${base}/settings` as never)}
          accessibilityLabel={`Mode ${current.mode}, open settings`}
        />
      </View>

      <View style={{ marginTop: space.lg, gap: space.sm }}>
        <Button label="New native session" icon="terminal" loading={starting} onPress={() => void start()} />
        {failure ? <Text accessibilityLiveRegion="polite" style={{ color: colors.warning }}>{failure}</Text> : null}
      </View>
      <SectionHeader title="Current session" />
      {focus && focusMeta ? (
        <GlassPanel glow={focus.status === 'running'} active={focus.status === 'running'} style={styles.session}>
          <View style={styles.sessionHead}>
            <StatusDot color={focusMeta.color} pulse={focusMeta.pulse} />
            <Text style={[styles.sessionStatus, { color: focusMeta.color }]}>{focusMeta.label}</Text>
          </View>
          <Text style={styles.sessionTitle} numberOfLines={2}>
            {focus.title}
          </Text>
          <Text style={styles.sessionMeta}>
            {[machineFor(machines, focus.deviceId)?.name, formatClock(focus.updatedTs)].filter(Boolean).join(' · ')}
          </Text>
          <Button
            label="Open composer"
            icon="terminal"
            onPress={() => router.push(`${base}/session/${focus.id}` as never)}
          />
        </GlassPanel>
      ) : (
        <Text style={styles.empty}>NO SESSIONS</Text>
      )}

      <SectionHeader title="Workspace" />
      <View style={styles.rows}>
        <ListRow
          icon="git-branch"
          title="Working tree"
          subtitle="Read the real workstation Git diff"
          onPress={() => router.push(`${base}/changes` as never)}
        />
        <ListRow
          icon="settings"
          title="Settings"
          subtitle={current.extra.workspace || 'Workspace and native CLI arguments'}
          onPress={() => router.push(`${base}/settings` as never)}
        />
      </View>

      <SectionHeader title="Recent sessions" detail={`${own.length}`} />
      <View style={styles.rows}>
        {own.length === 0 ? (
          <Text style={styles.empty}>NO SESSIONS</Text>
        ) : (
          own.map((session) => (
            <SessionRow key={session.id} session={session} machineName={machineFor(machines, session.deviceId)?.name} />
          ))
        )}
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: space.sm,
  },
  session: {
    gap: space.md,
  },
  sessionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  sessionStatus: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.8,
  },
  sessionTitle: {
    fontFamily: fonts.semibold,
    fontSize: typeScale.emphasis,
    color: colors.text,
  },
  sessionMeta: {
    fontFamily: fonts.mono,
    fontSize: typeScale.body,
    color: colors.textMuted,
  },
  rows: {
    gap: space.sm,
  },
  empty: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.8,
    color: colors.textFaint,
  },
});
