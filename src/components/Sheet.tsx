import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { common, theme as t } from '../theme';
import { IconButton } from './Primitives';

export function Sheet({ title, open, onClose, children }: React.PropsWithChildren<{ title: string; open: boolean; onClose: () => void }>) {
  return <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
    <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Pressable accessibilityLabel="Dismiss panel" accessibilityRole="button" style={StyleSheet.absoluteFill} onPress={onClose} />
      <SafeAreaView edges={['bottom']} style={s.sheet}>
        <View style={[common.between, { paddingLeft: 24, paddingRight: 12 }]}><Text style={common.title}>{title}</Text>
          <IconButton name="x" label="Close panel" onPress={onClose} /></View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24, paddingTop: 16, gap: 16 }}>{children}</ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  </Modal>;
}
const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#000000AA', alignItems: 'center', justifyContent: 'flex-end' },
  sheet: { width: '100%', maxWidth: 620, maxHeight: '85%', backgroundColor: t.color.surface, borderColor: t.color.lineStrong,
    borderWidth: 1, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingTop: 12 },
});
