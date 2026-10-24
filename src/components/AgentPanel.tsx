import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Provider } from '../data';
import { common, theme as t } from '../theme';
import { Icon } from './Primitives';

export function AgentPanel({ provider, onOpen, width }: { provider: Provider; onOpen: () => void; width?: number }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${provider.name} workspace`} onPress={onOpen}
    style={({ pressed }) => [s.panel, { width: width ?? '100%' }, pressed && { borderColor: t.color.accent }]}>
    <View style={common.between}><View style={s.mark}><Text style={s.markText}>{provider.mark}</Text></View>
      <Icon name="arrow-up-right" size={19} /></View>
    <Text style={s.name}>{provider.name}</Text><Text style={s.maker}>{provider.maker}</Text>
    <View style={s.divider} />
    <Text style={s.task} numberOfLines={2}>{provider.task}</Text>
    <View style={[common.between, { marginTop: 16 }]}><Text style={common.mono}>{provider.id === 'opencode' ? '02' : '01'} sessions</Text>
      <View style={s.status}><View style={s.dot} /><Text style={s.statusText}>Ready</Text></View></View>
  </Pressable>;
}
const s = StyleSheet.create({
  panel: { ...common.card, padding: 18, minHeight: 231 },
  mark: { width: 40, height: 40, backgroundColor: t.color.raised, borderWidth: 1, borderColor: t.color.lineStrong, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  markText: { fontFamily: t.font.mono, fontSize: 19, color: t.color.text, letterSpacing: -1.5 },
  name: { fontFamily: t.font.semibold, fontSize: 21, letterSpacing: -0.8, color: t.color.text, marginTop: 20 },
  maker: { ...common.label, fontSize: 8, letterSpacing: 1.4, marginTop: 5 },
  divider: { height: 1, backgroundColor: t.color.line, marginVertical: 18 },
  task: { fontFamily: t.font.regular, fontSize: 12, color: t.color.muted, lineHeight: 18, minHeight: 36 },
  status: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: { width: 4, height: 4, borderRadius: 3, backgroundColor: t.color.accent },
  statusText: { fontFamily: t.font.medium, fontSize: 10, color: t.color.accent },
});
