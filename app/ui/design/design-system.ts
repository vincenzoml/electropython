export type DesignToken = {
  name: string;
  variable: string;
  value: string;
  description: string;
};

export type ComponentSpec = {
  name: string;
  kind: 'primitive' | 'widget' | 'panel' | 'surface';
  status: 'ready' | 'template' | 'planned';
  description: string;
  editPath: string;
  props: string[];
};

export type ArchitecturePointer = {
  title: string;
  path: string;
  guidance: string;
  safeForAgents: boolean;
};

export const themeTokens: DesignToken[] = [
  { name: 'Background', variable: '--ep-bg', value: '#0f172a', description: 'Main app background.' },
  { name: 'Surface', variable: '--ep-surface', value: '#111827', description: 'Base panels and app chrome.' },
  { name: 'Card', variable: '--ep-card', value: '#1e293b', description: 'Card and elevated panel background.' },
  { name: 'Text', variable: '--ep-text', value: '#f8fafc', description: 'Primary foreground text.' },
  { name: 'Muted text', variable: '--ep-muted', value: '#cbd5e1', description: 'Secondary text and helper copy.' },
  { name: 'Accent', variable: '--ep-accent', value: '#38bdf8', description: 'Primary action and focus color.' },
  { name: 'Accent strong', variable: '--ep-accent-strong', value: '#0ea5e9', description: 'Pressed/active accent color.' },
  { name: 'Success', variable: '--ep-success', value: '#22c55e', description: 'Healthy runtime and success state.' },
  { name: 'Warning', variable: '--ep-warning', value: '#f59e0b', description: 'Degraded runtime and warning state.' },
  { name: 'Danger', variable: '--ep-danger', value: '#ef4444', description: 'Error and unsafe state.' }
];

export const typographyScale = [
  { name: 'Display', className: 'text-5xl font-black tracking-tight', use: 'Main app identity.' },
  { name: 'Title', className: 'text-2xl font-bold', use: 'Section and panel titles.' },
  { name: 'Subtitle', className: 'text-lg font-semibold', use: 'Card titles and grouped controls.' },
  { name: 'Body', className: 'text-sm leading-6', use: 'Normal UI copy.' },
  { name: 'Code', className: 'font-mono text-xs', use: 'JSON, logs, endpoints, diagnostics.' }
];

export const spacingScale = [
  { token: 'xs', className: 'gap-1 p-1', value: '0.25rem' },
  { token: 'sm', className: 'gap-2 p-2', value: '0.5rem' },
  { token: 'md', className: 'gap-4 p-4', value: '1rem' },
  { token: 'lg', className: 'gap-6 p-6', value: '1.5rem' },
  { token: 'xl', className: 'gap-8 p-8', value: '2rem' }
];

export const componentRegistry: ComponentSpec[] = [
  {
    name: 'StatusCard',
    kind: 'widget',
    status: 'ready',
    description: 'Compact health/status card used by the app shell.',
    editPath: 'app/ui/components/StatusCard.svelte',
    props: ['title', 'value', 'detail']
  },
  {
    name: 'DesignMode',
    kind: 'surface',
    status: 'ready',
    description: 'Multi-panel design-system, runtime, action, API, bridge, stream, and log inspector.',
    editPath: 'app/ui/design/DesignMode.svelte',
    props: []
  },
  {
    name: 'RuntimeHealthPanel',
    kind: 'panel',
    status: 'template',
    description: 'Shown inside Design Mode; split into a standalone component when the app grows.',
    editPath: 'app/ui/design/DesignMode.svelte',
    props: ['health']
  },
  {
    name: 'ComponentGallery',
    kind: 'panel',
    status: 'template',
    description: 'Interactive preview surface for app widgets and design tokens.',
    editPath: 'app/ui/design/DesignMode.svelte',
    props: ['componentRegistry']
  },
  {
    name: 'DevApiExplorer',
    kind: 'panel',
    status: 'template',
    description: 'Action/API browser for safe local introspection and test calls.',
    editPath: 'app/ui/design/DesignMode.svelte',
    props: ['actions', 'apis']
  }
];

export const iconRegistry = [
  { name: 'runtime', glyph: '●', use: 'Runtime health and readiness.' },
  { name: 'action', glyph: '◆', use: 'User-visible action exposed to UI/CLI/AI/MCP.' },
  { name: 'api', glyph: '◇', use: 'Low-level Python or Node capability.' },
  { name: 'stream', glyph: '≈', use: 'Push/event channel.' },
  { name: 'bridge', glyph: '⇄', use: 'Explicit Python ↔ Node call.' },
  { name: 'log', glyph: '≡', use: 'Operational log line.' }
];

export const actionSurfaces = [
  { name: 'Svelte UI', scope: 'Human-facing app workflows.', source: 'ui' },
  { name: 'Electron', scope: 'Desktop shell and host integration.', source: 'electron' },
  { name: 'CLI', scope: 'Batch mode and shell automation.', source: 'cli' },
  { name: 'Runtime AI API', scope: 'Restricted non-dev user-action API for agents.', source: 'api' },
  { name: 'MCP server', scope: 'Tool surface mapped to application actions.', source: 'mcp' }
];

export const architecturePointers: ArchitecturePointer[] = [
  {
    title: 'Application actions',
    path: 'app/logic/actions/',
    guidance: 'Define what users, CLI, AI API, MCP, UI, and Electron are allowed to do here. This is the canonical behavior layer.',
    safeForAgents: true
  },
  {
    title: 'UI components',
    path: 'app/ui/components/',
    guidance: 'Build reusable Svelte components here. They should render state and emit intent, not own business logic.',
    safeForAgents: true
  },
  {
    title: 'Design system',
    path: 'app/ui/design/',
    guidance: 'Design Mode, palette, typography, component previews, and safe editor surfaces live here.',
    safeForAgents: true
  },
  {
    title: 'Python capabilities',
    path: 'app/python/apis/ and app/python/streams/',
    guidance: 'Add Python-native APIs and streams here. Expose them through actions before making them user-visible.',
    safeForAgents: true
  },
  {
    title: 'Node capabilities',
    path: 'app/node/apis/ and app/node/streams/',
    guidance: 'Add TypeScript/Node-native APIs and streams here. Expose them through actions before making them user-visible.',
    safeForAgents: true
  },
  {
    title: 'Framework internals',
    path: 'framework/',
    guidance: 'Avoid editing unless changing ElectroPython itself. Prefer app-level extension points first.',
    safeForAgents: false
  }
];
