import os from 'node:os';
import path from 'node:path';

export function runtimeRoot(appName = 'ElectroPython', production = process.env.NODE_ENV === 'production'): string {
  if (!production) return path.resolve('.electropython');

  if (process.platform === 'win32') {
    return path.join(process.env.LOCALAPPDATA ?? os.homedir(), appName, 'runtime');
  }
  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', appName, 'runtime');
  }
  return path.join(process.env.XDG_DATA_HOME ?? path.join(os.homedir(), '.local', 'share'), appName, 'runtime');
}

export function runtimePaths(root = runtimeRoot()) {
  return {
    root,
    python: path.join(root, 'python'),
    venv: path.join(root, 'venv'),
    cache: path.join(root, 'cache'),
    logs: path.join(root, 'logs'),
    state: path.join(root, 'state')
  };
}
