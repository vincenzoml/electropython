import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { runtimePaths } from '../../runtime/paths';
import { log } from '../../shared/logging/logger';

export async function ensurePythonRuntime(version: string): Promise<void> {
  const paths = runtimePaths();
  await fs.mkdir(paths.python, { recursive: true });
  await fs.mkdir(paths.venv, { recursive: true });
  await fs.mkdir(paths.cache, { recursive: true });
  log('info', 'python-runtime', `requested Python ${version}`);
  log('info', 'python-runtime', 'template expects uv to provision Python and install requirements on first boot');
}

export async function uvInstallRequirements(requirements = 'requirements.txt'): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn('uv', ['pip', 'install', '-r', requirements], {
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`uv failed with ${code}`)));
  });
}
