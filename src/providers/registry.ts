import type { ExecutionMode, Machine, ProviderId, ProviderStatus } from '../transport/types';

/**
 * Static provider registry. Droid and Codex are first-class ('active');
 * OpenCode, AntiGravity and DeepSeek are registered 'planned' and carry
 * NO fake models or commands — only an honest placeholder command.
 */

export interface SettingField {
  key: string;
  label: string;
  type: 'select' | 'text';
  options?: string[];
}

export interface ProviderDef {
  id: ProviderId;
  name: string;
  maker: string;
  mark: string;
  status: ProviderStatus;
  project: string;
  models: string[];
  modes: ExecutionMode[];
  commands: { name: string; detail: string }[];
  settings: SettingField[];
}

function baseSettings(_models: string[]): SettingField[] {
  return [
    { key: 'arguments', label: 'Launch arguments · JSON array', type: 'text' },
  ];
}

const placeholderCommand = (_id: ProviderId) => ({ name: '/help', detail: 'Open the agent’s native command help.' });

export const providers: ProviderDef[] = [
  {
    id: 'droid',
    name: 'Droid',
    maker: 'FACTORY',
    mark: 'd_',
    status: 'active',
    project: 'astra-ui',
    models: ['glm-5.3-flash', 'claude-sonnet-4.5', 'claude-opus-4.1'],
    modes: ['build', 'plan'],
    commands: [
      { name: 'droid exec', detail: 'Run a one-shot task in the repo' },
      { name: 'droid resume', detail: 'Resume a previous session' },
    ],
    settings: [
      ...baseSettings(['glm-5.3-flash', 'claude-sonnet-4.5', 'claude-opus-4.1']),
      { key: 'workspace', label: 'Workspace', type: 'text' },
    ],
  },
  {
    id: 'codex',
    name: 'Codex',
    maker: 'OPENAI',
    mark: 'cx',
    status: 'active',
    project: 'astra-ui',
    models: ['gpt-5-codex', 'gpt-5', 'o4-mini'],
    modes: ['build', 'plan'],
    commands: [
      { name: 'codex exec', detail: 'Non-interactive build run' },
      { name: 'codex plan', detail: 'Draft a plan before any write' },
    ],
    settings: [
      ...baseSettings(['gpt-5-codex', 'gpt-5', 'o4-mini']),
      { key: 'workspace', label: 'Workspace', type: 'text' },
    ],
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    maker: 'OPENCODE',
    mark: 'oc_',
    status: 'active',
    project: 'astra-ui',
    models: [],
    modes: ['plan'],
    commands: [placeholderCommand('opencode')],
    settings: [...baseSettings([]), { key: 'workspace', label: 'Workspace', type: 'text' }],
  },
  {
    id: 'antigravity',
    name: 'AntiGravity',
    maker: 'GOOGLE',
    mark: 'ag_',
    status: 'active',
    project: 'astra-ui',
    models: [],
    modes: ['plan'],
    commands: [placeholderCommand('antigravity')],
    settings: [...baseSettings([]), { key: 'workspace', label: 'Workspace', type: 'text' }],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek Harness',
    maker: 'DEEPSEEK',
    mark: 'ds_',
    status: 'active',
    project: 'astra-ui',
    models: [],
    modes: ['plan'],
    commands: [placeholderCommand('deepseek')],
    settings: [...baseSettings([]), { key: 'workspace', label: 'Workspace', type: 'text' }],
  },
];

export const activeProviderIds: ProviderId[] = providers
  .filter((p) => p.status === 'active')
  .map((p) => p.id);

export const seedMachines: Machine[] = [
  { id: 'kubuntu', name: 'Kubuntu', os: 'LINUX / PRIMARY', address: 'http://192.168.1.164:8765' },
  { id: 'windows', name: 'Windows', os: 'WIN 11 / DESKTOP', address: '' },
];
