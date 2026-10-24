export type ProviderId = 'opencode' | 'droid';
export type Device = { id: string; name: string; os: string; address: string; cpu: number; ram: string };
export type Provider = { id: ProviderId; name: string; maker: string; mark: string; model: string;
  models: string[]; project: string; task: string; commands: { name: string; detail: string }[] };

export const devices: Device[] = [
  { id: 'kubuntu', name: 'Kubuntu', os: 'LINUX / PRIMARY', address: 'http://192.168.1.42:8765', cpu: 18, ram: '6.2 / 16 GB' },
  { id: 'windows', name: 'Windows', os: 'WIN 11 / DESKTOP', address: 'http://192.168.1.64:8765', cpu: 7, ram: '12 / 64 GB' },
];

// UI fixtures, not a claim about a provider's installed commands or models.
// Factory should populate these from the actual local agent when connecting it.
export const providers: Provider[] = [
  { id: 'opencode', name: 'OpenCode', maker: 'OPEN WORKSPACE', mark: 'oc', model: 'Local default',
    models: ['Local default', 'Saved profile'], project: 'astra / mobile', task: 'Refine the command surface',
    commands: [{ name: '/help', detail: 'Show this demo’s commands' }, { name: '/review', detail: 'Preview a code review' },
      { name: '/status', detail: 'Inspect demo session' }, { name: '/clear', detail: 'Clear local terminal output' }] },
  { id: 'droid', name: 'Droid', maker: 'FACTORY', mark: 'd_', model: 'Factory default',
    models: ['Factory default', 'Saved profile'], project: 'astra / bridge', task: 'Inspect the local bridge',
    commands: [{ name: '/help', detail: 'Show this demo’s commands' }, { name: '/logs', detail: 'Preview bridge output' },
      { name: '/status', detail: 'Inspect demo session' }, { name: '/clear', detail: 'Clear local terminal output' }] },
];

export type TokenKind = 'command' | 'variable' | 'string' | 'comment' | 'path' | 'error';
export type TerminalLine = { id: number; kind: TokenKind; text: string };
export const initialLines: TerminalLine[] = [
  { id: 1, kind: 'comment', text: '# ASTRA / LOCAL DEMO — no server connected' },
  { id: 2, kind: 'variable', text: '$ workspace = astra/mobile' },
  { id: 3, kind: 'path', text: '  src/components/AgentPanel.tsx' },
  { id: 4, kind: 'string', text: '  Ready for your next instruction.' },
];
