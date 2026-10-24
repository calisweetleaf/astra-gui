import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, type as typeScale } from '../../theme/tokens';

type MetricProps = {
  label: string;
  value: string | number;
  unit?: string;
  large?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function Metric({ label, value, unit, large = false, color = colors.text, style }: MetricProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${label} ${value}${unit ? ` ${unit}` : ''}`}
      style={style}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[large ? styles.large : styles.value, { color }]}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  value: {
    fontFamily: fonts.mono,
    fontSize: typeScale.emphasis,
    fontVariant: ['tabular-nums'],
  },
  large: {
    fontFamily: fonts.display,
    fontSize: typeScale.headline,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontFamily: fonts.mono,
    fontSize: typeScale.micro,
    marginLeft: 4,
    color: colors.textMuted,
  },
});
