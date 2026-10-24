import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, layout, radius, space } from '../../theme/tokens';
import { Icon, type IconName } from './Icon';
import { StatusDot } from './StatusDot';

export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'live';

export const toneColor: Record<Tone, string> = {
  neutral: colors.textSecondary,
  accent: colors.accent,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  live: colors.live,
};

type ChipProps = {
  label: string;
  tone?: Tone;
  icon?: IconName;
  dot?: boolean;
  pulse?: boolean;
  selected?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Chip({
  label,
  tone = 'neutral',
  icon,
  dot = false,
  pulse = false,
  selected = false,
  onPress,
  accessibilityLabel,
  style,
}: ChipProps) {
  const color = selected ? colors.accent : toneColor[tone];

  const body = (
    <View style={[styles.chip, { borderColor: selected ? colors.accent : colors.hairlineStrong }]}>
      {dot ? <StatusDot color={color} size={6} pulse={pulse} /> : null}
      {icon ? <Icon name={icon} size={12} color={color} /> : null}
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );

  if (!onPress) {
    return (
      <View style={[styles.static, style]} accessibilityLabel={accessibilityLabel ?? label}>
        {body}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.touch, pressed && styles.pressed, style]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  static: {
    alignSelf: 'flex-start',
  },
  touch: {
    minHeight: layout.touch,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.7,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 2,
    minHeight: 28,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    backgroundColor: colors.raised,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
});
