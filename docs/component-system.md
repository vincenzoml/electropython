# Component System

The component system is split into two layers:

1. `app/ui/components/` contains reusable application widgets.
2. `app/ui/design/` contains the design workshop, token registry, component registry, and preview surfaces.

Components should render state and emit intent. They should not own business logic.
Application behavior belongs in `app/logic/actions/` and capability-specific code belongs in `app/python/` or `app/node/`.

The initial registry is defined in `app/ui/design/design-system.ts` and surfaced by Design Mode.
