import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, space, type as typeScale } from '../../theme/tokens';
import type { StreamEvent } from '../../transport';
import { GlassPanel } from '../ui/GlassPanel';
import { Icon } from '../ui/Icon';

export type DiffSummary = {
  path: string;
  additions: number;
  deletions: number;
  lines: string[];
};

export function summarizeDiff(event: StreamEvent): DiffSummary {
  const lines = event.text.split('\n');
  const header = lines.find((line) => line.startsWith('+++ '));
  const path = header ? header.replace(/^\+\+\+ (b\/)?/, '').trim() : 'unknown path';

  const counted = (prefix: '+' | '-') =>
    lines.filter((line) => line.startsWith(prefix) && !line.startsWith(`${prefix}${prefix}${prefix}`)).length;

  const additions = typeof event.meta?.additions === 'number' ? event.meta.additions : counted('+');
  const deletions = typeof event.meta?.deletions === 'number' ? event.meta.deletions : counted('-');
  return { path, additions, deletions, lines };
}

function lineColor(line: string): string {
  if (line.startsWith('+++') || line.startsWith('---')) return colors.textMuted;
  if (line.startsWith('+')) return colors.success;
  if (line.startsWith('-')) return colors.danger;
  if (line.startsWith('@@')) return colors.live;
  return colors.textMuted;
}

type DiffCardProps = {
  diff: DiffSummary;
  initiallyOpen?: boolean;
};

export function DiffCard({ diff, initiallyOpen = false }: DiffCardProps) {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <GlassPanel padded={false}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${diff.path}, ${diff.additions} added, ${diff.deletions} removed, ${open ? 'collapse' : 'expand'} patch`}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((value) => !value)}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
      >
        <Icon name="file-text" size={16} color={colors.textMuted} />
        <Text style={styles.path} numberOfLines={1} ellipsizeMode="middle">
          {diff.path}
        </Text>
        <View style={styles.counts}>
          <Text style={[styles.count, { color: colors.success }]}>+{diff.additions} ADDED</Text>
          <Text style={[styles.count, { color: colors.danger }]}>−{diff.deletions} REMOVED</Text>
        </View>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textFaint} />
      </Pressable>
      {open ? (
        <View style={styles.patch}>
          {diff.lines.map((line, index) => (
            <Text key={`${index}:${line.slice(0, 12)}`} selectable style={[styles.patchLine, { color: lineColor(line) }]}>
              {line.length > 0 ? line : ' '}
            </Text>
          ))}
        </View>
      ) : null}
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  pressed: {
    opacity: 0.7,
  },
  path: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: typeScale.body,
    color: colors.text,
  },
  counts: {
    alignItems: 'flex-end',
    gap: 2,
  },
  count: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    fontVariant: ['tabular-nums'],
  },
  patch: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    padding: space.md,
    backgroundColor: colors.canvas,
  },
  patchLine: {
    fontFamily: fonts.mono,
    fontSize: 12,
    lineHeight: 18,
    fontVariant: ['tabular-nums'],
  },
});
