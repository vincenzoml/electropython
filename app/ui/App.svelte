<script lang="ts">
  import StatusCard from './components/StatusCard.svelte';
  import DesignMode from './design/DesignMode.svelte';
  import RuntimeInstallLog from '$framework/ui/components/RuntimeInstallLog.svelte';
  import { appState } from './stores/app-state.svelte';
  import { callAction } from './lib/client';
  import { bootApplication } from '../logic/boot';

  bootApplication();

  async function greet() {
    appState.demo.greeting = await callAction<string>('demo.greet', { name: appState.demo.name });
  }

  async function systemInfo() {
    appState.demo.systemInfo = JSON.stringify(await callAction('demo.systemInfo'), null, 2);
  }
</script>

{#if appState.ui.designMode}
  <DesignMode />
{:else}
  <main class="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 p-8">
    <header class="flex items-center justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-sky-300">dual-brain scaffold</p>
        <h1 class="mt-2 text-5xl font-black">{appState.app.name}</h1>
        <p class="mt-3 max-w-2xl text-slate-300">Python + Node.js capabilities served through one application action layer for UI, CLI, AI agents, MCP, Electron, and web mode.</p>
      </div>
      <button class="rounded-xl border border-white/20 px-4 py-2" onclick={() => appState.ui.designMode = true}>
        Design system
      </button>
    </header>

    <section class="grid gap-4 md:grid-cols-3">
      <StatusCard title="Mode" value={appState.runtime.mode} detail="Electron, web, CLI, AI API, and MCP all call actions." />
      <StatusCard title="Python" value={appState.runtime.python} detail="Provisioned with uv into app-local runtime storage." />
      <StatusCard title="Node.js" value={appState.runtime.node} detail="Capability layer, host integration, and packaging coordinator." />
    </section>

    <section class="grid gap-6 md:grid-cols-2">
      <div class="rounded-2xl border border-white/10 bg-white/10 p-5">
        <h2 class="text-xl font-bold">Action call: Python greet</h2>
        <input class="mt-4 w-full rounded-xl bg-black/30 p-3" bind:value={appState.demo.name} />
        <button class="mt-3 rounded-xl bg-sky-400 px-4 py-2 font-bold text-slate-950" onclick={greet}>Call action</button>
        <p class="mt-4 text-slate-200">{appState.demo.greeting}</p>
      </div>

      <div class="rounded-2xl border border-white/10 bg-white/10 p-5">
        <h2 class="text-xl font-bold">Action call: Node system info</h2>
        <button class="mt-4 rounded-xl bg-sky-400 px-4 py-2 font-bold text-slate-950" onclick={systemInfo}>Call action</button>
        <pre class="mt-4 max-h-56 overflow-auto rounded-xl bg-black/30 p-3 text-xs">{appState.demo.systemInfo}</pre>
      </div>
    </section>
  </main>
{/if}

{#if appState.runtime.showBootstrap}
  <RuntimeInstallLog />
{/if}
