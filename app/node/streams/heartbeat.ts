import { nodeStream } from '../../../framework/node/api_server/registry';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function registerHeartbeatStream() {
  nodeStream('heartbeat', async function* () {
    while (true) {
      yield { now: new Date().toISOString() };
      await sleep(1000);
    }
  });
}
