import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DiffCard, summarizeDiff } from '../../../components/agent/DiffCard';
import { UnknownRoute } from '../../../components/agent/Notices';
import { useProviderParam } from '../../../components/agent/useRouteParams';
import { Chip } from '../../../components/ui/Chip';
import { Button } from '../../../components/ui/Button';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Shell } from '../../../components/ui/Shell';
import { useAstra } from '../../../state/agent-store';
import { bridgeRequest } from '../../../transport/lan';
import { colors, fonts, space } from '../../../theme/tokens';

export default function ChangesScreen() {
  const provider = useProviderParam();
  if (!provider) return <UnknownRoute title="Unknown agent" detail="This agent is not registered." />;
  return <LiveChanges provider={provider.id} />;
}
function LiveChanges({ provider }: { provider: import('../../../transport').ProviderId }) {
  const { selectedMachine, settings } = useAstra();
  const workspace = settings[provider].extra.workspace;
  const [data, setData] = useState<{ diff: string; untracked: string } | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let cancelled = false;
    void bridgeRequest<{ diff: string; untracked: string }>(selectedMachine, '/v1/diff', { workspace })
      .then(value => { if (!cancelled) { setData(value); setFailure(null); } })
      .catch(error => { if (!cancelled) setFailure(error instanceof Error ? error.message : String(error)); });
    return () => { cancelled = true; };
  }, [selectedMachine, workspace, revision]);
  const patches = data?.diff.split(/(?=^diff --git )/m).filter(patch => patch.trim()) ?? [];
  return <Shell title="Working tree" eyebrow={selectedMachine.name + ' · ' + provider} back>
    <Chip label="Live host Git · read only" tone="live" dot />
    <View style={{ marginTop: space.md }}><Button label="Refresh changes" variant="secondary" onPress={() => setRevision(r => r + 1)} /></View>
    <SectionHeader title="Tracked changes" detail={String(patches.length)} />
    {failure ? <Text style={styles.error}>{failure}</Text> : !data ? <Text style={styles.body}>Reading workstation changes…</Text> : null}
    {!failure && data && patches.length === 0 ? <Text style={styles.body}>No tracked changes.</Text> : null}
    <View style={styles.list}>{patches.map((text, index) => <DiffCard key={index} initiallyOpen diff={summarizeDiff({ id: String(index), ts: 0, kind: 'diff', text })} />)}</View>
    {data?.untracked ? <><SectionHeader title="Untracked paths" /><Text selectable style={styles.body}>{data.untracked}</Text></> : null}
  </Shell>;
}
const styles = StyleSheet.create({
  body: { color: colors.textMuted, fontFamily: fonts.mono, fontSize: 12, lineHeight: 20 },
  error: { color: colors.warning, fontFamily: fonts.regular, lineHeight: 22 },
  list: { gap: space.md },
});
