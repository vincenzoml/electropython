import { spawn } from 'node:child_process';
import { beginBootstrapSession, setBootstrapPhase } from '../../runtime/bootstrap-log';
import { ensurePythonRuntime } from './ensure-python';
import { projectRoot } from './project-root';
import { log } from '../../shared/logging/logger';

const HOST = process.env.ELECTROPYTHON_PYTHON_HOST ?? '127.0.0.1';
const PORT = process.env.ELECTROPYTHON_PYTHON_PORT ?? '37620';

async function main(): Promise<void> {
  await beginBootstrapSession('uv');
  const { venvPython } = await ensurePythonRuntime();
  const root = projectRoot();

  await setBootstrapPhase('server');
  log('info', 'python-api', 'starting uvicorn', { host: HOST, port: PORT, python: venvPython });

  const child = spawn(
    venvPython,
    [
      '-m',
      'uvicorn',
      'framework.python.api_server.server:app',
      '--host',
      HOST,
      '--port',
      PORT
    ],
    {
      cwd: root,
      stdio: 'inherit',
      env: {
        ...process.env,
        PYTHONPATH: root
      }
    }
  );

  child.on('exit', code => {
    process.exit(code ?? 1);
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
