import { actionRegistry } from '../app/logic/actions/registry';

const actions = actionRegistry.listAll();
if (!actions.find(action => action.name === 'demo.greet')) {
  throw new Error('demo.greet action missing');
}
console.log(`Self-test ok: ${actions.length} actions registered.`);
