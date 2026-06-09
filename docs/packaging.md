# Packaging and Distribution

Production packaging must treat signed application resources as read-only.

Mutable runtime material goes into canonical app data locations:

- macOS: `~/Library/Application Support/ElectroPython/runtime`
- Windows: `%LOCALAPPDATA%/ElectroPython/runtime`
- Linux: `$XDG_DATA_HOME/ElectroPython/runtime` or `~/.local/share/ElectroPython/runtime`

Under that runtime root:

```text
python/   # uv-managed Python installs
venv/     # app virtual environment
cache/    # uv cache
logs/
state/
```

Development uses `.electropython/` with the same layout.

## uv launcher

ElectroPython never invokes a system `python`. It resolves `uv` in this order:

1. `vendor/uv/<platform>/uv` bundled in the app (or project tree during development)
2. Download uv `0.7.12` from the official GitHub release with SHA256 verification into `vendor/uv/<platform>/`

Platform keys: `darwin-arm64`, `darwin-x64`, `linux-arm64`, `linux-x64`, `win32-arm64`, `win32-x64`.

Before packaging for offline first boot, populate the target platform binary:

```bash
npm run bootstrap-uv
```

`npm run package` runs `bootstrap-uv` automatically, then copies `vendor/uv/**` into `extraResources`.

## First boot of a packaged app

1. Create runtime directories in OS app-data (`runtimePaths()` with `ELECTROPYTHON_PACKAGED=1` or `NODE_ENV=production`).
2. Resolve the bundled `uv` binary from `resources/vendor/uv/<platform>/`.
3. Run `uv python install 3.14` with `UV_PYTHON_INSTALL_DIR` pointing at app-data.
4. Create or repair the venv with `uv venv`.
5. Run `uv pip install -r requirements.txt --only-binary :all:` into that venv (pre-built wheels only; no Rust toolchain required).
6. Start uvicorn with the venv interpreter and `PYTHONPATH` set to the app root.
7. Verify Python, Node.js, bridge, and action health (`npm run doctor`).
8. Never expose dev APIs, unrestricted Python console, or unsafe bridge routes by default.

## Diagnostics

```bash
npm run doctor
```

Reports vendored uv status, runtime directories, venv Python version, requirement imports, and `/health` on ports 37620 (Python) and 37621 (Node).
