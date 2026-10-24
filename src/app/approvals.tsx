import { Text, View } from 'react-native';
import { SessionRow } from '../components/agent/SessionRow';
import { GlassPanel } from '../components/ui/GlassPanel';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Shell } from '../components/ui/Shell';
import { useAstra } from '../state/agent-store';
import { colors, fonts, space } from '../theme/tokens';

export default function ApprovalsScreen() {
  const { sessions, selectedMachine } = useAstra();
  const live = sessions.filter(s => s.deviceId === selectedMachine.id && s.status === 'running');
  return <Shell title="Agent permissions" eyebrow="Native approval controls">
    <GlassPanel><Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, lineHeight: 23 }}>
      Permissions remain with each agent. Open its terminal to inspect and answer the real approval prompt with Enter, arrow keys or your response. Astra does not bypass approval policy or invent approval requests.
    </Text></GlassPanel>
    <SectionHeader title="Live sessions" detail={String(live.length)} />
    <View style={{ gap: space.sm }}>{live.map(session => <SessionRow key={session.id} session={session} machineName={selectedMachine.name} />)}</View>
    {!live.length ? <Text style={{ color: colors.textMuted, fontFamily: fonts.regular }}>No live sessions on the selected machine.</Text> : null}
  </Shell>;
}
