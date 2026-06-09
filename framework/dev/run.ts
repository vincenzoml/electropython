import { spawn } from 'node:child_process';
import { log } from '../shared/logging/logger';

const args = new Set(process.argv.slice(2));
const web = args.has('--web');
const electron = args.has('--electron') || !web;

function run(cmd: string, argv: string[]) {
  log('info', 'dev', `starting ${cmd} ${argv.join(' ')}`);
  return spawn(cmd, argv, { stdio: 'inherit', shell: process.platform === 'win32' });
}

log('info', 'dev', 'Python API uses vendored uv; no system python required');

run('npm', ['run', 'python-api']);
run('npm', ['run', 'ai-api']);
run('vite', ['--host', '127.0.0.1']);

if (electron) {
  setTimeout(() => run('electron', ['.']), 1200);
} else {
  log('info', 'dev', 'web mode is available at http://127.0.0.1:5173');
}
