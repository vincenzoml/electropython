import { appState } from '../ui/stores/app-state.svelte';
import { startRuntimeMonitor } from '../ui/lib/runtime-monitor';

export async function bootApplication() {
  appState.runtime.booted = true;
  appState.runtime.mode = detectMode();
  startRuntimeMonitor();
}

function detectMode() {
  const globalValue = globalThis as typeof globalThis & { electropython?: { mode?: string } };
  return globalValue.electropython?.mode ?? 'web';
}
