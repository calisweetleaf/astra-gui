import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Provider, TerminalLine } from '../data';
import { common, theme as t } from '../theme';
import { Icon, IconButton } from './Primitives';

export function TerminalDrawer({ open, onToggle, provider, lines, onSubmit, bottom, sidebar }: {
  open: boolean; onToggle: () => void; provider: Provider; lines: TerminalLine[];
  onSubmit: (input: string) => void; bottom: number; sidebar: number;
}) {
  const { height } = useWindowDimensions();
  const [input, setInput] = useState('');
  const [reduceMotion, setReduceMotion] = useState(false);
  const animatedHeight = useRef(new Animated.Value(70)).current;
  const scroll = useRef<ScrollView>(null);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => listener.remove();
  }, []);
  useEffect(() => {
    Animated.timing(animatedHeight, { toValue: open ? Math.min(410, height * 0.62) : 70,
      duration: reduceMotion ? 0 : t.motion.drawer, useNativeDriver: false }).start();
  }, [open, height, reduceMotion, animatedHeight]);
  const suggestions = input.startsWith('/') ? provider.commands.filter(c => c.name.startsWith(input.trim())) : [];
  const submit = () => { if (input.trim()) { onSubmit(input.trim()); setInput(''); } };
  return <Animated.View style={[s.drawer, { height: animatedHeight, bottom: bottom + 12, left: sidebar + 12 }]}>
    <Pressable accessibilityRole="button" accessibilityLabel={open ? 'Collapse terminal' : 'Expand terminal'} accessibilityState={{ expanded: open }} onPress={onToggle} style={s.header}>
      <View style={s.terminalIcon}><Icon name="terminal" color={t.color.accent} size={17} /></View>
      <View style={{ flex: 1 }}><Text style={s.title}>Terminal<Text style={s.provider}>  /  {provider.name}</Text></Text>
        <Text style={s.subtitle}>{open ? 'LOCAL DEMO' : 'Your command line, one gesture away.'}</Text></View>
      <Icon name={open ? 'chevron-down' : 'chevron-up'} size={18} />
    </Pressable>
    {open && <View style={s.body}>
      <ScrollView ref={scroll} style={{ flex: 1 }} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}>
        {lines.map(line => <Text selectable key={line.id} style={[s.line, { color: t.syntax[line.kind] }]}>{line.text}</Text>)}
      </ScrollView>
      {suggestions.length > 0 && <ScrollView style={s.suggestions} keyboardShouldPersistTaps="handled">
        {suggestions.map(c => <Pressable accessibilityRole="button" key={c.name} onPress={() => setInput(c.name + ' ')} style={s.suggestion}>
          <Text style={s.command}>{c.name}</Text><Text style={s.hint}>{c.detail}</Text>
        </Pressable>)}
      </ScrollView>}
      <View style={s.inputRow}><Text style={s.prompt}>❯</Text>
        <TextInput accessibilityLabel={`${provider.name} command`} style={s.input} value={input} onChangeText={setInput}
          placeholder="Ask, instruct, or type /" placeholderTextColor={t.color.quiet} autoCapitalize="none" autoCorrect={false}
          onSubmitEditing={submit} returnKeyType="send" />
        <IconButton name="arrow-up" label="Send command" onPress={submit} active />
      </View>
    </View>}
  </Animated.View>;
}
const s = StyleSheet.create({
  drawer: { position: 'absolute', right: 12, backgroundColor: t.color.surface, borderColor: t.color.lineStrong, borderWidth: 1,
    borderRadius: t.radius.drawer, overflow: 'hidden', elevation: 12, shadowColor: '#000', shadowOpacity: 0.65, shadowRadius: 22, shadowOffset: { width: 0, height: -8 } },
  header: { height: 69, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 12 },
  terminalIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: t.color.accentWash, justifyContent: 'center', alignItems: 'center' },
  title: { fontFamily: t.font.medium, fontSize: 13, color: t.color.text },
  provider: { color: t.color.muted, fontSize: 11 },
  subtitle: { fontFamily: t.font.mono, color: t.color.muted, fontSize: 9, marginTop: 5 },
  body: { flex: 1, borderTopWidth: 1, borderTopColor: t.color.line, paddingTop: 14, paddingHorizontal: 16 },
  line: { fontFamily: t.font.mono, fontSize: 11, lineHeight: 21 },
  inputRow: { borderTopWidth: 1, borderTopColor: t.color.line, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, marginTop: 8 },
  prompt: { color: t.color.accent, fontFamily: t.font.mono, fontSize: 18 },
  input: { flex: 1, minWidth: 0, minHeight: 48, color: t.color.text, fontFamily: t.font.mono, fontSize: 14 },
  suggestions: { maxHeight: 150, backgroundColor: t.color.inset, borderRadius: 10, marginTop: 8 },
  suggestion: { minHeight: 48, padding: 10, gap: 4 },
  command: { ...common.mono, color: t.color.accent }, hint: { ...common.mono, fontSize: 10 },
});
