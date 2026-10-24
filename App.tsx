import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono/400Regular';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device, ProviderId, TerminalLine, devices as seedDevices, initialLines, providers } from './src/data';
import { common, theme as t } from './src/theme';
import { styles as s } from './src/styles';
import { Action, Dot, Icon, IconButton, SectionHeading } from './src/components/Primitives';
import { DeviceStrip } from './src/components/DeviceStrip';
import { AgentPanel } from './src/components/AgentPanel';
import { TerminalDrawer } from './src/components/TerminalDrawer';
import { Sheet } from './src/components/Sheet';

const ADDRESS_KEY = 'astra.rig-addresses.v1';
type WorkspaceState = { lines: TerminalLine[]; model: string; mode: 'Build' | 'Plan'; session: string };
const newWorkspace = (id: ProviderId): WorkspaceState => ({ lines: initialLines.map(l => ({ ...l,
  text: l.id === 2 ? `$ workspace = astra/${id === 'opencode' ? 'mobile' : 'bridge'}` : l.text })),
  model: providers.find(p => p.id === id)!.model, mode: 'Build', session: 'current' });

export default function App() {
  const [loaded, error] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, JetBrainsMono_400Regular });
  if (!loaded && !error) return <View style={{ flex: 1, backgroundColor: t.color.canvas }} />;
  if (error) return <View style={{ flex: 1, backgroundColor: t.color.canvas, padding: 30, justifyContent: 'center' }}>
    <Text style={{ color: 'white' }}>Astra could not load its bundled fonts. Restart the app.</Text></View>;
  return <SafeAreaProvider><StatusBar style="light" /><Workspace /></SafeAreaProvider>;
}

function Workspace() {
  const { width, height } = useWindowDimensions();
  const inset = useSafeAreaInsets();
  const desktop = width >= 900;
  const sidebar = desktop ? t.layout.sidebar : 0;
  const [screen, setScreen] = useState<'overview' | ProviderId>('overview');
  const [providerId, setProviderId] = useState<ProviderId>('opencode');
  const [devices, setDevices] = useState(seedDevices);
  const [deviceId, setDeviceId] = useState('kubuntu');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [states, setStates] = useState<Record<string, WorkspaceState>>({});
  const [sheet, setSheet] = useState<'device' | 'provider' | 'navigation' | 'diff' | 'about' | null>(null);
  const [editing, setEditing] = useState<Device | null>(null);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [storageReady, setStorageReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const nextId = useRef(100);
  const contentScroll = useRef<ScrollView>(null);
  const provider = providers.find(p => p.id === providerId)!;
  const rig = devices.find(d => d.id === deviceId)!;
  const key = `${deviceId}:${providerId}`;
  const state = states[key] ?? newWorkspace(providerId);
  const update = (patch: Partial<WorkspaceState>) => setStates(old => ({ ...old, [key]: { ...(old[key] ?? newWorkspace(providerId)), ...patch } }));

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(ADDRESS_KEY).then(raw => {
      if (!raw || !mounted) return;
      const saved: unknown = JSON.parse(raw);
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
        setDevices(seedDevices.map(d => ({ ...d, address: typeof (saved as Record<string, unknown>)[d.id] === 'string'
          ? (saved as Record<string, string>)[d.id] : d.address })));
      }
    }).catch(() => { if (mounted) setError('Saved addresses could not be read. You can save them again.'); })
      .finally(() => { if (mounted) setStorageReady(true); });
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (terminalOpen) { setTerminalOpen(false); return true; }
      if (screen !== 'overview') { setScreen('overview'); return true; }
      return false;
    });
    return () => subscription.remove();
  }, [terminalOpen, screen]);

  const openProvider = (id: ProviderId) => { setProviderId(id); setScreen(id); setSheet(null); setTerminalOpen(false); contentScroll.current?.scrollTo({ y: 0, animated: false }); };
  const showDevice = (device: Device) => { setEditing(device); setAddress(device.address); setError(''); setSheet('device'); };
  const saveAddress = async () => {
    if (!editing || saving || !storageReady) return;
    try {
      const url = new URL(address.trim());
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password || url.search || url.hash || !['', '/'].includes(url.pathname)) throw new Error();
      const updated = devices.map(d => d.id === editing.id ? { ...d, address: url.origin } : d);
      setSaving(true);
      await AsyncStorage.setItem(ADDRESS_KEY, JSON.stringify(Object.fromEntries(updated.map(d => [d.id, d.address]))));
      setDevices(updated); setSheet(null); setError('');
    } catch { setError('Use a base address such as http://192.168.1.42:8765. If it is valid, device storage may be unavailable.'); }
    finally { setSaving(false); }
  };
  const submit = (input: string) => {
    if (input === '/clear') { update({ lines: [] }); return; }
    let response = `Demo instruction received by ${provider.name}. Connect the local server to execute it.`;
    if (input === '/help') response = provider.commands.map(c => `${c.name}  ${c.detail}`).join('\n');
    else if (input === '/status') response = `${rig.name} · ${provider.name} · ${state.model} · ${state.mode}\nSaved address: ${rig.address}\nDemo only: connection has not been attempted.`;
    else if (input === '/review' && providerId === 'opencode') response = 'Preview: 3 files changed · +128 / −24\nReview available in the workspace’s Changes panel.';
    else if (input === '/logs' && providerId === 'droid') response = '[demo] bridge.start → ready\n[demo] transport → disconnected\n[demo] awaiting a real local companion';
    else if (input.startsWith('/')) response = 'Unknown demo command. Type /help for this provider’s available commands.';
    const additions: TerminalLine[] = [{ id: nextId.current++, kind: 'command', text: `❯ ${input}` },
      { id: nextId.current++, kind: 'comment', text: response }];
    update({ lines: [...state.lines, ...additions].slice(-200) });
  };
  const openTerminal = () => setTerminalOpen(true);
  const navigation = <View style={{ gap: 8 }}>
    <Pressable accessibilityRole="button" onPress={() => { setScreen('overview'); setSheet(null); setTerminalOpen(false); }} style={[s.navItem, screen === 'overview' && s.navSelected]}>
      <Icon name="grid" size={17} color={screen === 'overview' ? t.color.accent : t.color.muted} /><Text style={s.navText}>Overview</Text></Pressable>
    <Text style={[common.label, { paddingHorizontal: 14, marginTop: 28, marginBottom: 8 }]}>PROVIDERS</Text>
    {providers.map(p => <View key={p.id}>
      <Pressable accessibilityRole="button" onPress={() => openProvider(p.id)} style={[s.navItem, screen === p.id && s.navSelected]}>
        <Text style={s.navMark}>{p.mark}</Text><Text style={s.navText}>{p.name}</Text><Icon name={screen === p.id ? 'chevron-down' : 'chevron-right'} size={14} /></Pressable>
      {screen === p.id && <Pressable accessibilityRole="button" onPress={() => { setSheet(null); openTerminal(); }} style={s.nestedSession}>
        <View style={s.branch} /><Text style={s.nestedText}>{p.project}</Text><Dot /></Pressable>}
    </View>)}
  </View>;

  return <SafeAreaView edges={['top', 'left', 'right']} style={s.root}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {desktop && <View style={s.sidebar}><View style={s.brand}><Text style={s.star}>✳</Text><Text style={s.wordmark}>astra</Text></View>
          <Text style={s.sidebarCaption}>PERSONAL COMMAND SPACE</Text>{navigation}
          <View style={s.sidebarFooter}><Dot /><Text style={common.mono}>Private by design.</Text></View></View>}
        <View style={{ flex: 1 }}>
          <View style={s.topbar}>
            {desktop ? <Text style={common.mono}>Workspace / {screen === 'overview' ? 'Overview' : provider.name}</Text>
              : <Pressable accessibilityRole="button" accessibilityLabel="Open provider navigation" onPress={() => setSheet('navigation')} style={[s.brand, { minHeight: 48 }]}>
                <Text style={s.star}>✳</Text><Text style={s.wordmark}>astra</Text><Icon name="chevron-down" size={14} /></Pressable>}
            <Pressable accessibilityRole="button" accessibilityLabel="About this demo" onPress={() => setSheet('about')} style={s.demoBadge}><Dot /><Text style={s.demoText}>LOCAL DEMO</Text></Pressable>
          </View>
          <ScrollView ref={contentScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}
            contentContainerStyle={[s.content, { paddingBottom: (terminalOpen ? Math.min(410, height * 0.62) : 70) + inset.bottom + 55 }]}>
            <View style={s.intro}>
              <View style={{ flex: 1 }}><Text style={common.label}>{screen === 'overview' ? 'YOUR SPACE. YOUR PACE.' : `${provider.maker} / WORKSPACE`}</Text>
                <Text style={s.heading}>{screen === 'overview' ? 'At your command.' : provider.name}<Text style={{ color: t.color.accent }}>{screen === 'overview' ? '' : ' /'}</Text></Text>
                <Text style={s.subheading}>{screen === 'overview' ? 'Good work doesn’t need a desk.' : `${rig.name}  ·  ${provider.project}`}</Text></View>
              {screen !== 'overview' && <IconButton name="sliders" label={`${provider.name} controls`} onPress={() => setSheet('provider')} />}
            </View>
            <View style={s.section}><SectionHeading title="YOUR MACHINES" detail="02 / saved" />
              <DeviceStrip devices={devices} selected={deviceId} onSelect={setDeviceId} onEdit={showDevice} />
              {error && sheet !== 'device' ? <Text accessibilityRole="alert" style={s.error}>{error}</Text> : null}
            </View>
            {screen === 'overview' ? <>
              <View style={s.section}><SectionHeading title="AGENT WORKSPACES" detail="Choose your tool ↗" />
                <View style={s.grid}>{providers.map(p => <AgentPanel key={p.id} provider={p} width={width >= 360 ? (Math.min(width - sidebar, t.layout.maxContent) - 2 * t.layout.gutter - t.layout.gap) / 2 : undefined} onOpen={() => openProvider(p.id)} />)}</View></View>
              <View style={s.section}><SectionHeading title="PICK UP WHERE YOU LEFT OFF" detail="01" />
                <Pressable accessibilityRole="button" accessibilityLabel="Resume OpenCode interface refinement" onPress={() => openProvider('opencode')} style={s.focusCard}>
                  <View style={common.between}><View style={[common.row, { gap: 7 }]}><Dot /><Text style={s.focusTag}>READY TO CONTINUE</Text></View><Icon name="arrow-up-right" /></View>
                  <Text style={s.focusTitle}>{'A quieter kind\nof control.'}</Text><Text style={s.focusBody}>Refining the Astra command surface.</Text>
                  <View style={s.focusFooter}><View style={[common.row, { gap: 8 }]}><Icon name="git-branch" size={13} /><Text style={common.mono}>ui/command-surface</Text></View>
                    <Text style={s.delta}>+128 <Text style={{ color: t.color.muted }}>−24</Text></Text></View>
                </Pressable>
              </View>
              <View style={s.note}><Icon name="moon" size={14} /><Text style={common.mono}>Same machines. A better place to work.</Text></View>
            </> : <>
              <View style={s.section}><SectionHeading title="SESSION CONTROLS" detail="Provider local" />
                <View style={s.controls}><Action label={state.model} icon="cpu" onPress={() => setSheet('provider')} />
                  <Action label={state.mode} icon="layers" onPress={() => update({ mode: state.mode === 'Build' ? 'Plan' : 'Build' })} />
                  <Action label="Commands /" icon="command" onPress={openTerminal} /></View>
              </View>
              <View style={s.section}><SectionHeading title="CURRENT SESSION" detail={state.session === 'current' ? '01' : 'new'} />
                <View style={s.sessionCard}><View style={common.between}><Text style={s.focusTag}>AWAITING YOUR DIRECTION</Text><Dot /></View>
                  <Text style={s.sessionTitle}>{state.session === 'current' ? provider.task : state.session === 'new' ? 'A clean workspace.' : state.session}</Text>
                  <Text style={s.focusBody}>Give {provider.name} an instruction, inspect the working tree, or pick up a saved session.</Text>
                  <View style={[s.controls, { marginTop: 24 }]}><Action label="Open terminal" icon="terminal" primary onPress={openTerminal} />
                    <Action label="New session" icon="plus" onPress={() => { update({ session: 'new', lines: [{ id: nextId.current++, kind: 'comment', text: '# New local demo session. No agent process was started.' }] }); setTerminalOpen(true); }} /></View>
                </View>
              </View>
              <View style={s.section}><SectionHeading title="WORKING TREE" detail="Demo snapshot" />
                <Pressable accessibilityRole="button" onPress={() => setSheet('diff')} style={s.fileRow}><Icon name="git-pull-request" size={18} /><View style={{ flex: 1 }}>
                  <Text style={s.fileTitle}>3 files changed</Text><Text style={common.mono}>ui/command-surface</Text></View><Text style={s.delta}>+128 / −24</Text><Icon name="chevron-right" size={16} /></Pressable>
              </View>
              <View style={s.section}><SectionHeading title="RECENT SESSIONS" />
                {['Interface refinement', 'Workspace inspection'].map((name, index) => <Pressable key={name} accessibilityRole="button" onPress={() => { update({ session: name, lines: [{ id: nextId.current++, kind: 'comment', text: `# Loaded demo session: ${name}` }] }); setTerminalOpen(true); }} style={s.historyRow}>
                  <Icon name="corner-down-right" size={15} /><View style={{ flex: 1 }}><Text style={s.fileTitle}>{name}</Text><Text style={common.mono}>{index === 0 ? '12 minutes ago' : 'Yesterday'} · local fixture</Text></View><Icon name="arrow-up-right" size={16} /></Pressable>)}
              </View>
            </>}
          </ScrollView>
        </View>
      </View>
      <TerminalDrawer key={key} open={terminalOpen} onToggle={() => setTerminalOpen(v => !v)} provider={provider} lines={state.lines}
        onSubmit={submit} bottom={inset.bottom} sidebar={sidebar} />
    </KeyboardAvoidingView>
    <Sheet open={sheet !== null} title={sheet === 'device' ? `${editing?.name} address` : sheet === 'provider' ? `${provider.name} controls` : sheet === 'navigation' ? 'Your workspaces' : sheet === 'diff' ? 'Working tree' : 'Astra / UI study'} onClose={() => setSheet(null)}>
      {sheet === 'navigation' && navigation}
      {sheet === 'device' && <><Text style={common.body}>Save this machine’s local server address. This demo remembers it on this device.</Text>
        <Text style={common.label}>SERVER ADDRESS</Text><TextInput accessibilityLabel="Server address" style={s.addressInput} value={address} onChangeText={setAddress} autoCapitalize="none" autoCorrect={false} keyboardType="url" placeholderTextColor={t.color.muted} />
        {error ? <Text accessibilityRole="alert" style={s.error}>{error}</Text> : null}
        <Action label={saving ? 'Saving…' : storageReady ? 'Save address' : 'Loading saved addresses…'} icon="check" primary onPress={saveAddress} />
        <Text style={common.mono}>No scan. No account. No connection attempted.</Text></>}
      {sheet === 'provider' && <><Text style={common.body}>Controls belong to {provider.name} on {rig.name}. These profiles are UI fixtures until connected to your agent.</Text>
        <Text style={common.label}>MODEL PROFILE</Text>{provider.models.map(model => <Action key={model} label={`${state.model === model ? '✓  ' : ''}${model}`} onPress={() => update({ model })} primary={state.model === model} />)}
        <Text style={common.label}>EXECUTION MODE</Text><View style={s.controls}>{(['Build', 'Plan'] as const).map(mode => <Action key={mode} label={mode} primary={state.mode === mode} onPress={() => update({ mode })} />)}</View></>}
      {sheet === 'diff' && <><Text style={common.mono}>DEMO SNAPSHOT / ui/command-surface</Text>{['src/theme.ts', 'src/components/AgentPanel.tsx', 'src/components/TerminalDrawer.tsx'].map(file => <View key={file} style={{ gap: 10 }}><Text style={[common.mono, { color: t.color.text }]}>{file}</Text>
        <Text style={[common.mono, { color: t.syntax.variable }]}>+ use shared surface and spacing tokens</Text><Text style={common.mono}>− remove component-local color overrides</Text></View>)}<Text style={common.body}>Illustrative changes only; no repository was inspected.</Text></>}
      {sheet === 'about' && <><Text style={common.body}>A private command space for your machines and agents. Built around provider workspaces, precise typography, and one sharp accent.</Text>
        <Text style={common.body}>This is an interactive UI demo. Machine metrics, sessions, commands, and changes are fixtures. Addresses are saved locally; nothing is sent to a server.</Text>
        <Text style={common.mono}>ASTRA 0.1 / PERSONAL EDITION</Text></>}
    </Sheet>
  </SafeAreaView>;
}
