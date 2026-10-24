import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Device } from '../data';
import { common, theme as t } from '../theme';
import { Dot, Icon, IconButton } from './Primitives';

export function DeviceStrip({ devices, selected, onSelect, onEdit }: {
  devices: Device[]; selected: string; onSelect: (id: string) => void; onEdit: (device: Device) => void;
}) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.strip}>
    {devices.map(d => <View key={d.id} style={[s.tile, selected === d.id && s.selected]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Select ${d.name}`} accessibilityState={{ selected: selected === d.id }} onPress={() => onSelect(d.id)} style={s.select}>
        <View style={[common.row, { gap: 10 }]}><Icon name="monitor" size={17} color={selected === d.id ? t.color.text : t.color.muted} />
          <Text style={s.name}>{d.name}</Text><Dot active={selected === d.id} /></View>
        <Text style={s.micro}>{d.cpu}% CPU   ·   {d.ram}</Text>
      </Pressable>
      <IconButton name="more-horizontal" label={`Edit ${d.name} address`} onPress={() => onEdit(d)} />
    </View>)}
  </ScrollView>;
}
const s = StyleSheet.create({
  strip: { gap: 10, paddingRight: 4 },
  tile: { flexDirection: 'row', alignItems: 'center', backgroundColor: t.color.inset, borderColor: t.color.line, borderWidth: 1, borderRadius: 15, paddingRight: 2 },
  selected: { borderColor: t.color.lineStrong, backgroundColor: t.color.surface },
  select: { paddingVertical: 15, paddingLeft: 16, paddingRight: 4, gap: 10 },
  name: { fontFamily: t.font.medium, fontSize: 13, color: t.color.text },
  micro: { fontFamily: t.font.mono, fontSize: 10, color: t.color.muted },
});
