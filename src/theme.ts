import { StyleSheet } from 'react-native';

/** Astra's visual contract. Change the accent here, never inside a component. */
export const theme = {
  color: {
    canvas: '#000000', surface: '#121212', raised: '#191919', inset: '#090909',
    line: '#292929', lineStrong: '#404040', text: '#FFFFFF', muted: '#A0A09A',
    quiet: '#777770', accent: '#D7FF62', accentWash: '#202617',
  },
  syntax: {
    command: '#FFFFFF', variable: '#D7FF62', string: '#CCCCBF',
    comment: '#92928B', path: '#B9B9B3', error: '#FFFFFF',
  },
  font: { regular: 'Inter_400Regular', medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold', mono: 'JetBrainsMono_400Regular' },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  radius: { small: 10, card: 20, drawer: 24, pill: 100 },
  layout: { gutter: 20, gap: 12, maxContent: 1100, sidebar: 240, touch: 48 },
  motion: { drawer: 220 },
} as const;

export const common = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  label: { color: theme.color.muted, fontFamily: theme.font.medium, fontSize: 10, letterSpacing: 1.8 },
  title: { color: theme.color.text, fontFamily: theme.font.semibold, fontSize: 24, letterSpacing: -0.8 },
  body: { color: theme.color.text, fontFamily: theme.font.regular, fontSize: 14, lineHeight: 22 },
  mono: { color: theme.color.muted, fontFamily: theme.font.mono, fontSize: 11, lineHeight: 19 },
  card: { backgroundColor: theme.color.surface, borderWidth: 1, borderColor: theme.color.line, borderRadius: theme.radius.card },
});
