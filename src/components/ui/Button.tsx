import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, layout, radius, space, type as typeScale } from '../../theme/tokens';
import { Icon, type IconName } from './Icon';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  compact?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  compact = false,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const inactive = disabled || loading;
  const labelColor = variant === 'primary' ? colors.canvas : variant === 'danger' ? colors.danger : colors.text;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => undefined);
    }
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={[colors.accent, colors.accentViolet]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={labelColor} />
        ) : icon ? (
          <Icon name={icon} size={16} color={labelColor} />
        ) : null}
        <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.touch,
    minWidth: layout.touch,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  compact: {
    paddingHorizontal: space.md,
  },
  secondary: {
    backgroundColor: colors.raised,
    borderColor: colors.hairlineStrong,
  },
  danger: {
    backgroundColor: colors.raised,
    borderColor: colors.danger,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: typeScale.base,
  },
});
