# Vendored uv

ElectroPython resolves `uv` in this order:

1. `vendor/uv/<platform>/uv` (or `uv.exe` on Windows) if present
2. Download uv `0.7.12` from the official GitHub release with SHA256 verification

Platform directories:

- `darwin-arm64`
- `darwin-x64`
- `linux-arm64`
- `linux-x64`
- `win32-arm64`
- `win32-x64`

Populate the current platform before packaging:

```bash
npm run bootstrap-uv
```

Packaging copies this tree into the signed app bundle as read-only resources. Mutable Python runtime, venv, cache, logs, and state live in OS app-data directories instead.
