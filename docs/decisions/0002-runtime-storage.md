# 0002 Runtime Storage

Status: accepted

## Decision

Development uses `.electropython/`. Production uses OS app data directories for mutable Python runtime, venv, cache, logs, and state.

The signed app bundle may include a read-only `vendor/uv/<platform>/uv` binary. ElectroPython provisions Python and the venv under app-data via that launcher; it never invokes a system `python`.
