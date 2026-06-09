import { appState } from './app-state.svelte';
import { applyThemeVars } from './theme';

const STORAGE_KEY = 'electropython:persisted-state:v1';

export type PersistedState = {
  schemaVersion: 1;
  savedAt: string;
  app: Pick<typeof appState.app, 'theme'>;
  demo: Pick<typeof appState.demo, 'name'>;
  ui: Pick<typeof appState.ui, 'density'>;
  design: Pick<typeof appState.design, 'themeVars'>;
  persisted: typeof appState.persisted;
};

export function makePersistedSnapshot(): PersistedState {
  return {
    schemaVersion: 1,
    savedAt: new Date().toISOString(),
    app: { theme: appState.app.theme },
    demo: { name: appState.demo.name },
    ui: { density: appState.ui.density },
    design: { themeVars: { ...appState.design.themeVars } },
    persisted: appState.persisted
  };
}

export function savePersistedState() {
  if (typeof localStorage === 'undefined') return;
  const snapshot = makePersistedSnapshot();
  appState.persisted.lastSavedAt = snapshot.savedAt;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function loadPersistedState() {
  if (typeof localStorage === 'undefined') return;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const snapshot = JSON.parse(raw) as Partial<PersistedState>;

  if (snapshot.app?.theme === 'light' || snapshot.app?.theme === 'dark' || snapshot.app?.theme === 'system') {
    appState.app.theme = snapshot.app.theme;
  }
  if (typeof snapshot.demo?.name === 'string') appState.demo.name = snapshot.demo.name;
  if (snapshot.ui?.density === 'compact' || snapshot.ui?.density === 'comfortable' || snapshot.ui?.density === 'spacious') {
    appState.ui.density = snapshot.ui.density;
  }
  if (snapshot.design?.themeVars && typeof snapshot.design.themeVars === 'object') {
    Object.assign(appState.design.themeVars, snapshot.design.themeVars);
  }
  if (snapshot.persisted) Object.assign(appState.persisted, snapshot.persisted);

  applyThemeVars();
}

export function exportFullStateSnapshot() {
  appState.design.lastSnapshotExportedAt = new Date().toISOString();
  return {
    kind: 'electropython-state-snapshot',
    exportedAt: appState.design.lastSnapshotExportedAt,
    appState: JSON.parse(JSON.stringify(appState))
  };
}

export function importFullStateSnapshot(input: unknown) {
  const candidate = input as { appState?: Partial<typeof appState> };
  if (!candidate || typeof candidate !== 'object' || !candidate.appState) {
    throw new Error('Invalid state snapshot: missing appState');
  }

  const incoming = candidate.appState;
  if (incoming.app) Object.assign(appState.app, incoming.app);
  if (incoming.runtime) Object.assign(appState.runtime, incoming.runtime);
  if (incoming.demo) Object.assign(appState.demo, incoming.demo);
  if (incoming.ui) Object.assign(appState.ui, incoming.ui);
  if (incoming.design) {
    if (incoming.design.themeVars) Object.assign(appState.design.themeVars, incoming.design.themeVars);
    if (incoming.design.lastSnapshotExportedAt) appState.design.lastSnapshotExportedAt = incoming.design.lastSnapshotExportedAt;
    if (incoming.design.lastThemeExportedAt) appState.design.lastThemeExportedAt = incoming.design.lastThemeExportedAt;
  }
  if (incoming.persisted) Object.assign(appState.persisted, incoming.persisted);

  applyThemeVars();
  savePersistedState();
}
