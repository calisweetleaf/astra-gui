import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { common, theme as t } from '../theme';

export type IconName = React.ComponentProps<typeof Feather>['name'];
export function Icon({ name, size = 18, color = t.color.muted }: { name: IconName; size?: number; color?: string }) {
  return <Feather name={name} size={size} color={color} />;
}
export function IconButton({ name, label, onPress, active = false }: { name: IconName; label: string; onPress: () => void; active?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
    style={({ pressed }) => [s.iconButton, active && s.active, pressed && s.pressed]}>
    <Icon name={name} color={active ? t.color.accent : t.color.text} />
  </Pressable>;
}
export function Action({ label, icon, onPress, primary = false, style }: {
  label: string; icon?: IconName; onPress: () => void; primary?: boolean; style?: StyleProp<ViewStyle>;
}) {
  return <Pressable accessibilityRole="button" onPress={onPress}
    style={({ pressed }) => [s.action, primary && s.primary, style, pressed && s.pressed]}>
    {icon && <Icon name={icon} size={16} color={primary ? t.color.canvas : t.color.text} />}
    <Text style={[s.actionText, primary && { color: t.color.canvas }]}>{label}</Text>
  </Pressable>;
}
export function SectionHeading({ title, detail }: { title: string; detail?: string }) {
  return <View style={[common.between, { marginBottom: 14 }]}><Text style={common.label}>{title}</Text>
    {detail && <Text style={common.mono}>{detail}</Text>}</View>;
}
export function Dot({ active = true }: { active?: boolean }) {
  return <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: active ? t.color.accent : t.color.quiet }} />;
}
export const s = StyleSheet.create({
  iconButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  active: { backgroundColor: t.color.accentWash }, pressed: { opacity: 0.65 },
  action: { minHeight: 48, paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    backgroundColor: t.color.raised, borderWidth: 1, borderColor: t.color.line, borderRadius: 12 },
  primary: { backgroundColor: t.color.accent, borderColor: t.color.accent },
  actionText: { fontFamily: t.font.medium, fontSize: 12, color: t.color.text },
});
