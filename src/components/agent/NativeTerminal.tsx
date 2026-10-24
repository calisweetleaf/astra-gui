import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { bridgeRequest, readScreen, sendKey, stopSession } from '../../transport/lan';
import type { Machine } from '../../transport';
import { colors, fonts, space } from '../../theme/tokens';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';

const keys = [['enter', 'Enter'], ['tab', 'Tab'], ['escape', 'Esc'], ['interrupt', 'Ctrl C'], ['up', '↑'], ['down', '↓'], ['left', '←'], ['right', '→']] as const;
export function NativeTerminal({ machine, sid }: { machine: Machine; sid: string }) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [exited, setExited] = useState(false);
  const [pending, setPending] = useState(false);
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const following = useRef(true);
  const columns = Math.max(30, Math.min(120, Math.floor((width - 40) / 7.25)));
  useEffect(() => {
    void bridgeRequest(machine, '/v1/sessions/' + sid + '/resize', { cols: columns, rows: 28 }).catch(e => setError(String(e)));
  }, [machine, sid, columns]);
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let revision = -1;
    const poll = async () => {
      let delay = 500;
      try {
        if (AppState.currentState === 'active') {
          const screen = await readScreen(machine, sid);
          if (cancelled) return;
          if (screen.revision !== revision) { setText(screen.text); revision = screen.revision; }
          setExited(screen.exited); setError(null);
          if (screen.exited) return;
        }
      } catch (e) { if (!cancelled) setError(e instanceof Error ? e.message : String(e)); delay = 3000; }
      if (!cancelled) timer = setTimeout(() => { void poll(); }, delay);
    };
    void poll();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [machine, sid]);
  const act = useCallback(async (key: string) => {
    setPending(true);
    try { await sendKey(machine, sid, key); setError(null); }
    catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setPending(false); }
  }, [machine, sid]);
  return <View style={styles.root}>
    <View style={styles.status}>
      <Chip label={error ? 'Reconnecting' : exited ? 'Process exited' : 'Host terminal'} tone={error ? 'warning' : exited ? 'neutral' : 'live'} dot />
      {!exited ? <Button label="Stop" compact variant="danger" disabled={pending} onPress={() => {
        setPending(true);
        void stopSession(machine, sid).catch(e => setError(String(e))).finally(() => setPending(false));
      }} /> : null}
    </View>
    {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
    <ScrollView ref={scrollRef} style={styles.screen} contentContainerStyle={styles.screenContent}
      onScroll={({ nativeEvent: e }) => { following.current = e.contentOffset.y + e.layoutMeasurement.height >= e.contentSize.height - 60; }}
      scrollEventThrottle={100} onContentSizeChange={() => { if (following.current) scrollRef.current?.scrollToEnd({ animated: false }); }}>
      <ScrollView horizontal>
        <Text selectable style={[styles.terminal, { minWidth: columns * 7.25 }]}>
          {text || (exited ? 'This process has exited.' : 'Connecting to the host terminal…\n\nYour agent runs on the workstation. This phone is a native display and input surface.')}
        </Text>
      </ScrollView>
    </ScrollView>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.keys}>
      {keys.map(([key, label]) => <Button key={key} label={label} compact variant="secondary" disabled={exited || pending} onPress={() => void act(key)} accessibilityLabel={'Terminal ' + key} />)}
    </ScrollView>
  </View>;
}
const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: space.sm },
  status: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  screen: { flex: 1, marginTop: space.md },
  screenContent: { paddingBottom: space.lg },
  terminal: { fontFamily: fonts.mono, color: colors.textSecondary, fontSize: 12, lineHeight: 19 },
  error: { fontFamily: fonts.regular, color: colors.warning, fontSize: 13, marginTop: space.sm },
  keys: { gap: space.sm, paddingVertical: space.sm },
});
