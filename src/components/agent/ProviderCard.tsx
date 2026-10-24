import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ProviderDef } from '../../providers/registry';
import { colors, fonts, radius, space, type as typeScale } from '../../theme/tokens';
import type { SessionSummary } from '../../transport';
import { glowStyle } from '../ui/GlassPanel';
import { StatusDot } from '../ui/StatusDot';

type ProviderCardProps = {
  provider: ProviderDef;
  sessions: SessionSummary[];
  onPress: () => void;
};

export function ProviderCard({ provider, sessions, onPress }: ProviderCardProps) {
  const planned = provider.status === 'planned';
  const running = sessions.filter((session) => session.status === 'running').length;
  const awaiting = sessions.filter((session) => session.status === 'awaiting-approval').length;

  const status = planned
    ? { label: 'NOT CONNECTED', color: colors.textFaint, pulse: false }
    : running > 0
      ? { label: `${running} RUNNING`, color: colors.live, pulse: true }
      : awaiting > 0
        ? { label: `${awaiting} AWAITING APPROVAL`, color: colors.warning, pulse: false }
        : { label: sessions.length > 0 ? 'IDLE' : 'NO SESSIONS', color: colors.textMuted, pulse: false };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${provider.name}, ${provider.maker}, ${status.label}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, planned && styles.planned, pressed && styles.pressed]}
    >
      {({ pressed }) => (
        <View style={[styles.inner, !planned && running > 0 && glowStyle, pressed && styles.innerPressed]}>
          <View style={styles.top}>
            <View style={styles.mark}>
              <Text style={styles.markText}>{provider.mark}</Text>
            </View>
            <View style={styles.titleBlock}>
              <Text style={styles.name} numberOfLines={2}>
                {provider.name}
              </Text>
              <Text style={styles.maker} numberOfLines={1}>
                {provider.maker}
              </Text>
            </View>
          </View>
          <Text style={styles.project} numberOfLines={1}>
            {provider.project}
          </Text>
          <View style={styles.statusRow}>
            <StatusDot color={status.color} pulse={status.pulse} />
            <Text style={[styles.status, { color: status.color }]} numberOfLines={1}>
              {status.label}
            </Text>
          </View>
          {!planned ? (
            <Text style={styles.count}>
              {sessions.length} {sessions.length === 1 ? 'SESSION' : 'SESSIONS'}
            </Text>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 48,
    borderRadius: radius.xl,
  },
  inner: {
    gap: space.sm,
    padding: space.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.glass.primary,
  },
  innerPressed: {
    borderColor: colors.accent,
  },
  planned: {
    borderColor: colors.hairline,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  mark: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
  },
  markText: {
    fontFamily: fonts.mono,
    fontSize: typeScale.base,
    color: colors.text,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: typeScale.emphasis,
    color: colors.text,
  },
  maker: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.textMuted,
  },
  project: {
    fontFamily: fonts.mono,
    fontSize: typeScale.body,
    color: colors.textMuted,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  status: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.8,
  },
  count: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
});
