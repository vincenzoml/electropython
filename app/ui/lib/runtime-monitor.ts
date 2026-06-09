import { appState } from '../stores/app-state.svelte';

const NODE_API = 'http://127.0.0.1:37621';
const PYTHON_API = 'http://127.0.0.1:37620';

async function probe(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return response.ok;
  } catch {
    return false;
  }
}

async function readBootstrapStatus(): Promise<'idle' | 'running' | 'ready' | 'error'> {
  try {
    const response = await fetch(`${NODE_API}/runtime/bootstrap/state`, {
      signal: AbortSignal.timeout(1500)
    });
    if (!response.ok) return 'idle';
    const payload = (await response.json()) as { status?: string };
    if (payload.status === 'running') return 'running';
    if (payload.status === 'ready') return 'ready';
    if (payload.status === 'error') return 'error';
    return 'idle';
  } catch {
    return 'idle';
  }
}

function syncBootstrapOverlay(bootstrap: 'idle' | 'running' | 'ready' | 'error') {
  appState.runtime.showBootstrap = bootstrap === 'running' || bootstrap === 'error';
}

export function startRuntimeMonitor() {
  appState.runtime.node = 'starting';
  appState.runtime.python = 'starting';
  appState.runtime.showBootstrap = true;

  const tick = async () => {
    const [nodeOk, pythonOk, bootstrap] = await Promise.all([
      probe(`${NODE_API}/health`),
      probe(`${PYTHON_API}/health`),
      readBootstrapStatus()
    ]);

    appState.runtime.node = nodeOk ? 'ready' : appState.runtime.node === 'ready' ? 'ready' : 'starting';
    syncBootstrapOverlay(bootstrap);
    appState.runtime.python = pythonOk
      ? 'ready'
      : bootstrap === 'error'
        ? 'error'
        : 'starting';

    if (!nodeOk || !pythonOk || bootstrap === 'running') {
      window.setTimeout(() => {
        void tick();
      }, bootstrap === 'running' ? 400 : 1000);
    }
  };

  void tick();
}

export function hideBootstrapOverlay() {
  appState.runtime.showBootstrap = false;
}
