import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, layout, radius, space, type as typeScale } from '../../theme/tokens';
import { Icon } from './Icon';
import { useReducedMotion } from './useReducedMotion';

type SheetProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Sheet({ visible, title, onClose, children }: SheetProps) {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType={reduced ? 'none' : 'slide'}
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Dismiss ${title}`}
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        >
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.scrim} />
        </Pressable>
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, space.lg) }]}>
          <View style={styles.handle} />
          <View style={styles.titleRow}>
            <Text accessibilityRole="header" style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Close ${title}`}
              onPress={onClose}
              hitSlop={8}
              style={({ pressed }) => [styles.close, pressed && styles.pressed]}
            >
              <Icon name="x" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(5, 7, 11, 0.6)',
  },
  sheet: {
    maxHeight: '85%',
    width: '100%',
    maxWidth: layout.maxContent,
    alignSelf: 'center',
    backgroundColor: colors.glass.command,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.hairlineStrong,
    paddingHorizontal: space.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: space.sm,
    backgroundColor: colors.hairlineStrong,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: layout.touch,
    marginTop: space.xs,
  },
  title: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: typeScale.emphasis,
    color: colors.text,
  },
  close: {
    width: layout.touch,
    height: layout.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  body: {
    gap: space.md,
    paddingBottom: space.md,
  },
});
