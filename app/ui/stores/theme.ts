import { appState } from './app-state.svelte';

export function applyThemeVars() {
  if (typeof document === 'undefined') return;
  for (const [name, value] of Object.entries(appState.design.themeVars)) {
    document.documentElement.style.setProperty(name, value);
  }
  document.documentElement.dataset.theme = appState.app.theme;
}

export function setThemeVar(name: string, value: string) {
  if (!(name in appState.design.themeVars)) return;
  appState.design.themeVars[name as keyof typeof appState.design.themeVars] = value;
  applyThemeVars();
}

export function exportThemePreset() {
  appState.design.lastThemeExportedAt = new Date().toISOString();
  return {
    kind: 'electropython-theme-preset',
    exportedAt: appState.design.lastThemeExportedAt,
    theme: appState.app.theme,
    vars: appState.design.themeVars
  };
}

export function importThemePreset(input: unknown) {
  const candidate = input as { theme?: unknown; vars?: Record<string, unknown> };
  if (!candidate || typeof candidate !== 'object' || !candidate.vars) {
    throw new Error('Invalid theme preset: missing vars');
  }

  for (const [name, value] of Object.entries(candidate.vars)) {
    if (name in appState.design.themeVars && typeof value === 'string') {
      appState.design.themeVars[name as keyof typeof appState.design.themeVars] = value;
    }
  }

  if (candidate.theme === 'light' || candidate.theme === 'dark' || candidate.theme === 'system') {
    appState.app.theme = candidate.theme;
  }

  applyThemeVars();
}
