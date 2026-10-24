import { useCallback, useRef } from 'react';
import { FlatList, StyleSheet, Text, View, type ListRenderItemInfo } from 'react-native';
import { colors, fonts, space, type as typeScale } from '../../theme/tokens';
import type { StreamEvent } from '../../transport';
import { Chip } from '../ui/Chip';
import { useReducedMotion } from '../ui/useReducedMotion';
import { ApprovalCard } from './ApprovalCard';
import { DiffCard, summarizeDiff } from './DiffCard';
import { approvalIdOf, type ApprovalState } from './useApprovalDecisions';

type StreamViewProps = {
  events: StreamEvent[];
  approvalStates: Record<string, ApprovalState>;
  onDecide: (event: StreamEvent, decision: 'allow' | 'deny') => void;
  busy?: boolean;
  emptyLabel?: string;
};

export function StreamView({ events, approvalStates, onDecide, busy = false, emptyLabel }: StreamViewProps) {
  const listRef = useRef<FlatList<StreamEvent>>(null);
  const reduced = useReducedMotion();

  const scrollToEnd = useCallback(() => {
    listRef.current?.scrollToEnd({ animated: !reduced });
  }, [reduced]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<StreamEvent>) => {
      switch (item.kind) {
        case 'command':
          return (
            <Text selectable style={styles.command}>
              <Text style={styles.prompt}>❯ </Text>
              {item.text.replace(/^\$\s*/, '')}
            </Text>
          );
        case 'output':
          return (
            <Text selectable style={styles.output}>
              {item.text}
            </Text>
          );
        case 'tool': {
          const tool = typeof item.meta?.tool === 'string' ? item.meta.tool : 'tool';
          return (
            <View style={styles.toolRow}>
              <Chip label={tool} tone="live" icon="tool" />
              <Text selectable style={styles.toolText} numberOfLines={2}>
                {item.text}
              </Text>
            </View>
          );
        }
        case 'diff':
          return <DiffCard diff={summarizeDiff(item)} />;
        case 'approval': {
          const approvalId = approvalIdOf(item);
          return (
            <ApprovalCard
              text={item.text}
              state={approvalStates[approvalId] ?? 'pending'}
              onDecide={(decision) => onDecide(item, decision)}
            />
          );
        }
        case 'error':
          return (
            <View style={styles.errorBlock}>
              <Text style={styles.errorLabel}>ERROR</Text>
              <Text selectable style={styles.errorText}>
                {item.text}
              </Text>
            </View>
          );
        case 'system':
          return (
            <Text selectable style={styles.system}>
              {item.text}
            </Text>
          );
      }
    },
    [approvalStates, onDecide],
  );

  return (
    <FlatList
      ref={listRef}
      data={events}
      keyExtractor={(event) => event.id}
      renderItem={renderItem}
      onContentSizeChange={scrollToEnd}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={
        <Text style={styles.empty}>{emptyLabel ?? 'NO EVENTS'}</Text>
      }
      ListFooterComponent={
        busy ? (
          <View style={styles.busy}>
            <Chip label="Streaming" tone="live" dot pulse />
          </View>
        ) : null
      }
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.list}
    />
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingTop: space.md,
    paddingBottom: space.lg,
  },
  separator: {
    height: space.md,
  },
  command: {
    fontFamily: fonts.mono,
    fontSize: typeScale.base,
    lineHeight: 22,
    color: colors.text,
  },
  prompt: {
    color: colors.accent,
  },
  output: {
    fontFamily: fonts.mono,
    fontSize: typeScale.body,
    lineHeight: 20,
    color: colors.textMuted,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  toolText: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: typeScale.body,
    color: colors.textMuted,
  },
  errorBlock: {
    gap: space.xs,
    paddingLeft: space.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.danger,
  },
  errorLabel: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.danger,
  },
  errorText: {
    fontFamily: fonts.mono,
    fontSize: typeScale.body,
    color: colors.textSecondary,
  },
  system: {
    fontFamily: fonts.regular,
    fontStyle: 'italic',
    fontSize: typeScale.body,
    color: colors.textMuted,
  },
  empty: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.8,
    color: colors.textFaint,
  },
  busy: {
    paddingTop: space.md,
  },
});
