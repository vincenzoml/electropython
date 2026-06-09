# Packaging and Distribution

Production packaging must treat signed application resources as read-only.

Mutable runtime material goes into canonical app data locations:

- macOS: `~/Library/Application Support/ElectroPython/runtime`
- Windows: `%LOCALAPPDATA%/ElectroPython/runtime`
- Linux: `$XDG_DATA_HOME/ElectroPython/runtime` or `~/.local/share/ElectroPython/runtime`

The first boot of a packaged app should:

1. create runtime directories;
2. provision or unpack minimal Python;
3. create or repair the app-local venv;
4. run `uv pip install -r requirements.txt` into that venv;
5. verify Python, Node.js, bridge, and action health;
6. never expose dev APIs, unrestricted Python console, or unsafe bridge routes by default.
