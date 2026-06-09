# Design Mode

Design Mode is the scaffold's local design-system and architecture workshop. It is not a JSON dump.

It exposes these panels:

- Overview: runtime health, action surfaces, icon language.
- Theme: live CSS-variable editor, typography, theme preset import/export.
- Components: component registry and preview surface.
- State: safe local editors, persisted settings, state import/export.
- Actions & APIs: user action registry, Python API registry, Node API registry, safe action probes.
- Streams & Bridge: stream registries and explicit bridge traces.
- Logs: local operational log buffer.
- Guidance: where AI agents and humans should edit.

Design Mode talks to the Node capability server through `/__dev__/...` endpoints on `127.0.0.1:37621`.
Renderer-owned Svelte state remains local to the UI; server-side state patching is intentionally a probe/diagnostic path, not hidden mutation.

Production builds must disable or protect unrestricted dev endpoints.
