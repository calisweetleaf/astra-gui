import { StyleSheet } from 'react-native';

/**
 * Astra visual contract — Somnus modernized.
 * Tokens only: components never hardcode a color, radius, or duration.
 * Canvas stays cool obsidian; accent is restrained blue-violet; the accent
 * area stays small (primary action, active state, focused session only).
 */
export const colors = {
  canvas: '#05070B',
  surface: '#0A0E15',
  panel: '#0F141D',
  raised: '#151B26',
  hairline: 'rgba(148, 163, 184, 0.10)',
  hairlineStrong: 'rgba(148, 163, 184, 0.18)',
  text: '#F8FAFC',
  textSecondary: '#E2E8F0',
  textMuted: '#94A3B8',
  textFaint: '#64748B',
  accent: '#3B82F6',
  accentViolet: '#8B5CF6',
  live: '#06B6D4',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  glass: {
    command: 'rgba(8, 12, 18, 0.96)',
    primary: 'rgba(15, 20, 28, 0.92)',
    secondary: 'rgba(22, 29, 39, 0.85)',
  },
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  mono: 'JetBrainsMono_400Regular',
  display: 'SpaceGrotesk_500Medium',
} as const;

export const type = { micro: 11, body: 13, base: 15, emphasis: 17, title: 22, headline: 28, display: 34 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 24 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const motion = { fast: 150, base: 300, slow: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' } as const;

/** Shadow ladder — soft black elevation; colored glow only on active/running states. */
export const shadow = {
  sm: { shadowColor: '#000000', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 4 } },
  glass: { shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 32, shadowOffset: { width: 0, height: 8 } },
  elevated: { shadowColor: '#000000', shadowOpacity: 0.45, shadowRadius: 48, shadowOffset: { width: 0, height: 12 } },
} as const;

/** One glow, active states only. Colors pair with shadowColor on the same view. */
export const glow = {
  live: { shadowColor: '#06B6D4', shadowOpacity: 0.35, shadowRadius: 40, shadowOffset: { width: 0, height: 0 } },
  active: { shadowColor: '#8B5CF6', shadowOpacity: 0.35, shadowRadius: 40, shadowOffset: { width: 0, height: 0 } },
  critical: { shadowColor: '#EF4444', shadowOpacity: 0.3, shadowRadius: 32, shadowOffset: { width: 0, height: 0 } },
} as const;

/**
 * Android blur contract (SDK 57 expo-blur): wrap content in BlurTargetView and
 * pass blurTarget + blurMethod — 'none' renders no blur. Efficient blur wants
 * Android 12+; 'dimezisBlurViewSdk31Plus' degrades cleanly. borderRadius is
 * ignored on blur views: wrap with overflow: 'hidden'. Render BlurView AFTER
 * dynamic content or the blur can freeze.
 */
export const blur = { intensity: { low: 20, high: 40 }, method: 'dimezisBlurViewSdk31Plus' } as const;
export const layout = { gutter: 20, gap: 12, maxContent: 1100, sidebar: 260, touch: 48 } as const;

export const common = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  label: { color: colors.textMuted, fontFamily: fonts.medium, fontSize: 10, letterSpacing: 1.8 },
  mono: { color: colors.textMuted, fontFamily: fonts.mono, fontSize: 11, lineHeight: 19, fontVariant: ['tabular-nums'] },
  card: { backgroundColor: colors.glass.primary, borderWidth: 1, borderColor: colors.hairline, borderRadius: radius.lg },
});
