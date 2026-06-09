# 0001 Architecture Boundaries

Status: accepted

## Context

ElectroPython has Python, Node.js, Electron, Svelte, CLI, AI API, and MCP surfaces.

## Decision

The application action layer defines user-level operations. Python and Node.js provide capabilities behind actions.

## Consequences

All surfaces can be consistent, testable, observable, and permissioned.
