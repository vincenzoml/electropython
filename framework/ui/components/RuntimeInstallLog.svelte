<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { Terminal } from '@xterm/xterm';
  import '@xterm/xterm/css/xterm.css';
  import { hideBootstrapOverlay } from '$app/ui/lib/runtime-monitor';
  import { BOOTSTRAP_PTY_COLS, BOOTSTRAP_PTY_ROWS } from '$framework/runtime/bootstrap-terminal';

  type BootstrapState = {
    status: 'idle' | 'running' | 'ready' | 'error';
    phase: string;
    error?: string;
  };

  let phase = $state('starting');
  let status = $state<'running' | 'ready' | 'error'>('running');
  let error = $state('');
  let source: EventSource | undefined;
  let container: HTMLDivElement | undefined;
  let term: Terminal | undefined;
  let bootstrapped = false;

  const apiBase = 'http://127.0.0.1:37621';

  function fitRows(): void {
    if (!term || !container) return;
    const rows = Math.max(BOOTSTRAP_PTY_ROWS, Math.floor((container.clientHeight - 8) / 17));
    term.resize(BOOTSTRAP_PTY_COLS, rows);
  }

  onMount(() => {
    term = new Terminal({
      cols: BOOTSTRAP_PTY_COLS,
      rows: BOOTSTRAP_PTY_ROWS,
      convertEol: false,
      disableStdin: true,
      cursorBlink: false,
      fontSize: 12,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      scrollback: 10000,
      theme: {
        background: '#0a0a0a',
        foreground: '#e2e8f0',
        cursor: '#38bdf8'
      }
    });

    if (container) {
      term.open(container);
      fitRows();
    }

    source = new EventSource(`${apiBase}/runtime/bootstrap/stream`);

    source.addEventListener('state', event => {
      const next = JSON.parse(event.data) as BootstrapState;
      phase = next.phase;
      if (next.status === 'ready' || next.status === 'error' || next.status === 'running') {
        status = next.status;
      }
      error = next.error ?? '';
    });

    source.addEventListener('log', event => {
      const chunk = JSON.parse(event.data) as string;
      if (!bootstrapped) {
        term?.reset();
        bootstrapped = true;
      }
      term?.write(chunk);
    });

    source.addEventListener('done', event => {
      const payload = JSON.parse(event.data) as { status: string };
      if (payload.status === 'ready') {
        hideBootstrapOverlay();
      }
      source?.close();
    });

    void fetch(`${apiBase}/runtime/bootstrap/state`)
      .then(response => response.json())
      .then((next: BootstrapState) => {
        phase = next.phase;
        if (next.status === 'ready' || next.status === 'error' || next.status === 'running') {
          status = next.status;
        }
        error = next.error ?? '';
        if (next.status === 'ready') hideBootstrapOverlay();
      })
      .catch(() => undefined);

    const onResize = () => fitRows();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  onDestroy(() => {
    source?.close();
    term?.dispose();
  });
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-6 backdrop-blur-sm">
  <section class="flex h-[min(80vh,720px)] w-full max-w-4xl flex-col rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
    <header class="border-b border-white/10 px-5 py-4">
      <p class="text-xs uppercase tracking-[0.3em] text-sky-300">runtime provisioning</p>
      <h2 class="mt-2 text-2xl font-bold text-white">Setting up Python with uv</h2>
      <p class="mt-2 text-sm text-slate-300">
        Phase: <span class="font-mono text-sky-200">{phase}</span>
        {#if status === 'error'}
          <span class="ml-3 text-rose-300">failed</span>
        {/if}
      </p>
      {#if error}
        <p class="mt-2 text-sm text-rose-300">{error}</p>
      {/if}
    </header>

    <div bind:this={container} class="terminal-shell min-h-0 flex-1 overflow-x-auto overflow-y-hidden bg-black p-2"></div>
  </section>
</div>

<style>
  .terminal-shell :global(.xterm) {
    width: max-content;
    min-width: 100%;
  }

  .terminal-shell :global(.xterm-viewport) {
    overflow-y: auto !important;
  }
</style>
