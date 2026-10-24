import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { UnknownRoute } from '../../../components/agent/Notices';
import { useProviderParam } from '../../../components/agent/useRouteParams';
import { Button } from '../../../components/ui/Button';
import { Chip } from '../../../components/ui/Chip';
import { GlassPanel } from '../../../components/ui/GlassPanel';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Shell } from '../../../components/ui/Shell';
import type { ProviderDef, SettingField } from '../../../providers/registry';
import { useAstra } from '../../../state/agent-store';
import { colors, fonts, layout, radius, space, type as typeScale } from '../../../theme/tokens';
import type { AgentSettings } from '../../../transport';

function currentValue(settings: AgentSettings, key: string): string {
  switch (key) {
    case 'model':
      return settings.model;
    case 'mode':
      return settings.mode;
    case 'autonomy':
      return settings.autonomy;
    case 'effort':
      return settings.effort;
    default:
      return settings.extra[key] ?? '';
  }
}

function buildPatch(settings: AgentSettings, key: string, value: string): Partial<AgentSettings> | null {
  switch (key) {
    case 'model':
      return { model: value };
    case 'mode':
      return value === 'build' || value === 'plan' ? { mode: value } : null;
    case 'autonomy':
      return value === 'readonly' || value === 'assisted' || value === 'full' ? { autonomy: value } : null;
    case 'effort':
      return value === 'low' || value === 'medium' || value === 'high' ? { effort: value } : null;
    default:
      return { extra: { ...settings.extra, [key]: value } };
  }
}

export default function SettingsScreen() {
  const provider = useProviderParam();
  if (!provider) {
    return <UnknownRoute title="Unknown agent" detail="The requested agent is not in the provider registry." />;
  }
  return <ActiveSettings provider={provider} />;
}

function ActiveSettings({ provider }: { provider: ProviderDef }) {
  const { settings, updateSettings, warning } = useAstra();
  const current = settings[provider.id];

  return (
    <Shell title="Settings" eyebrow={`${provider.name} · ${provider.maker}`} back>
      {provider.settings.map((field) => (
        <View key={field.key}>
          <SectionHeader title={field.label} />
          {field.type === 'select' ? (
            <SelectField
              field={field}
              value={currentValue(current, field.key)}
              onSelect={(value) => {
                const patch = buildPatch(current, field.key, value);
                if (patch) updateSettings(provider.id, patch);
              }}
            />
          ) : (
            <TextField
              field={field}
              value={currentValue(current, field.key)}
              onSave={(value) => {
                const patch = buildPatch(current, field.key, value);
                if (patch) updateSettings(provider.id, patch);
              }}
            />
          )}
        </View>
      ))}

      {warning ? (
        <View style={styles.warning}>
          <Chip label="Warning" tone="warning" dot />
          <Text style={styles.warningText}>{warning}</Text>
        </View>
      ) : null}

      <GlassPanel style={styles.note}>
        <Text style={styles.noteLabel}>NATIVE AGENT LAUNCH</Text>
        <Text style={styles.noteBody}>
          Workspace and JSON launch arguments are sent to the workstation when starting a new session. Existing sessions keep their own configuration. Use the agent’s native /settings or CLI flags for models, tools, approvals and other provider-specific options.
        </Text>
      </GlassPanel>
    </Shell>
  );
}

function SelectField({
  field,
  value,
  onSelect,
}: {
  field: SettingField;
  value: string;
  onSelect: (value: string) => void;
}) {
  const options = field.options ?? [];
  return (
    <View style={styles.options}>
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          selected={option === value}
          onPress={() => onSelect(option)}
          accessibilityLabel={`${field.label} ${option}${option === value ? ', selected' : ''}`}
        />
      ))}
    </View>
  );
}

function TextField({
  field,
  value,
  onSave,
}: {
  field: SettingField;
  value: string;
  onSave: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [saved, setSaved] = useState(false);
  const dirty = draft.trim() !== value;

  const save = () => {
    if (!dirty) return;
    onSave(draft.trim());
    setSaved(true);
  };

  return (
    <View style={styles.textField}>
      <TextInput
        accessibilityLabel={field.label}
        value={draft}
        onChangeText={(text) => {
          setDraft(text);
          setSaved(false);
        }}
        onSubmitEditing={save}
        placeholder="unset"
        placeholderTextColor={colors.textFaint}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        selectionColor={colors.accent}
        style={styles.input}
      />
      <View style={styles.saveRow}>
        <Button label="Save" variant="secondary" disabled={!dirty} onPress={save} accessibilityLabel={`Save ${field.label}`} />
        {saved && !dirty ? <Chip label="Saved" tone="success" dot /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: space.sm,
  },
  textField: {
    gap: space.sm,
  },
  input: {
    minHeight: layout.touch,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    backgroundColor: colors.canvas,
    fontFamily: fonts.mono,
    fontSize: typeScale.base,
    color: colors.text,
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  warning: {
    marginTop: space.xl,
    gap: space.sm,
  },
  warningText: {
    fontFamily: fonts.regular,
    fontSize: typeScale.body,
    color: colors.warning,
  },
  note: {
    marginTop: space.xl,
    gap: space.sm,
  },
  noteLabel: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.textMuted,
  },
  noteBody: {
    fontFamily: fonts.regular,
    fontSize: typeScale.body,
    lineHeight: 20,
    color: colors.textMuted,
  },
});
