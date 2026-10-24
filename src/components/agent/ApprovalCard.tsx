import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, space, type as typeScale } from '../../theme/tokens';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { GlassPanel } from '../ui/GlassPanel';
import { StatusDot } from '../ui/StatusDot';
import type { ApprovalState } from './useApprovalDecisions';

type ApprovalCardProps = {
  text: string;
  state: ApprovalState;
  context?: string;
  onDecide: (decision: 'allow' | 'deny') => void;
};

export function ApprovalCard({ text, state, context, onDecide }: ApprovalCardProps) {
  const resolved = state === 'allow' || state === 'deny';
  const sending = state === 'sending';

  return (
    <GlassPanel active={!resolved && state !== 'failed'} style={styles.panel}>
      <View style={styles.head}>
        <StatusDot color={resolved ? (state === 'allow' ? colors.success : colors.danger) : colors.warning} size={8} />
        <Text style={styles.label}>{resolved ? 'APPROVAL RESOLVED' : 'APPROVAL REQUIRED'}</Text>
      </View>
      {context ? <Text style={styles.context}>{context}</Text> : null}
      <Text selectable style={styles.text}>
        {text}
      </Text>
      {resolved ? (
        <Chip
          label={state === 'allow' ? 'ALLOWED' : 'DENIED'}
          tone={state === 'allow' ? 'success' : 'danger'}
          dot
        />
      ) : (
        <>
          {state === 'failed' ? <Text style={styles.failure}>ERROR · DECISION NOT DELIVERED · RETRY</Text> : null}
          <View style={styles.actions}>
            <Button
              label="Allow"
              icon="check"
              disabled={sending}
              loading={sending}
              onPress={() => onDecide('allow')}
              accessibilityLabel="Allow requested action"
              style={styles.action}
            />
            <Button
              label="Deny"
              icon="x"
              variant="danger"
              disabled={sending}
              onPress={() => onDecide('deny')}
              accessibilityLabel="Deny requested action"
              style={styles.action}
            />
          </View>
        </>
      )}
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: space.md,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.warning,
  },
  context: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.textFaint,
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: typeScale.base,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: space.md,
  },
  action: {
    flex: 1,
  },
  failure: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.danger,
  },
});
