import { nodeApi } from '../../../framework/node/api_server/registry';

export function registerSystemInfoApi() {
  nodeApi('systemInfo', async () => ({
    platform: process.platform,
    arch: process.arch,
    node: process.version,
    cwd: process.cwd()
  }));
}
