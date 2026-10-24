import { useState } from 'react';
import { Text } from 'react-native';
import { Composer } from '../../../../components/agent/Composer';
import { NativeTerminal } from '../../../../components/agent/NativeTerminal';
import { UnknownRoute } from '../../../../components/agent/Notices';
import { machineFor } from '../../../../components/agent/format';
import { useProviderParam, useSessionParam } from '../../../../components/agent/useRouteParams';
import { Shell } from '../../../../components/ui/Shell';
import { useAstra } from '../../../../state/agent-store';
import { bridgeRequest } from '../../../../transport/lan';
import { colors } from '../../../../theme/tokens';

export default function SessionScreen() {
  const provider = useProviderParam();
  const sid = useSessionParam();
  const { machines, sessions, selectedMachine } = useAstra();
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  if (!provider || !sid) return <UnknownRoute title="Unknown session" detail="Invalid agent or session." />;
  const session = sessions.find(s => s.id === sid && s.provider === provider.id);
  const machine = (session && machineFor(machines, session.deviceId)) ?? selectedMachine;
  const submit = async (text: string) => {
    setBusy(true); setFailure(null);
    try { await bridgeRequest(machine, '/v1/sessions/' + sid + '/input', { text }); }
    catch (error) { setFailure(error instanceof Error ? error.message : String(error)); throw error; }
    finally { setBusy(false); }
  };
  return <Shell title={session?.title ?? provider.name} eyebrow={provider.name + ' · ' + machine.name} back scroll={false}
    footer={<><Text accessibilityLiveRegion="polite" style={{ color: colors.warning, paddingHorizontal: 20 }}>{failure ?? ''}</Text><Composer commands={[]} onSubmit={submit} busy={busy} disabled={session?.status === 'idle' || session?.status === 'error'} /></>}>
    <NativeTerminal machine={machine} sid={sid} />
  </Shell>;
}
