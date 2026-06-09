<script lang="ts">
  import { appState } from '../stores/app-state.svelte';
</script>

<section class="rounded-2xl border border-sky-300/30 bg-sky-400/10 p-5">
  <h2 class="text-xl font-bold">Design Mode</h2>
  <p class="mt-2 text-slate-200">Inspect palette, typography, components, state, actions, APIs, streams, and bridge traces.</p>
  <pre class="mt-4 max-h-80 overflow-auto rounded-xl bg-black/40 p-4 text-xs">{JSON.stringify(appState, null, 2)}</pre>
</section>
