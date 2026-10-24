import { BlurView } from 'expo-blur';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ProviderDef } from '../../providers/registry';
import { colors, fonts, layout, radius, space, type as typeScale } from '../../theme/tokens';
import { Button } from '../ui/Button';

type ComposerProps = {
  commands: ProviderDef['commands'];
  onSubmit: (input: string) => void | Promise<void>;
  busy?: boolean;
  disabled?: boolean;
  disabledLabel?: string;
};

export function Composer({ commands, onSubmit, busy = false, disabled = false, disabledLabel }: ComposerProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [failure, setFailure] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    if (disabled || !text.startsWith('/')) return [];
    const query = text.slice(1).trim().toLowerCase();
    return commands.filter((command) => command.name.toLowerCase().includes(query));
  }, [commands, disabled, text]);

  const canSend = !disabled && !busy && text.trim().length > 0;

  const send = async () => {
    if (!canSend) return;
    setFailure(null);
    try { await onSubmit(text); setText(''); }
    catch (error) { setFailure(error instanceof Error ? error.message : String(error)); }
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.scrim} />
      <View style={styles.inner}>
        {failure ? <Text accessibilityLiveRegion="polite" style={{ color: colors.warning }}>{failure}</Text> : null}
        {suggestions.length > 0 ? (
          <View style={styles.suggestions}>
            {suggestions.map((command) => (
              <Pressable
                key={command.name}
                accessibilityRole="button"
                accessibilityLabel={`Insert command ${command.name}: ${command.detail}`}
                onPress={() => setText(`${command.name} `)}
                style={({ pressed }) => [styles.suggestion, pressed && styles.pressed]}
              >
                <Text style={styles.suggestionName}>{command.name}</Text>
                <Text style={styles.suggestionDetail} numberOfLines={1}>
                  {command.detail}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <View style={styles.row}>
          <TextInput
            accessibilityLabel="Command input"
            value={text}
            onChangeText={setText}
            onSubmitEditing={send}
            editable={!disabled}
            placeholder={disabled ? (disabledLabel ?? 'INPUT UNAVAILABLE') : 'Message or command…'}
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="send"
            submitBehavior="submit"
            selectionColor={colors.accent}
            style={styles.input}
          />
          <Button
            label="Send"
            icon="send"
            compact
            loading={busy}
            disabled={disabled || text.trim().length === 0}
            onPress={send}
            accessibilityLabel="Send command"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: 1,
    borderTopColor: colors.hairlineStrong,
    overflow: 'hidden',
    paddingTop: space.sm,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.glass.secondary,
  },
  inner: {
    width: '100%',
    maxWidth: layout.maxContent,
    alignSelf: 'center',
    paddingHorizontal: layout.gutter,
    gap: space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  input: {
    flex: 1,
    minHeight: layout.touch,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    backgroundColor: colors.canvas,
    fontFamily: fonts.mono,
    fontSize: typeScale.body,
    color: colors.text,
  },
  suggestions: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.glass.command,
    overflow: 'hidden',
  },
  suggestion: {
    minHeight: layout.touch,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
  },
  suggestionName: {
    fontFamily: fonts.mono,
    fontSize: typeScale.body,
    color: colors.text,
  },
  suggestionDetail: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.7,
  },
});
