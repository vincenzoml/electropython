import type { ActionDefinition } from './types';
import { callNodeApi } from '../../../framework/node/api_server/registry';
import { callPython } from '../../../framework/node/bridge/python-client';

export const demoActions: ActionDefinition[] = [
  {
    name: 'demo.greet',
    title: 'Greet user',
    description: 'Call the Python greet capability through the official action layer.',
    visibility: 'public',
    async handler(input: unknown) {
      const payload = typeof input === 'object' && input ? input as { name?: string } : {};
      return callPython<string>('greet', { name: payload.name ?? 'Ada' });
    }
  },
  {
    name: 'demo.systemInfo',
    title: 'System information',
    description: 'Call the Node.js systemInfo capability through the official action layer.',
    visibility: 'public',
    async handler() {
      return callNodeApi('systemInfo', {});
    }
  },
  {
    name: 'demo.bridgeProof',
    title: 'Bridge proof',
    description: 'Demonstrate an explicit cross-runtime call path.',
    visibility: 'agent',
    async handler(input: unknown, context) {
      return {
        source: context.source,
        pythonGreeting: await callPython<string>('greet', { name: 'Bridge' }),
        nodeInfo: await callNodeApi('systemInfo', {}),
        input
      };
    }
  }
];
