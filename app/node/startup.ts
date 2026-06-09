import { registerSystemInfoApi } from './apis/system-info';
import { registerHeartbeatStream } from './streams/heartbeat';

let registered = false;

export function registerNodeCapabilities() {
  if (registered) return;
  registered = true;
  registerSystemInfoApi();
  registerHeartbeatStream();
}
