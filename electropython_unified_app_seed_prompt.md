# ElectroPython Seed Prompt

## Mission

Create `electropython` in the current directory.

ElectroPython is an opinionated, production-grade scaffold for building beautiful desktop-first, web-capable, CLI-capable, and agent-capable applications powered by Python, Node.js, Svelte, and Electron.

Users should be able to clone the repo, run it, change the app to make it do what they want, package it for major operating systems, and update any component in the future without losing architectural clarity.

It must feel natural to Python developers, natural to TypeScript/Svelte developers, natural to CLI users, and highly legible to AI coding agents.

The result is not a toy demo. It is a clean architectural seed for real applications.

ElectroPython should make this workflow effortless:

> Write Python logic and Node.js logic, expose both as clean capabilities, define user-facing actions in one application logic layer, bind those actions to a beautiful Svelte UI, run them from Electron, web mode, CLI mode, a restricted AI-agent API, and an MCP server, then package the result as a real installable app for macOS, Windows, and Linux.

---

## Core Philosophy

ElectroPython follows these principles.

1. **The app has two capability brains: Python and Node.js.**
   Python is ideal for scientific computing, data processing, automation, AI, scripting, and Python-native libraries. Node.js is ideal for Electron integration, npm ecosystem packages, filesystem/watchers, web tooling, OS integration, and JavaScript-native services. Both must be first-class capability runtimes.

2. **Application logic is the source of user power.**
   The application logic layer defines what the user can actually do. It is the canonical action layer used by the Svelte UI, Electron app, web app, CLI, restricted AI-agent API, and MCP server.

3. **Capabilities are not actions.**
   Python and Node.js expose capabilities. Application actions compose those capabilities into meaningful user operations. External interfaces should normally call actions, not arbitrary low-level capabilities.

4. **APIs are the nervous system.**
   Python APIs, Node.js APIs, application actions, streams, dev tools, Electron, the renderer, web mode, CLI mode, AI-agent mode, and MCP mode must communicate through explicit, documented, typed API boundaries.

5. **Svelte is the product face.**
   UI, interaction, design systems, state visualization, design mode, and user workflows live in Svelte 5.

6. **Electron is a shell, not a prison.**
   The app runs as an Electron desktop app by default, but the same application logic must be usable in web mode, CLI mode, restricted AI-agent API mode, and MCP server mode.

7. **Bridging is allowed, but never hidden.**
   Python may call Node.js, and Node.js may call Python, but such bridges must be explicit, observable, typed, cancellable where possible, permissioned, logged, and visible in dev tools.

8. **User-editable code is sacred.**
   Framework internals and user application code must be clearly separated so users and AI agents know where to safely modify.

9. **The scaffold teaches good architecture.**
   The example app must demonstrate separation of concerns, reactive state, Python calls, Node.js calls, application actions, cross-runtime bridging, push streams, CLI execution, MCP exposure, theming, persistence, packaging, and live design inspection.

10. **The app repairs itself when reasonable.**
    Missing Python dependencies, missing Node packages, missing runtime files, or incomplete local setup should be detected and repaired automatically when safe.

11. **AI agents are first-class developers.**
    The system must expose a powerful dev API for introspection, testing, state inspection, component inventory, Python API discovery, Node.js API discovery, application action discovery, bridge tracing, logs, errors, and debugging.

12. **AI agents are first-class users.**
    A restricted non-dev AI-agent API must expose only user-facing application actions, not unrestricted development tools.

13. **Packaging is not optional.**
    ElectroPython must be designed from the beginning to ship as real installable software on macOS, Windows, and Linux, including Python source deployment and fast, tidy first-boot runtime provisioning.

---

## Product Definition

ElectroPython is a starter framework containing:

- Electron desktop shell.
- Web server mode.
- CLI mode.
- Restricted non-dev AI-agent API mode.
- MCP server mode.
- Svelte 5 frontend.
- Tailwind CSS.
- shadcn-svelte component system.
- Python runtime manager.
- `uv`-based Python dependency installation.
- npm-based Node.js dependency management.
- Python capability API server.
- Python push/event protocol.
- Node.js capability API server.
- Node.js push/event protocol.
- Safe Python -> Node.js and Node.js -> Python bridge.
- Canonical application action layer.
- Central reactive Svelte state.
- Persistent app store.
- Design mode.
- Dev/debug API.
- Runtime agent API.
- MCP tool/resource/prompt exposure.
- Packaging and installer strategy.
- Clean example application.
- Clear boundaries between framework code and user code.

---

## Main Architectural Model

ElectroPython must use this hierarchy:

```text
External surfaces
  - Electron UI
  - Web UI
  - CLI
  - Runtime AI-agent API
  - MCP server
  - Dev API

Application action layer
  - user-facing actions
  - permissions
  - schemas
  - validation
  - progress
  - cancellation
  - audit events
  - orchestration

Capability layer
  - Python APIs
  - Python streams
  - Node.js APIs
  - Node.js streams
  - explicit Python <-> Node.js bridge

Runtime layer
  - Python runtime and venv
  - Node.js runtime and packages
  - Electron host
  - web server
  - packaging runtime paths
```

The application action layer is the central contract. The UI, CLI, runtime AI-agent API, and MCP server should expose the same actions through different adapters.

The dev API may expose more than actions, but production/user-facing APIs must be restricted to declared actions.

---

## Required User Experience

A developer should be able to run:

```bash
npm install
npm run dev
```

Then see a desktop app that:

- boots Electron;
- starts Python automatically;
- starts the Node.js capability layer automatically;
- starts the application action layer automatically;
- installs or repairs Python dependencies if needed;
- verifies Node.js dependencies if needed;
- exposes Python capabilities;
- exposes Node.js capabilities;
- exposes user-facing application actions;
- calls application actions from Svelte through one coherent client API;
- receives push updates from Python and Node.js;
- demonstrates a safe Python <-> Node.js bridge;
- displays a polished default UI;
- shows a live clock produced by Python every second;
- shows a live heartbeat produced by Node.js every second;
- includes design mode;
- includes a dev/debug mode;
- can run without Electron via web mode;
- can run actions from the command line;
- can expose user actions to AI agents through a restricted runtime API;
- can expose user actions through an MCP server.

Example commands:

```bash
npm run dev
npm run dev -- --web
npm run cli -- actions:list
npm run cli -- action greet --name Ada
npm run agent-api
npm run mcp
npm run package
```

The exact command names may differ, but the functionality must exist and be documented.

---

## Package Manager Policy

Use npm as the canonical JavaScript package manager.

Requirements:

- commit `package-lock.json`;
- use `npm ci` for reproducible CI and packaging installs;
- do not use Yarn-specific or pnpm-specific features in the canonical scaffold;
- advanced users may adapt the scaffold to another package manager, but the official template must remain npm-first.

---

## Python Runtime Requirements

ElectroPython must ship or provision a minimal Python runtime.

### Runtime behavior

The scaffold must:

- support selecting a Python version;
- default to Python `3.14`;
- allow the version to be configured in one obvious place;
- use `uv` for Python runtime and dependency management;
- install packages from top-level `requirements.txt`;
- optionally support a future `pyproject.toml` mode, but `requirements.txt` must exist and work;
- unpack, install, or provision the managed Python runtime into a canonical app-local or user-data location;
- never scatter runtime files across random project directories;
- cache downloads when possible;
- verify runtime health on boot;
- verify dependencies on boot;
- repair missing dependencies automatically when safe;
- produce clear errors when repair is impossible;
- support packaged production mode where bundled app resources are read-only.

### Development runtime paths

In development, use explicit, documented locations such as:

```text
.electropython/
  runtime/
  venv/
  cache/
  logs/
  state/
```

Application developers should rarely edit `.electropython/`.

### Production runtime paths

In packaged apps, do not assume the installed application directory is writable.

Production runtime data must live in canonical per-user application data locations, for example:

```text
macOS:   ~/Library/Application Support/ElectroPython/
Windows: %LOCALAPPDATA%/ElectroPython/
Linux:   ~/.local/share/electropython/
```

Inside that app data directory, keep a tidy structure:

```text
runtime/
venv/
cache/
logs/
state/
python-src/
node-runtime-state/
diagnostics/
```

The app must clearly distinguish:

- bundled read-only resources;
- first-boot extracted resources;
- user data;
- cache;
- logs;
- generated runtime files.

---

## Node.js Runtime and Dependency Requirements

ElectroPython must treat Node.js as a runtime capability layer, not only as build tooling.

The scaffold must:

- use top-level `package.json` for Node.js dependencies;
- keep framework Node.js code separate from user Node.js code;
- verify Node.js dependency health on boot;
- repair missing Node.js dependencies when safe in development;
- avoid mutating packaged production app resources;
- expose Node.js runtime status in app state, diagnostics, design mode, and dev API;
- expose Node.js version, package manager, and dependency status in diagnostics;
- keep Node.js APIs available in Electron mode, web mode, CLI mode, agent API mode, and MCP mode where possible;
- clearly mark APIs that require Electron-only privileges;
- never expose direct Node.js access to the Svelte renderer.

The renderer must call Node.js capabilities only through explicit APIs.

---

## Unified Capability Model

ElectroPython must present Python APIs and Node.js APIs as two backends behind one coherent capability model.

Conceptually:

```text
Application actions
  -> capability client
    -> Python capability API
    -> Node.js capability API
    -> explicit bridge
```

The user should not need to learn unrelated systems. They should learn one capability model with Python and Node.js implementations.

Example conceptual calls:

```ts
await capabilities.python.greet({ name: "Ada" });
await capabilities.node.systemInfo({});
await bridge.call({ from: "node", to: "python", capability: "analyzeFile", input: { path } });
```

The capability model must be:

- typed;
- observable;
- documented;
- permissioned;
- inspectable from design mode;
- inspectable from the dev API;
- safe by default;
- usable by AI agents without guessing hidden architecture.

---

## Application Action Layer Requirements

This is the most important layer.

Application actions define what the user can do. Every user-facing surface must use this layer:

- Svelte UI;
- Electron app;
- web app;
- CLI;
- runtime AI-agent API;
- MCP server.

A user should be able to define an action once and expose it everywhere with controlled metadata.

Example conceptual TypeScript:

```ts
import { action } from "electropython/app";

export const greetAction = action({
  id: "demo.greet",
  title: "Greet someone",
  description: "Return a greeting from the Python backend.",
  input: {
    name: "string"
  },
  output: {
    message: "string"
  },
  permissions: ["demo:greet"],
  surfaces: ["ui", "cli", "agent", "mcp"],
  async run(ctx, input) {
    const message = await ctx.python.call("greet", input);
    return { message };
  }
});
```

The exact syntax may differ, but the concept must be implemented.

Each action must support:

- stable action id;
- title;
- description;
- input schema;
- output schema;
- permission requirements;
- allowed surfaces;
- dry-run support where meaningful;
- progress events for long-running operations;
- cancellation where possible;
- structured errors;
- audit/logging hooks;
- optional streaming output;
- CLI name/aliases;
- MCP tool metadata;
- AI-agent safety metadata;
- examples.

Actions should be the primary abstraction for user workflows.

Capabilities are low-level power. Actions are user-safe operations.

---

## CLI Mode Requirements

ElectroPython must include a real CLI mode.

The CLI must:

- discover the same application action registry used by the UI;
- list available actions;
- print action schemas;
- run actions with flags, JSON input, or stdin;
- support JSON output for scripting;
- support human-readable output for terminals;
- support batch execution;
- support interactive REPL mode;
- support progress events;
- support cancellation;
- return meaningful exit codes;
- use the same permission and validation model as other surfaces;
- not require Electron;
- start only the runtimes required by the selected action.

Example conceptual commands:

```bash
electropython actions:list
electropython actions:describe demo.greet
electropython action demo.greet --name Ada
electropython action demo.greet --json '{"name":"Ada"}'
electropython repl
```

The CLI must be a first-class product surface, not an afterthought.

---

## Runtime AI-Agent API Requirements

ElectroPython must expose a restricted, non-dev AI-agent API mode.

This API is different from the dev API.

The runtime AI-agent API must expose user actions only, according to permissions and surface metadata.

It must not expose:

- arbitrary Python execution;
- arbitrary Node.js execution;
- unrestricted filesystem access;
- development-only state patching;
- unrestricted bridge access;
- component mutation;
- unsafe diagnostics;
- secrets;
- logs unless explicitly allowed.

Required capabilities:

- list allowed actions;
- describe action schemas;
- call allowed actions;
- subscribe to allowed action progress/events;
- expose structured errors;
- expose safe status information;
- enforce local-only binding by default;
- support authentication or token-based access when not strictly local;
- log all agent calls in an audit trail.

Suggested endpoints:

```text
GET  /api/actions
GET  /api/actions/:id
POST /api/actions/:id/run
GET  /api/events
GET  /api/health
```

The agent API must be production-safe by default.

---

## MCP Server Requirements

ElectroPython must include an MCP server mode.

The MCP server must expose application actions as MCP tools where the action metadata allows the `mcp` surface.

It should also be able to expose safe resources and prompts when explicitly declared by the application.

The MCP server must:

- run without Electron;
- use the same application action registry as the UI and CLI;
- expose only actions allowed for MCP;
- map action input/output schemas to MCP tool schemas;
- support stdio transport for local agent clients;
- support streamable HTTP transport if enabled;
- use the same permission system as other non-dev surfaces;
- support progress/events where the MCP transport allows it;
- produce structured errors;
- keep an audit log;
- never expose dev-only tools in production unless explicitly configured.

Conceptual command:

```bash
electropython mcp
```

MCP is a user-operation surface, not a backdoor into framework internals.

---

## Python API Requirements

At boot, the runtime host must be able to launch a Python backend process when needed.

The Python backend must expose APIs in a way that feels natural to Python developers.

A user should be able to write something like:

```python
from electropython import api, stream

@api
def greet(name: str) -> str:
    """Return a friendly greeting."""
    return f"Hello, {name}"

@stream(interval=1.0)
def clock():
    """Emit the current time every second."""
    from datetime import datetime
    yield datetime.now().isoformat()
```

The action layer should be able to call:

```ts
const message = await ctx.python.call("greet", { name: "Ada" });
```

And subscribe to:

```ts
ctx.python.stream("clock", value => {
  appState.demo.clock = value;
});
```

The implementation should choose a robust protocol, preferably:

- HTTP/JSON or JSON-RPC for request-response APIs;
- WebSocket or Server-Sent Events for push streams;
- typed request and response envelopes;
- structured error responses;
- cancellation support for long-running calls;
- graceful shutdown;
- heartbeat/health endpoint;
- runtime status endpoint.

Electron must proxy the same API rather than inventing a separate private protocol.

---

## Node.js API Requirements

ElectroPython must provide a first-class Node.js capability layer.

Node.js is not merely build tooling and not merely Electron glue. It is a second application brain for capabilities that are more naturally implemented in JavaScript or TypeScript.

The Node.js API layer must be used for capabilities such as:

- Electron-native integration;
- filesystem access and file watching;
- npm ecosystem packages;
- OS integration;
- shell/process orchestration when safe;
- fast development tooling;
- local web server coordination;
- APIs that are more idiomatic in TypeScript than Python.

A user should be able to write something like:

```ts
import { nodeApi, nodeStream } from "electropython/node";

nodeApi("systemInfo", async () => {
  return {
    platform: process.platform,
    node: process.version
  };
});

nodeStream("heartbeat", async function* () {
  while (true) {
    yield { now: new Date().toISOString() };
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
});
```

The action layer should be able to call:

```ts
const info = await ctx.node.call("systemInfo", {});
```

Node APIs must use the same envelope model as Python APIs:

- typed request payloads;
- typed response payloads;
- structured errors;
- cancellation support where practical;
- health endpoint;
- runtime status endpoint;
- dev API registry;
- production allowlist.

---

## Python <-> Node.js Bridge Requirements

ElectroPython must support safe bridging between the two capability brains.

The bridge must allow:

- application actions calling Python APIs;
- application actions calling Node.js APIs;
- Node.js calling Python APIs;
- Python calling Node.js APIs;
- Python and Node.js publishing events to shared channels;
- dev tools tracing cross-runtime calls.

The bridge must be explicit. No runtime should secretly import, monkey-patch, or tunnel into another runtime without going through the documented protocol.

Conceptual examples:

```ts
// Node.js calling Python
const result = await pythonClient.call("analyze_file", { path });
```

```python
# Python calling Node.js
from electropython import node

info = await node.call("systemInfo", {})
```

The bridge must define:

- call identity;
- source runtime;
- target runtime;
- correlation IDs;
- timeouts;
- cancellation;
- structured errors;
- logging;
- permission policy;
- dev-mode tracing;
- audit events for production-sensitive calls.

Prefer a single internal message envelope for Python APIs, Node APIs, streams, action calls, and bridge calls.

---

## Unified Protocol Envelope

Use one conceptual envelope across actions, capabilities, streams, bridge calls, CLI, AI-agent API, MCP adapters, and dev tools.

Example conceptual shape:

```ts
type ElectroPythonEnvelope = {
  id: string;
  kind: "action" | "capability" | "stream" | "bridge" | "event" | "error";
  source: "ui" | "cli" | "agent" | "mcp" | "dev" | "python" | "node" | "electron";
  target: "app" | "python" | "node" | "bridge" | "dev";
  name: string;
  payload?: unknown;
  metadata: {
    correlationId?: string;
    userIntent?: string;
    surface?: string;
    permissions?: string[];
    timeoutMs?: number;
    cancellable?: boolean;
    trace?: boolean;
  };
};
```

The actual implementation may differ, but the scaffold must have a single documented protocol model.

---

## Push Protocol Requirements

The push system must support:

- Python-to-action event streams;
- Node.js-to-action event streams;
- action-to-UI event streams;
- action-to-CLI progress streams;
- action-to-agent progress streams;
- Python-to-Node.js and Node.js-to-Python event streams when explicitly bridged;
- named channels;
- typed payloads;
- subscription and unsubscription;
- reconnection;
- backpressure policy;
- error events;
- lifecycle events;
- example stream: current date/time emitted every second from Python;
- example stream: Node.js heartbeat emitted every second.

Push APIs should be easy for both Python programmers and TypeScript programmers.

The final scaffold should pick one primary Python pattern and one primary TypeScript pattern, then document how both map onto the same underlying protocol.

---

## Frontend Requirements

Use:

- Svelte 5;
- Tailwind CSS;
- shadcn-svelte;
- TypeScript;
- Vite or equivalent modern build tooling.

The default page must demonstrate:

- calling an application action;
- action calling a Python capability;
- action calling a Node.js capability;
- Python push stream;
- Node.js push stream;
- central reactive state;
- persisted state;
- component composition;
- theme switching;
- design mode link;
- debug/dev mode link.

The UI must be beautiful, high contrast, accessible, and production-like.

Do not create a bland hello world.

Create a small but meaningful demo application showing:

- app title;
- Python runtime status;
- Node.js runtime status;
- bridge status;
- dependency status;
- live Python clock;
- live Node.js heartbeat;
- action call demo;
- persisted settings;
- design-system preview;
- logs/dev panel;
- light/dark theme switch.

---

## Central State Requirements

Create a centralized Svelte 5 state module using modern Svelte 5 reactivity.

The store must:

- be typed;
- be deeply reactive where useful;
- be initialized from defaults;
- persist selected fields;
- support import/export;
- expose derived values;
- separate persistent state from ephemeral runtime state;
- be safe to inspect and edit in design mode.

Example conceptual shape:

```ts
appState = {
  app: {
    name: "ElectroPython",
    mode: "electron" | "web" | "cli" | "agent" | "mcp",
    theme: "light" | "dark" | "system"
  },
  actions: {
    registry: Record<string, ActionMetadata>,
    running: Record<string, ActionRunSummary>
  },
  python: {
    status: "starting" | "ready" | "error",
    version: string,
    api: Record<string, ApiMetadata>
  },
  node: {
    status: "starting" | "ready" | "error",
    version: string,
    api: Record<string, ApiMetadata>,
    heartbeat: string
  },
  bridge: {
    status: "ready" | "degraded" | "error",
    recentCalls: BridgeCallSummary[]
  },
  ui: {
    designMode: boolean,
    sidebarOpen: boolean
  },
  demo: {
    name: string,
    greeting: string,
    clock: string
  }
}
```

---

## Separation of Concerns

The project must enforce clear architectural zones.

Suggested layout:

```text
electropython/
  package.json
  package-lock.json
  requirements.txt
  README.md
  electropython.config.ts

  framework/
    electron/
      main/
      preload/
      bridge/
    runtime/
      supervisor/
      paths/
      packaging/
    python/
      runtime/
      api_server/
      protocol/
      repair/
    node/
      api_server/
      protocol/
      bridge/
      repair/
    app_runtime/
      actions/
      permissions/
      adapters/
        ui/
        cli/
        agent_api/
        mcp/
    shared/
      schemas/
      logging/
      config/
      diagnostics/

  app/
    actions/
      index.ts
      demo.ts

    python/
      apis/
      streams/
      logic/
      startup.py

    node/
      apis/
      streams/
      logic/
      startup.ts

    logic/
      effects/
      workflows/
      bridge.ts
      permissions.ts

    ui/
      components/
      routes/
      design/
      stores/
      themes/
      App.svelte

  docs/
    architecture.md
    getting-started.md
    actions.md
    cli.md
    agent-api.md
    mcp-server.md
    packaging.md
    python-api.md
    node-api.md
    python-node-bridge.md
    frontend-state.md
    design-mode.md
    ai-agent-guide.md

  .electropython/
    runtime/
    venv/
    cache/
    logs/
    state/
```

### Hard rule

Framework internals must not be mixed with user-editable app code.

User-editable areas should be clearly marked:

```text
app/actions/
app/python/
app/node/
app/ui/
app/logic/
requirements.txt
package.json
electropython.config.ts
```

Framework-owned areas should be clearly marked:

```text
framework/
.electropython/
```

---

## UI Component System

Build a component system that is:

- reusable;
- theme-aware;
- accessible;
- documented;
- independent from business logic;
- driven by props and central state;
- compatible with shadcn-svelte;
- easy for AI agents to extend.

Include ready-made high-level widgets:

- `StatusCard`;
- `RuntimeHealthPanel`;
- `ActionRunner`;
- `ActionRegistryPanel`;
- `ApiCallDemo`;
- `StreamValue`;
- `LogViewer`;
- `ThemeSwitcher`;
- `SettingsPanel`;
- `StateInspector`;
- `DesignPalette`;
- `TypographyPreview`;
- `ComponentGallery`;
- `PythonConsole`;
- `NodeConsole` in development only if safe;
- `McpInspector`;
- `AgentApiInspector`.

Each widget must be beautiful by default and usable in real applications.

---

## Logic Layer Requirements

Create a no-UI logic layer that reacts to state and APIs.

This layer must:

- define user-facing actions or import them from `app/actions`;
- not import Svelte components;
- coordinate Python API calls;
- coordinate Node.js API calls;
- coordinate explicit Python <-> Node.js bridge calls;
- manage stream subscriptions;
- update central state;
- handle errors;
- implement lifecycle hooks;
- serve the UI, CLI, runtime AI-agent API, and MCP adapters;
- be testable without UI.

Example:

```text
app/logic/
  boot.ts
  python-runtime.ts
  node-runtime.ts
  bridge.ts
  streams.ts
  persistence.ts
  effects.ts
  permissions.ts
```

The UI renders state.

The action layer defines what the user can do.

The logic layer coordinates behavior.

Python provides Python-native capabilities.

Node.js provides JavaScript-native and host-adjacent capabilities.

Electron provides the desktop shell.

CLI, agent API, and MCP are adapters over the same action layer.

---

## Design Mode

ElectroPython must include a built-in design mode.

Design mode is not an afterthought. It is a core feature.

It must allow developers and AI agents to inspect:

- color palette;
- themes;
- typography;
- spacing;
- components;
- widgets;
- icons;
- app state;
- persisted state;
- application action registry;
- Python API registry;
- Node.js API registry;
- bridge registry and recent bridge calls;
- stream registry;
- CLI action exposure;
- runtime AI-agent action exposure;
- MCP tool exposure;
- runtime status;
- logs;
- errors;
- environment information.

It must allow safe live editing of:

- theme variables;
- demo state;
- persisted settings;
- component props in previews;
- import/export of state snapshots;
- import/export of theme presets.

Design mode must make customization easy without breaking architecture.

It should include guidance such as:

> Edit user-facing actions in `app/actions/`.
>
> Edit UI components in `app/ui/components/`.
>
> Edit Python APIs in `app/python/apis/`.
>
> Edit Node.js APIs in `app/node/apis/`.
>
> Edit cross-runtime workflows in `app/logic/bridge.ts`.
>
> Edit app workflows in `app/logic/`.
>
> Avoid editing `framework/` unless you are changing ElectroPython itself.

---

## Python Console and Node Console

Include an optional Python console in the demo app.

The Python console should:

- run only in development mode by default;
- clearly warn about execution privileges;
- execute Python snippets through the backend;
- show stdout/stderr;
- preserve command history locally;
- support simple inspection commands;
- be disableable for production builds.

A Node.js console may be included only if it can be made equally safe and clearly development-only.

Consoles must never be exposed accidentally in production.

---

## Dev API for AI Agents

ElectroPython must expose a state-of-the-art development API.

This API should let AI agents inspect and debug the app quickly.

Required dev API capabilities:

- list registered application actions;
- list action schemas and allowed surfaces;
- list registered Python APIs;
- list registered Node.js APIs;
- list registered streams;
- list bridge routes and recent bridge calls;
- call Python or Node.js APIs with test payloads;
- call application actions with test payloads;
- inspect current app state;
- inspect persisted state;
- inspect component registry;
- inspect theme tokens;
- inspect logs;
- inspect Python runtime health;
- inspect Node.js runtime health;
- inspect dependency health for both runtimes;
- inspect Electron mode vs web mode vs CLI mode vs MCP mode;
- trigger controlled reloads;
- export diagnostic bundle;
- run safe self-tests;
- report architectural boundary violations.

Suggested endpoints:

```text
GET  /__dev__/health
GET  /__dev__/actions
GET  /__dev__/actions/:id
POST /__dev__/actions/:id/test
GET  /__dev__/apis
GET  /__dev__/apis/python
GET  /__dev__/apis/node
GET  /__dev__/bridge
GET  /__dev__/streams
GET  /__dev__/state
POST /__dev__/state/patch
GET  /__dev__/components
GET  /__dev__/theme
GET  /__dev__/logs
POST /__dev__/self-test
POST /__dev__/diagnostics/export
```

All dev APIs must be disabled or protected in production.

---

## Security Requirements

The scaffold must be safe by default.

Requirements:

- Electron context isolation enabled;
- no arbitrary Node access in renderer;
- explicit preload bridge;
- strict API allowlist for Python and Node.js;
- strict action permission model;
- strict bridge allowlist for Python <-> Node.js calls;
- strict surface allowlist for UI, CLI, agent API, and MCP;
- no production Python console unless explicitly enabled;
- no production Node console unless explicitly enabled;
- no dev API in production unless explicitly enabled and protected;
- safe subprocess management;
- no arbitrary Node.js execution from the renderer;
- graceful backend shutdown;
- clear local-only binding by default;
- no network exposure unless configured;
- authentication or tokens for non-local runtime APIs;
- audit logging for AI-agent and MCP calls;
- clear warnings for dangerous settings.

---

## Configuration Requirements

Create one obvious configuration file.

Example:

```ts
// electropython.config.ts
export default {
  python: {
    version: "3.14",
    requirements: "requirements.txt",
    autoRepair: true
  },
  node: {
    packageManager: "npm",
    autoRepair: true,
    exposeApi: true
  },
  actions: {
    defaultSurfaces: ["ui", "cli"],
    requireExplicitAgentExposure: true,
    requireExplicitMcpExposure: true
  },
  bridge: {
    allowPythonToNode: true,
    allowNodeToPython: true,
    traceInDev: true
  },
  runtime: {
    developmentDirectory: ".electropython",
    productionAppDataName: "ElectroPython"
  },
  app: {
    defaultMode: "electron",
    allowWebMode: true,
    allowCliMode: true,
    allowAgentApiMode: true,
    allowMcpMode: true
  },
  dev: {
    enableDevApi: true,
    enablePythonConsole: true,
    enableNodeConsole: false,
    enableDesignMode: true
  },
  production: {
    enableDevApi: false,
    enablePythonConsole: false,
    enableNodeConsole: false,
    bindHost: "127.0.0.1"
  }
}
```

Configuration must be typed and documented.

---

## Packaging and Distribution Requirements

ElectroPython must be designed from the start for real distribution.

The app must be deployable as an installer or installable package on:

- macOS;
- Windows;
- Linux.

The packaged app must include:

- Electron shell;
- compiled/bundled Svelte frontend;
- Node.js runtime code needed by the app;
- framework runtime code;
- user Node.js source or compiled output as appropriate;
- user Python sources;
- `requirements.txt` or equivalent dependency manifest;
- `uv` bootstrap strategy;
- first-boot runtime provisioning logic;
- production configuration defaults;
- safe disabled development features.

### Packaging strategy

The implementation should provide a clear packaging strategy using a mainstream Electron packaging pipeline.

The scaffold should support:

- development build;
- production build;
- platform-specific package;
- installer creation;
- artifact naming;
- code signing hooks;
- notarization hooks for macOS where applicable;
- update metadata hooks if auto-update is later enabled;
- reproducible build metadata;
- clean build output directory.

Example conceptual commands:

```bash
npm run build
npm run package
npm run make
npm run make -- --platform mac
npm run make -- --platform win32
npm run make -- --platform linux
```

### First-boot Python deployment

At first production boot, the app must:

1. locate the canonical app data directory for the host OS;
2. create a tidy ElectroPython runtime directory if missing;
3. copy or unpack bundled Python application sources into the runtime area if needed;
4. provision or validate the minimal Python runtime;
5. create or validate the virtual environment;
6. use `uv` to install or synchronize dependencies;
7. cache dependencies cleanly;
8. write logs to the canonical logs directory;
9. avoid modifying the signed/read-only application bundle;
10. start the Python backend quickly and reliably.

This process must be fast, observable, and recoverable.

If repair is needed, the user should see a clear runtime status rather than a silent failure.

### Production filesystem hygiene

The packaged app must keep the host OS tidy.

It must not scatter files across arbitrary locations.

It must document all files it writes.

It must separate:

- application bundle;
- runtime;
- virtual environment;
- package cache;
- logs;
- user state;
- diagnostics;
- temporary files.

### Production safety

A production build must never accidentally expose:

- development endpoints;
- unrestricted Python execution;
- unrestricted Node.js execution;
- unsafe bridge capabilities;
- hidden local servers reachable from the network;
- secrets in diagnostics;
- direct renderer access to Node.js.

---

## Logging and Diagnostics

The app must include structured logging across:

- Electron main process;
- preload bridge;
- renderer;
- application action layer;
- CLI adapter;
- runtime AI-agent API adapter;
- MCP adapter;
- Python backend;
- Node.js capability layer;
- Python <-> Node.js bridge;
- runtime installer;
- dependency repair system;
- dev API;
- packaging/first-boot deployment.

Logs should be visible in the canonical runtime logs directory and in the UI dev panel.

Diagnostics export should produce a bundle containing:

- app version;
- OS info;
- Electron version;
- Node.js version;
- Python version;
- package manager status;
- uv status;
- dependency status for Python and Node.js;
- runtime path summary;
- recent logs;
- config summary with secrets redacted;
- application action registry;
- Python API registry;
- Node.js API registry;
- bridge registry;
- stream registry;
- packaging/build metadata where available.

---

## Documentation Requirements

Write excellent documentation.

Required docs:

```text
docs/architecture.md
docs/getting-started.md
docs/actions.md
docs/cli.md
docs/agent-api.md
docs/mcp-server.md
docs/packaging.md
docs/runtime-paths.md
docs/python-api.md
docs/node-api.md
docs/python-node-bridge.md
docs/push-streams.md
docs/frontend-state.md
docs/design-mode.md
docs/component-system.md
docs/dev-api.md
docs/security.md
docs/ai-agent-guide.md
docs/upgrading.md
```

The documentation must teach users where to edit and where not to edit.

It must include examples for:

- adding an application action;
- exposing an action to UI;
- exposing an action to CLI;
- exposing an action to the runtime AI-agent API;
- exposing an action as an MCP tool;
- adding a Python API;
- adding a Python stream;
- adding a Node.js API;
- adding a Node.js stream;
- bridging Python and Node.js safely;
- adding a Svelte component;
- adding state;
- persisting state;
- adding a theme;
- running in Electron mode;
- running in web mode;
- running in CLI mode;
- packaging for production;
- debugging with the dev API.

---

## Code Quality Requirements

The whole codebase must be clean, boring, explicit, and maintainable.

Requirements:

- TypeScript strict mode;
- typed Python where practical;
- typed Node.js/TypeScript APIs;
- typed action schemas;
- docstrings for Python public APIs;
- comments only where they clarify architecture;
- no mysterious magic;
- no hidden global state;
- no duplicated protocol logic;
- clear error messages;
- small files;
- meaningful names;
- tests for critical paths;
- linting and formatting scripts;
- CI-friendly commands;
- packaging smoke tests where possible.

The code should be easy for a competent developer or AI agent to understand in one pass.

---

## Demo Application

The scaffold must include a demo app that proves the architecture.

The demo app must include:

1. Application action: `demo.greet`, exposed to UI, CLI, runtime AI-agent API, and MCP.
2. Python API: `greet(name: str) -> str`.
3. Python stream: `clock`, emitting the current time every second.
4. Node.js API: `systemInfo()`, returning platform and Node.js version.
5. Node.js stream: `heartbeat`, emitting a timestamp every second.
6. Bridge demo: Node.js calls a Python API, or Python calls a Node.js API, through the official bridge.
7. Svelte UI that calls application actions.
8. Svelte UI that shows Python and Node.js runtime status.
9. Svelte UI that subscribes to Python and Node.js streams.
10. CLI command that runs the same greeting action.
11. MCP tool that exposes the same greeting action.
12. Runtime AI-agent API endpoint that exposes the same greeting action.
13. Central state storing the name, greeting, clock value, Node heartbeat, runtime statuses, theme, and bridge status.
14. Persisted settings.
15. Design mode.
16. Component gallery.
17. Runtime health panel for Python, Node.js, actions, and the bridge.
18. Dev API explorer.
19. Optional Python console in development.
20. Packaging smoke test or documented packaging path.

The demo must be simple enough to understand but rich enough to serve as a real template.

---

## Acceptance Criteria

The project is successful only if:

- `npm install` works.
- `npm run dev` starts the Electron app.
- `npm run dev -- --web` or equivalent starts the web version.
- CLI mode can list actions.
- CLI mode can run at least one action.
- Runtime AI-agent API can list and run allowed actions.
- MCP server can expose at least one allowed action as a tool.
- Python runtime is provisioned or found automatically.
- `requirements.txt` dependencies are installed with `uv`.
- Missing Python dependencies are detected and repaired.
- Node.js dependency health is checked.
- Python API calls work through the application action layer.
- Node.js API calls work through the application action layer.
- Python push streams update reactive Svelte state.
- Node.js push streams update reactive Svelte state.
- The Python <-> Node.js bridge works through the documented protocol.
- The live Python clock updates once per second.
- The live Node.js heartbeat updates once per second.
- The app has dark and light themes.
- The UI uses Svelte 5, Tailwind, and shadcn-svelte.
- The central store is typed, reactive, persistent, inspectable, importable, and exportable.
- UI components are separate from app logic.
- Application actions are separate from low-level capabilities.
- App logic is separate from UI.
- Framework code is separate from user-editable code.
- Design mode exposes palette, typography, components, state, actions, Python APIs, Node.js APIs, bridge calls, streams, and logs.
- Dev API enables fast debugging of Python, Node.js, Svelte, Electron, CLI, MCP, action, and bridge behavior by humans and AI agents.
- Runtime AI-agent API exposes only allowed user actions.
- MCP server exposes only allowed user actions/resources/prompts.
- Dangerous dev features are disabled or protected in production.
- Packaging commands exist and are documented.
- A packaged app can deploy Python sources and provision its runtime on first boot.
- Runtime files are written only to documented canonical locations.
- Documentation clearly explains how to extend the scaffold.

---

## Architectural Decision Records

ElectroPython must include a lightweight decision-record system so future humans and AI agents understand why important choices were made.

Create:

```text
docs/decisions/
  0001-architecture-boundaries.md
  0002-python-runtime-strategy.md
  0003-api-action-and-stream-protocol.md
  0004-electron-vs-web-cli-agent-mcp-mode.md
  0005-application-action-layer.md
  0006-packaging-and-runtime-paths.md
```

Each decision record must contain:

- status: proposed, accepted, replaced, or deprecated;
- context;
- decision;
- consequences;
- alternatives considered;
- migration notes if the decision changes later.

Important architecture changes must add or update a decision record rather than silently modifying the scaffold.

---

## Upgrade and Compatibility Policy

ElectroPython should be modern, but not fragile.

The project must define an upgrade policy for:

- Python versions;
- Electron;
- Svelte;
- Tailwind;
- shadcn-svelte;
- Node.js;
- npm;
- uv;
- MCP protocol support;
- operating-system packaging behavior.

Dependency upgrades must preserve the public app structure unless a documented migration is provided.

The scaffold should include:

```text
docs/upgrading.md
docs/migrations/
```

When a breaking change is unavoidable, provide:

- what changed;
- why it changed;
- which files are affected;
- how user-editable code should migrate;
- how AI agents should detect and repair old layouts.

---

## Final Instruction to the Implementing Agent

Build ElectroPython as if it will become the canonical template for dual-brain Python + Node.js desktop, web, CLI, MCP, and AI-agent-ready applications.

Prefer clarity over cleverness.

Prefer application actions over scattered command logic.

Prefer explicit APIs and explicit bridges over hidden magic.

Prefer beautiful defaults over blank boilerplate.

Prefer safe architecture over quick hacks.

Prefer production packaging from day one over development-only demos.

The first generated app should immediately communicate:

> This is a serious foundation. I can build my real app on top of this.
