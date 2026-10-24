import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
import { useReducedMotion } from './useReducedMotion';

type StatusDotProps = {
  color?: string;
  size?: number;
  pulse?: boolean;
};

export function StatusDot({ color = colors.success, size = 8, pulse = false }: StatusDotProps) {
  const reduced = useReducedMotion();
  const [opacity] = useState(() => new Animated.Value(1));
  const animate = pulse && !reduced;

  useEffect(() => {
    if (!animate) {
      opacity.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animate, opacity]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        styles.dot,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {},
});
