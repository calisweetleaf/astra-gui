import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, layout, radius, space, type as typeScale } from '../../theme/tokens';
import { Icon, type IconName } from './Icon';

type ListRowProps = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  icon?: IconName;
  mono?: boolean;
  selected?: boolean;
  dimmed?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  icon,
  mono = false,
  selected = false,
  dimmed = false,
  onPress,
  accessibilityLabel,
  style,
}: ListRowProps) {
  const content = (
    <>
      {leading ?? (icon ? <Icon name={icon} size={18} color={selected ? colors.accent : colors.textSecondary} /> : null)}
      <View style={styles.text}>
        <Text
          numberOfLines={1}
          style={[styles.title, mono && styles.mono, selected && { color: colors.accent }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={2} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      {onPress ? <Icon name="chevron-right" size={16} color={colors.textFaint} /> : null}
    </>
  );

  if (!onPress) {
    return <View style={[styles.row, dimmed && styles.dimmed, style]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (subtitle ? `${title}, ${subtitle}` : title)}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        selected && styles.selected,
        dimmed && styles.dimmed,
        pressed && styles.pressed,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: layout.touch + 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.glass.primary,
  },
  selected: {
    borderColor: colors.accent,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  dimmed: {
    opacity: 0.5,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: typeScale.base,
    color: colors.text,
  },
  mono: {
    fontFamily: fonts.mono,
    fontSize: typeScale.body,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: typeScale.body,
    color: colors.textMuted,
  },
});
