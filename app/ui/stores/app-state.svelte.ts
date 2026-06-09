export const appState = $state({
  app: {
    name: 'ElectroPython',
    theme: 'dark' as 'light' | 'dark' | 'system'
  },
  runtime: {
    booted: false,
    mode: 'web',
    python: 'unknown' as 'unknown' | 'starting' | 'ready' | 'error',
    node: 'unknown' as 'unknown' | 'starting' | 'ready' | 'error',
    bridge: 'unknown' as 'unknown' | 'ready' | 'error'
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
    sidebarOpen: true
  }
});
