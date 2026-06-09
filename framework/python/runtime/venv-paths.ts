import path from 'node:path';

export function venvPythonPath(venvDir: string): string {
  if (process.platform === 'win32') {
    return path.join(venvDir, 'Scripts', 'python.exe');
  }
  return path.join(venvDir, 'bin', 'python');
}
