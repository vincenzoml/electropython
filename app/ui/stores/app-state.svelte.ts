export type ThemeMode = 'light' | 'dark' | 'system';
export type RuntimeStatus = 'unknown' | 'starting' | 'ready' | 'degraded' | 'error';

export const appState = $state({
  app: {
    name: 'ElectroPython',
    theme: 'dark' as ThemeMode,
    version: '0.1.0'
  },
  runtime: {
    booted: false,
    mode: 'web',
    python: 'unknown' as RuntimeStatus,
    node: 'unknown' as RuntimeStatus,
    bridge: 'unknown' as RuntimeStatus,
    lastHealthCheck: '',
    showBootstrap: false
  },
  demo: {
    name: 'Ada',
    greeting: '',
    systemInfo: '',
    clock: '',
    heartbeat: ''
  },
  ui: {
    designMode: false,
    sidebarOpen: true,
    activeDesignPanel: 'foundations',
    density: 'comfortable' as 'compact' | 'comfortable' | 'spacious'
  },
  design: {
    themeVars: {
      '--ep-bg': '#0f172a',
      '--ep-surface': '#111827',
      '--ep-card': '#1e293b',
      '--ep-text': '#f8fafc',
      '--ep-muted': '#cbd5e1',
      '--ep-accent': '#38bdf8',
      '--ep-accent-strong': '#0ea5e9',
      '--ep-success': '#22c55e',
      '--ep-warning': '#f59e0b',
      '--ep-danger': '#ef4444'
    },
    lastSnapshotExportedAt: '',
    lastThemeExportedAt: ''
  },
  persisted: {
    schemaVersion: 1,
    lastSavedAt: '',
    settings: {
      rememberName: true,
      openDesignModeOnBoot: false
    }
  }
});

export type AppStateSnapshot = typeof appState;
