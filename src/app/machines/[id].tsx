import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SessionRow } from '../../components/agent/SessionRow';
import { UnknownRoute } from '../../components/agent/Notices';
import { useMachineParam } from '../../components/agent/useRouteParams';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { GlassPanel } from '../../components/ui/GlassPanel';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Shell } from '../../components/ui/Shell';
import { useAstra } from '../../state/agent-store';
import { colors, fonts, layout, radius, space } from '../../theme/tokens';

export default function MachineScreen() {
  const id = useMachineParam();
  const { machines, sessions, pairMachine, health, connectionErrors, selectMachine, refresh } = useAstra();
  const machine = machines.find(m => m.id === id);
  const [address, setAddress] = useState(machine?.address ?? '');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  if (!machine) return <UnknownRoute title="Unknown machine" detail="This machine is not registered." />;
  const status = health[id];
  const pair = async () => {
    setBusy(true); setMessage(null);
    try {
      await pairMachine(id, address.trim(), token);
      setToken(''); selectMachine(id); setMessage('Connected. This machine is now selected.');
    } catch (error) { setMessage(error instanceof Error ? error.message : String(error)); }
    finally { setBusy(false); }
  };
  return <Shell title={machine.name} eyebrow="Private workstation connection" back>
    <Chip label={status ? 'Connected · ' + status.name : 'Offline'} tone={status ? 'live' : 'neutral'} dot />
    <SectionHeader title="Connection" />
    <GlassPanel style={styles.stack}>
      <Text style={styles.body}>The Astra workstation service runs independently of this project. Your paired phone connects directly over the local network. Check the address below, then tap Connect.</Text>
      <Text style={styles.label}>BRIDGE ADDRESS</Text>
      <TextInput accessibilityLabel="Bridge address" value={address} onChangeText={setAddress} autoCapitalize="none" autoCorrect={false} keyboardType="url" placeholder="http://192.168.1.42:8765" placeholderTextColor={colors.textFaint} style={styles.input} />
      <Text style={styles.label}>OPTIONAL TOKEN · LEAVE EMPTY FOR THIS PHONE</Text>
      <TextInput accessibilityLabel="Pairing token" value={token} onChangeText={setToken} secureTextEntry autoCapitalize="none" autoCorrect={false} placeholder="Not required for the local phone service" placeholderTextColor={colors.textFaint} style={styles.input} />
      <Button label="Connect" icon="server" loading={busy} onPress={() => void pair()} />
      {status ? <Button label="Use this machine" variant="secondary" onPress={() => { selectMachine(id); void refresh(); setMessage('Machine selected.'); }} /> : null}
      <Text accessibilityLiveRegion="polite" style={styles.body}>{message ?? connectionErrors[id] ?? ''}</Text>
    </GlassPanel>
    <Text style={styles.security}>Direct local connection. Your phone is trusted by the workstation service; agent credentials remain on the laptop.</Text>
    {status ? <><SectionHeader title="Host workspace" /><Text selectable style={styles.body}>{status.cwd}</Text></> : null}
    <SectionHeader title="Sessions" />
    <View style={styles.stack}>{sessions.filter(s => s.deviceId === id).map(s => <SessionRow key={s.id} session={s} />)}</View>
  </Shell>;
}
const styles = StyleSheet.create({
  stack: { gap: space.md },
  body: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 14, lineHeight: 22 },
  label: { color: colors.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.2 },
  input: { minHeight: layout.touch, paddingHorizontal: space.md, color: colors.text, fontFamily: fonts.mono, fontSize: 13, borderWidth: 1, borderColor: colors.hairlineStrong, borderRadius: radius.md, backgroundColor: colors.canvas },
  security: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 12, lineHeight: 20, marginTop: space.lg },
});
