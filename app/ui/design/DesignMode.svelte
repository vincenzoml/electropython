<script lang="ts">
  import { onMount } from 'svelte';
  import StatusCard from '../components/StatusCard.svelte';
  import { appState } from '../stores/app-state.svelte';
  import { savePersistedState, exportFullStateSnapshot, importFullStateSnapshot } from '../stores/persistence';
  import { applyThemeVars, exportThemePreset, importThemePreset, setThemeVar } from '../stores/theme';
  import { componentRegistry, spacingScale, themeTokens, typographyScale } from './design-system';

  type Panel = 'foundations' | 'catalog' | 'settings';

  const nav: { id: Panel; label: string; detail: string }[] = [
    { id: 'foundations', label: 'Foundations', detail: 'Design tokens' },
    { id: 'catalog', label: 'Catalog', detail: 'Components' },
    { id: 'settings', label: 'Settings', detail: 'Export & prefs' }
  ];

  let error = '';
  let themeFileInput: HTMLInputElement | undefined;
  let stateFileInput: HTMLInputElement | undefined;
  let selectedComponent = $state(componentRegistry[0]?.name ?? 'StatusCard');

  const panel = $derived(normalizePanel(appState.ui.activeDesignPanel));
  const activeComponent = $derived(
    componentRegistry.find(item => item.name === selectedComponent) ?? componentRegistry[0]
  );

  onMount(() => {
    applyThemeVars();
    appState.ui.activeDesignPanel = normalizePanel(appState.ui.activeDesignPanel);
  });

  function normalizePanel(id: string): Panel {
    if (id === 'catalog' || id === 'components') return 'catalog';
    if (id === 'settings' || id === 'presets' || id === 'map') return 'settings';
    return 'foundations';
  }

  function openPanel(id: Panel) {
    appState.ui.activeDesignPanel = id;
    savePersistedState();
  }

  function themeValue(name: string) {
    return appState.design.themeVars[name as keyof typeof appState.design.themeVars] ?? '#000000';
  }

  function onColorChange(name: string, event: Event) {
    setThemeVar(name, (event.currentTarget as HTMLInputElement).value);
    savePersistedState();
  }

  function onThemeMode(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value;
    if (value === 'light' || value === 'dark' || value === 'system') {
      appState.app.theme = value;
      applyThemeVars();
      savePersistedState();
    }
  }

  function onDensity(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value;
    if (value === 'compact' || value === 'comfortable' || value === 'spacious') {
      appState.ui.density = value;
      savePersistedState();
    }
  }

  function downloadJson(filename: string, value: unknown) {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportTheme() {
    downloadJson('electropython-theme.json', exportThemePreset());
  }

  async function importFile(event: Event, kind: 'theme' | 'snapshot') {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (kind === 'theme') importThemePreset(parsed);
      else importFullStateSnapshot(parsed);
      error = '';
      savePersistedState();
    } catch (caught) {
      error = caught instanceof Error ? caught.message : String(caught);
    } finally {
      (event.currentTarget as HTMLInputElement).value = '';
    }
  }

  function exitDesignMode() {
    appState.ui.designMode = false;
    savePersistedState();
  }
</script>

<div class="ep-ds">
  <header class="ep-ds-topbar">
    <div>
      <p class="ep-ds-eyebrow">{appState.app.name}</p>
      <h1 class="ep-ds-title">Design system</h1>
    </div>
    <div class="ep-ds-topbar-actions">
      <button class="ep-button ep-button-muted" onclick={exportTheme}>Export theme</button>
      <button class="ep-button" onclick={exitDesignMode}>Exit</button>
    </div>
  </header>

  {#if error}
    <div class="ep-design-alert">{error}</div>
  {/if}

  <div class="ep-ds-body">
    <nav class="ep-ds-nav" aria-label="Design system">
      {#each nav as item}
        <button
          class="ep-ds-nav-item"
          class:ep-ds-nav-item-active={panel === item.id}
          onclick={() => openPanel(item.id)}
        >
          <span class="ep-ds-nav-label">{item.label}</span>
          <span class="ep-ds-nav-detail">{item.detail}</span>
        </button>
      {/each}
    </nav>

    <main class="ep-ds-main">
      {#if panel === 'foundations'}
        <section class="ep-ds-section">
          <header class="ep-ds-section-head">
            <h2>Color</h2>
            <p>Semantic surface tokens mapped to CSS custom properties.</p>
          </header>

          <div class="ep-ds-toolbar">
            <label class="ep-field-inline">
              <span>Mode</span>
              <select class="ep-input ep-input-compact" value={appState.app.theme} onchange={onThemeMode}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </label>
          </div>

          <div class="ep-token-grid">
            {#each themeTokens as token}
              <label class="ep-token-card">
                <div class="ep-token-row">
                  <div>
                    <strong>{token.name}</strong>
                    <code>{token.variable}</code>
                  </div>
                  <input
                    class="ep-color-input"
                    type="color"
                    value={themeValue(token.variable)}
                    oninput={(event) => onColorChange(token.variable, event)}
                  />
                </div>
                <div class="ep-token-swatch" style={`background: ${themeValue(token.variable)}`}></div>
              </label>
            {/each}
          </div>
        </section>

        <section class="ep-ds-section">
          <header class="ep-ds-section-head">
            <h2>Typography</h2>
            <p>Type scale for display, interface, and monospace output.</p>
          </header>
          <div class="ep-stack">
            {#each typographyScale as row}
              <div class="ep-sample-card">
                <p class={row.className}>{row.name}</p>
                <code>{row.className}</code>
              </div>
            {/each}
          </div>
        </section>

        <section class="ep-ds-section">
          <header class="ep-ds-section-head">
            <h2>Space</h2>
            <p>Spacing rhythm and default interface density.</p>
          </header>

          <label class="ep-field">
            <span>Density</span>
            <select class="ep-input" value={appState.ui.density} onchange={onDensity}>
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </label>

          <div class="ep-stack mt-4">
            {#each spacingScale as row}
              <div class="ep-spacing-row">
                <code>{row.token}</code>
                <div class="ep-spacing-bar" style={`width: ${row.value}`}></div>
                <span>{row.value}</span>
              </div>
            {/each}
          </div>
        </section>
      {/if}

      {#if panel === 'catalog'}
        <div class="ep-ds-catalog">
          <aside class="ep-ds-catalog-list">
            <header class="ep-ds-section-head">
              <h2>Components</h2>
              <p>Registered UI building blocks in this app.</p>
            </header>
            {#each componentRegistry as component}
              <button
                class="ep-ds-catalog-item"
                class:ep-ds-catalog-item-active={selectedComponent === component.name}
                onclick={() => (selectedComponent = component.name)}
              >
                <strong>{component.name}</strong>
                <span>{component.kind}</span>
              </button>
            {/each}
          </aside>

          <section class="ep-ds-catalog-preview">
            {#if activeComponent}
              <header class="ep-ds-section-head">
                <h2>{activeComponent.name}</h2>
                <p>{activeComponent.description}</p>
                <code class="ep-path">{activeComponent.editPath}</code>
              </header>

              <div class="ep-preview-stage">
                {#if activeComponent.name === 'StatusCard'}
                  <StatusCard title="Python runtime" value={appState.runtime.python} detail="Live token preview" />
                {:else if activeComponent.name === 'DesignMode'}
                  <div class="ep-preview-placeholder">This panel is the design system shell you are viewing now.</div>
                {:else}
                  <div class="ep-preview-grid">
                    <div class="ep-preview-card">
                      <p class="ep-preview-kicker">Primary</p>
                      <button class="ep-button">Action</button>
                    </div>
                    <div class="ep-preview-card">
                      <p class="ep-preview-kicker">Secondary</p>
                      <button class="ep-button ep-button-muted">Action</button>
                    </div>
                    <div class="ep-preview-card ep-preview-card-wide">
                      <p class="ep-preview-kicker">Input</p>
                      <input class="ep-input" value="Sample value" readonly />
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </section>
        </div>
      {/if}

      {#if panel === 'settings'}
        <section class="ep-ds-section ep-ds-section-narrow">
          <header class="ep-ds-section-head">
            <h2>Theme files</h2>
            <p>Move token sets between machines or share with your team.</p>
          </header>
          <div class="ep-action-row">
            <button class="ep-button" onclick={exportTheme}>Export JSON</button>
            <button class="ep-button ep-button-muted" onclick={() => themeFileInput?.click()}>Import JSON</button>
            <input class="hidden" bind:this={themeFileInput} type="file" accept="application/json" onchange={(e) => importFile(e, 'theme')} />
          </div>
        </section>

        <section class="ep-ds-section ep-ds-section-narrow">
          <header class="ep-ds-section-head">
            <h2>Design snapshot</h2>
            <p>Full local design state: tokens, density, and demo fields.</p>
          </header>
          <div class="ep-action-row">
            <button class="ep-button ep-button-muted" onclick={() => downloadJson('electropython-design.json', exportFullStateSnapshot())}>
              Export snapshot
            </button>
            <button class="ep-button ep-button-muted" onclick={() => stateFileInput?.click()}>Import snapshot</button>
            <input class="hidden" bind:this={stateFileInput} type="file" accept="application/json" onchange={(e) => importFile(e, 'snapshot')} />
          </div>
        </section>

        <section class="ep-ds-section ep-ds-section-narrow">
          <header class="ep-ds-section-head">
            <h2>Workspace</h2>
            <p>Local preferences stored in the browser.</p>
          </header>
          <label class="ep-field">
            <span>Demo greeting name</span>
            <input class="ep-input" bind:value={appState.demo.name} oninput={savePersistedState} />
          </label>
          <label class="ep-check-row">
            <input type="checkbox" bind:checked={appState.persisted.settings.openDesignModeOnBoot} onchange={savePersistedState} />
            <span>Open design system on launch</span>
          </label>
        </section>
      {/if}
    </main>
  </div>
</div>
