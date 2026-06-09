import { appState } from '../ui/stores/app-state.svelte';

export async function bootApplication() {
  appState.runtime.booted = true;
  appState.runtime.mode = detectMode();
}

function detectMode() {
  const globalValue = globalThis as typeof globalThis & { electropython?: { mode?: string } };
  return globalValue.electropython?.mode ?? 'web';
}
