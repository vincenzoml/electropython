import fs from 'node:fs/promises';
import path from 'node:path';
import {
  appendBootstrapLine,
  appendBootstrapRaw,
  setBootstrapError,
  setBootstrapPhase,
  setBootstrapReady
} from '../../runtime/bootstrap-log';
import { runtimePaths } from '../../runtime/paths';
import { loadConfig } from '../../shared/config/load-config';
import { log } from '../../shared/logging/logger';
import { projectRoot } from './project-root';
import { runPty } from './run-pty';
import { BOOTSTRAP_PTY_COLS, BOOTSTRAP_PTY_ROWS } from '../../runtime/bootstrap-terminal';
import { resolveUvBinary } from './uv-launcher';
import { venvPythonPath } from './venv-paths';

export type PythonRuntime = {
  uv: string;
  venvPython: string;
  paths: ReturnType<typeof runtimePaths>;
};

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function uvRuntimeEnv(paths: ReturnType<typeof runtimePaths>): NodeJS.ProcessEnv {
  return {
    ...process.env,
    UV_CACHE_DIR: paths.cache,
    UV_PYTHON_INSTALL_DIR: paths.python
  };
}

function emitBootstrapOutput(chunk: string): void {
  void appendBootstrapRaw(chunk);
}

async function runUv(
  uv: string,
  args: string[],
  env: NodeJS.ProcessEnv,
  phase: Parameters<typeof setBootstrapPhase>[0]
): Promise<void> {
  await setBootstrapPhase(phase);
  const result = await runPty(uv, args, {
    cwd: projectRoot(),
    env,
    inherit: true,
    cols: BOOTSTRAP_PTY_COLS,
    rows: BOOTSTRAP_PTY_ROWS,
    onOutput: emitBootstrapOutput
  });
  if (result.code !== 0) {
    throw new Error(`uv ${args.join(' ')} failed with exit code ${result.code}`);
  }
}

export async function ensurePythonRuntime(): Promise<PythonRuntime> {
  const config = loadConfig();
  const paths = runtimePaths();
  const root = projectRoot();

  try {
    await fs.mkdir(paths.root, { recursive: true });
    await fs.mkdir(paths.python, { recursive: true });
    await fs.mkdir(paths.venv, { recursive: true });
    await fs.mkdir(paths.cache, { recursive: true });
    await fs.mkdir(paths.logs, { recursive: true });
    await fs.mkdir(paths.state, { recursive: true });

    const uv = await resolveUvBinary(paths.cache);
    const env = uvRuntimeEnv(paths);
    const venvPython = venvPythonPath(paths.venv);
    const requirementsPath = path.resolve(root, config.python.requirements);

    log('info', 'python-runtime', `ensuring Python ${config.python.version}`, {
      root: paths.root,
      venv: paths.venv
    });

    await runUv(uv, ['python', 'install', config.python.version], env, 'python');

    if (!(await pathExists(venvPython))) {
      await runUv(uv, ['venv', paths.venv, '--python', config.python.version], env, 'venv');
    } else if (config.python.autoRepair) {
      await setBootstrapPhase('venv');
      await appendBootstrapLine(`[electropython] reusing existing venv at ${venvPython}`);
      log('info', 'python-runtime', 'reusing existing venv', { venvPython });
    }

    await runUv(
      uv,
      [
        'pip',
        'install',
        '-r',
        requirementsPath,
        '--python',
        venvPython,
        '--only-binary',
        ':all:'
      ],
      env,
      'pip'
    );

    await setBootstrapReady();
    log('info', 'python-runtime', 'Python runtime ready', { venvPython, uv });
    return { uv, venvPython, paths };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await setBootstrapError(message);
    throw error;
  }
}
