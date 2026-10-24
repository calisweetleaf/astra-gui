import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, space } from '../../theme/tokens';

type GlassPanelProps = {
  children?: ReactNode;
  tier?: 'primary' | 'secondary' | 'command';
  active?: boolean;
  glow?: boolean;
  dimmed?: boolean;
  padded?: boolean;
  corner?: 'lg' | 'xl';
  style?: StyleProp<ViewStyle>;
};

export const glowStyle: ViewStyle = Platform.select<ViewStyle>({
  ios: {
    shadowColor: colors.accentViolet,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  web: {
    boxShadow: '0 0 24px rgba(139, 92, 246, 0.35)',
  },
  default: {
    shadowColor: colors.accentViolet,
    elevation: 8,
  },
}) as ViewStyle;

export function GlassPanel({
  children,
  tier = 'primary',
  active = false,
  glow = false,
  dimmed = false,
  padded = true,
  corner = 'lg',
  style,
}: GlassPanelProps) {
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.glass[tier],
          borderRadius: corner === 'xl' ? radius.xl : radius.lg,
          borderColor: active ? colors.accent : colors.hairline,
        },
        padded && styles.padded,
        glow && glowStyle,
        dimmed && styles.dimmed,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
  },
  padded: {
    padding: space.lg,
  },
  dimmed: {
    opacity: 0.5,
  },
});
