import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import type { ProviderDef } from '../../providers/registry';
import { useAstra } from '../../state/agent-store';
import { colors, fonts, space, type as typeScale } from '../../theme/tokens';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { GlassPanel } from '../ui/GlassPanel';
import { Shell } from '../ui/Shell';

export function UnknownRoute({ title, detail }: { title: string; detail: string }) {
  const router = useRouter();
  return (
    <Shell title={title} eyebrow="Route error" back>
      <GlassPanel style={styles.panel}>
        <Chip label="Not found" tone="danger" dot />
        <Text style={styles.body}>{detail}</Text>
        <Button label="Command deck" icon="grid" variant="secondary" onPress={() => router.replace('/')} />
      </GlassPanel>
    </Shell>
  );
}

export function PlannedNotice({ provider }: { provider: ProviderDef }) {
  const router = useRouter();
  const { selectedMachine } = useAstra();
  return (
    <GlassPanel style={styles.panel}>
      <Chip label="Not connected" tone="neutral" dot />
      <Text style={styles.body}>
        {provider.name} is not available on the selected workstation. Connect the bridge, then check that this agent has an interactive CLI on the host PATH. GUI-only applications need their own terminal adapter.
      </Text>
      <Button label="Connect workstation" icon="server" onPress={() => router.push(`/machines/${selectedMachine.id}` as never)} />
      <Button label="Launch settings" variant="secondary" onPress={() => router.push(`/agent/${provider.id}/settings` as never)} />
      <View style={styles.meta}>
        <Text style={styles.metaLabel}>MAKER</Text>
        <Text style={styles.metaValue}>{provider.maker}</Text>
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: space.md,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: typeScale.base,
    lineHeight: 22,
    color: colors.textMuted,
  },
  meta: {
    gap: 2,
  },
  metaLabel: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.textFaint,
  },
  metaValue: {
    fontFamily: fonts.mono,
    fontSize: typeScale.body,
    color: colors.textMuted,
  },
});
