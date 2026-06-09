import { actionRegistry } from '../logic/actions/registry';
import { registerNodeCapabilities } from '../node/startup';

registerNodeCapabilities();

const [, , command, actionName, rawJson] = process.argv;

async function main() {
  if (!command || command === 'help') {
    console.log('ElectroPython CLI');
    console.log('Commands:');
    console.log('  list');
    console.log('  call <action> [json]');
    return;
  }

  if (command === 'list') {
    console.table(actionRegistry.listPublic());
    return;
  }

  if (command === 'call') {
    if (!actionName) throw new Error('Missing action name');
    const input = rawJson ? JSON.parse(rawJson) : {};
    const result = await actionRegistry.call(actionName, input, { source: 'cli' });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
