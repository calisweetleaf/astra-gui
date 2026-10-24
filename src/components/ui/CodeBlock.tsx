import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radius, space, type as typeScale } from '../../theme/tokens';

export type CodeRole = 'command' | 'output' | 'tool' | 'error';

export type CodeLine = {
  text: string;
  role?: CodeRole;
};

const roleColor: Record<CodeRole, string> = {
  command: colors.text,
  output: colors.textSecondary,
  tool: colors.live,
  error: colors.danger,
};

type CodeBlockProps = {
  lines: CodeLine[];
  style?: StyleProp<ViewStyle>;
};

export function CodeBlock({ lines, style }: CodeBlockProps) {
  return (
    <View style={[styles.block, style]}>
      {lines.map((line, index) => (
        <Text
          key={`${index}:${line.text.slice(0, 16)}`}
          selectable
          style={[styles.line, { color: roleColor[line.role ?? 'output'] }]}
        >
          {line.text}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.canvas,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: space.md,
    gap: 2,
  },
  line: {
    fontFamily: fonts.mono,
    fontSize: typeScale.body,
    lineHeight: 20,
    fontVariant: ['tabular-nums'],
  },
});
