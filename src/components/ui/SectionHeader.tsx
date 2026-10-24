import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, space } from '../../theme/tokens';

type SectionHeaderProps = {
  title: string;
  detail?: string;
};

export function SectionHeader({ title, detail }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.xl,
    marginBottom: space.md,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  detail: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.textFaint,
    fontVariant: ['tabular-nums'],
  },
});
