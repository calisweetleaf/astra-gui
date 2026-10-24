import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ProviderCard } from '../components/agent/ProviderCard';
import { SessionRow } from '../components/agent/SessionRow';
import { countByStatus, machineFor, newestFirst } from '../components/agent/format';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Shell, WIDE_BREAKPOINT } from '../components/ui/Shell';
import { useAstra } from '../state/agent-store';
import { colors, fonts, layout, radius, space, type as typeScale } from '../theme/tokens';

export default function CommandDeck() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { machines, sessions, providers, health, selectedMachine, selectMachine, warning, ready } = useAstra();

  const running = countByStatus(sessions, 'running');
  const awaiting = countByStatus(sessions, 'awaiting-approval');
  const recent = useMemo(() => newestFirst(sessions), [sessions]);

  const statusLabel = sessions.length === 0 ? 'NO SESSIONS' : `${running} RUNNING · ${awaiting} AWAITING APPROVAL`;
  const statusTone = awaiting > 0 ? 'warning' : running > 0 ? 'live' : 'neutral';

  const wide = width >= WIDE_BREAKPOINT;
  const columns = wide ? 3 : width >= 600 ? 2 : 1;
  const available = Math.min((wide ? width - layout.sidebar : width) - layout.gutter * 2, layout.maxContent);
  const cardWidth = Math.floor((available - layout.gap * (columns - 1)) / columns);

  return (
    <Shell title="At your command." eyebrow="Astra · private command deck">
      <Chip label={statusLabel} tone={statusTone} dot pulse={running > 0} />
      {!health[selectedMachine.id] ? <View style={{ marginTop: space.lg, gap: space.md }}>
        <Text style={{ color: colors.textMuted, fontFamily: fonts.regular, lineHeight: 22 }}>{ready ? "Your workstation, from wherever you work. Pair a private bridge to open real agent sessions." : "Restoring your private workspace…"}</Text>
        <Button label="Connect workstation" icon="server" onPress={() => router.push(`/machines/${selectedMachine.id}` as never)} />
      </View> : null}
      {warning ? <Text accessibilityLiveRegion="polite" style={{ color: colors.warning }}>{warning}</Text> : null}

      <SectionHeader title="Machines" detail={`${machines.length}`} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
        {machines.map((machine) => {
          const onMachine = sessions.filter((session) => session.deviceId === machine.id);
          return (
            <Pressable
              key={machine.id}
              accessibilityRole="button"
              accessibilityLabel={`${machine.name}, ${machine.os}, ${onMachine.length} sessions`}
              onPress={() => { selectMachine(machine.id); router.push(`/machines/${machine.id}` as never); }}
              style={({ pressed }) => [styles.machine, machine.id === selectedMachine.id && { borderColor: colors.accent }, pressed && styles.pressed]}
            >
              <View style={styles.machineHead}>
                <Icon name="server" size={16} color={colors.textMuted} />
                <Text style={styles.machineName} numberOfLines={1}>
                  {machine.name}
                </Text>
              </View>
              <Text style={styles.machineOs} numberOfLines={1}>
                {health[machine.id] ? 'CONNECTED' : 'NOT CONNECTED'}
              </Text>
              <Text style={styles.machineAddress} numberOfLines={1}>
                {machine.address}
              </Text>
              <Text style={styles.machineCount}>
                {onMachine.length} {onMachine.length === 1 ? 'SESSION' : 'SESSIONS'}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <SectionHeader title="Agents" detail={`${providers.length}`} />
      <View style={styles.grid}>
        {providers.map((provider) => (
          <View key={provider.id} style={{ width: cardWidth }}>
            <ProviderCard
              provider={provider}
              sessions={sessions.filter((session) => session.provider === provider.id)}
              onPress={() => router.push(`/agent/${provider.id}` as never)}
            />
          </View>
        ))}
      </View>

      <SectionHeader title="Recent sessions" detail={`${recent.length}`} />
      <View style={styles.list}>
        {recent.length === 0 ? (
          <Text style={styles.empty}>NO SESSIONS</Text>
        ) : (
          recent.map((session) => (
            <SessionRow key={session.id} session={session} machineName={machineFor(machines, session.deviceId)?.name} />
          ))
        )}
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  strip: {
    gap: layout.gap,
    paddingRight: layout.gutter,
  },
  machine: {
    width: 220,
    minHeight: layout.touch,
    gap: space.xs,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.glass.primary,
  },
  pressed: {
    borderColor: colors.accent,
    transform: [{ scale: 0.97 }],
  },
  machineHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  machineName: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: typeScale.base,
    color: colors.text,
  },
  machineOs: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.textMuted,
  },
  machineAddress: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textFaint,
  },
  machineCount: {
    marginTop: space.xs,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.gap,
  },
  list: {
    gap: space.sm,
  },
  empty: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.8,
    color: colors.textFaint,
  },
});
