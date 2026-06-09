import type { ActionContext, ActionDefinition } from './types';
import { demoActions } from './demo.actions';

class ActionRegistry {
  private actions = new Map<string, ActionDefinition>();

  register(action: ActionDefinition) {
    if (this.actions.has(action.name)) throw new Error(`Action already registered: ${action.name}`);
    this.actions.set(action.name, action);
  }

  listPublic() {
    return [...this.actions.values()]
      .filter(action => action.visibility === 'public' || action.visibility === 'agent')
      .map(({ name, title, description, visibility }) => ({ name, title, description, visibility }));
  }

  listAll() {
    return [...this.actions.values()].map(({ name, title, description, visibility }) => ({ name, title, description, visibility }));
  }

  async call(name: string, input: unknown, context: ActionContext) {
    const action = this.actions.get(name);
    if (!action) throw new Error(`Unknown action: ${name}`);
    if (context.source === 'api' || context.source === 'mcp') {
      if (action.visibility === 'developer') throw new Error(`Action is developer-only: ${name}`);
    }
    return action.handler(input, context);
  }
}

export const actionRegistry = new ActionRegistry();

for (const action of demoActions) {
  actionRegistry.register(action);
}
