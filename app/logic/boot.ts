import { appState } from '../ui/stores/app-state.svelte';
import { loadPersistedState, savePersistedState } from '../ui/stores/persistence';
import { applyThemeVars } from '../ui/stores/theme';
import { startRuntimeMonitor } from '../ui/lib/runtime-monitor';

let booted = false;

export async function bootApplication() {
  if (booted) return;
  booted = true;

  loadPersistedState();
  applyThemeVars();

  appState.runtime.booted = true;
  appState.runtime.mode = detectMode();
  appState.runtime.lastHealthCheck = new Date().toISOString();
  startRuntimeMonitor();

  if (appState.persisted.settings.openDesignModeOnBoot) {
    appState.ui.designMode = true;
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => savePersistedState());
  }
}

function detectMode() {
  const globalValue = globalThis as typeof globalThis & { electropython?: { mode?: string } };
  return globalValue.electropython?.mode ?? 'web';
}
