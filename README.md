# ElectroPython Scaffold

ElectroPython is an opinionated scaffold for dual-brain Python + Node.js apps with a Svelte UI, Electron shell, web mode, CLI mode, runtime AI-agent API, and MCP server surface.

This archive is a project scaffold, not a fully installed app. After extracting it, run:

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run dev          # Electron desktop mode
npm run dev:web      # Web mode
npm run cli -- help  # CLI mode
npm run ai-api       # Restricted runtime AI-agent API
npm run mcp          # MCP server placeholder
npm run build        # Build frontend
npm run package      # Package desktop app
```

## Architectural rule

Application logic lives in `app/logic/actions/`.

Python and Node.js provide capabilities. The UI, CLI, Electron app, runtime AI-agent API, and MCP server call the same action registry.

```text
Svelte UI
CLI
Electron shell
Runtime AI-agent API
MCP server
  -> app/logic/actions
    -> Python capabilities
    -> Node.js capabilities
    -> explicit Python <-> Node bridge
```

## Safe edit zones

Edit these for your application:

```text
app/logic/actions/
app/python/
app/node/
app/ui/
requirements.txt
package.json
```

Avoid editing these unless changing the framework itself:

```text
framework/
.electropython/
```
