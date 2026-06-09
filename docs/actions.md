# Application Actions

Application actions are the canonical user-level API of the app.

They are consumed by:

- Svelte UI;
- Electron shell;
- web mode;
- CLI mode;
- restricted runtime AI-agent API;
- MCP server;
- tests.

Python and Node.js capabilities are implementation details behind actions.

Add user-visible behavior in:

```text
app/logic/actions/
```

Use visibility levels:

- `public`: safe for UI, CLI, AI runtime API, and MCP;
- `agent`: safe for AI agents but not necessarily shown in the main UI;
- `developer`: dev/debug only, never production exposed.
