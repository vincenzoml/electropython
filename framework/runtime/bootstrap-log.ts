import fs from 'node:fs/promises';
import path from 'node:path';
import { runtimePaths } from './paths';

export type BootstrapPhase = 'uv' | 'python' | 'venv' | 'pip' | 'server' | 'ready';
export type BootstrapStatus = 'idle' | 'running' | 'ready' | 'error';

export type BootstrapState = {
  status: BootstrapStatus;
  phase: BootstrapPhase;
  startedAt: string;
  updatedAt: string;
  error?: string;
};

const LOG_NAME = 'python-bootstrap.log';
const STATE_NAME = 'python-bootstrap.json';
const NODE_API = 'http://127.0.0.1:37621';

type ChunkListener = (chunk: string) => void;

const liveListeners = new Set<ChunkListener>();
let liveBuffer = '';

function logPath(root = runtimePaths().root) {
  return path.join(root, 'logs', LOG_NAME);
}

function statePath(root = runtimePaths().root) {
  return path.join(root, 'state', STATE_NAME);
}

export function subscribeBootstrapChunks(listener: ChunkListener): () => void {
  liveListeners.add(listener);
  return () => liveListeners.delete(listener);
}

export function readLiveBootstrapBuffer(): string {
  return liveBuffer;
}

export function resetLiveBootstrapBuffer(): void {
  liveBuffer = '';
}

async function notifyBootstrapReset(): Promise<void> {
  void fetch(`${NODE_API}/runtime/bootstrap/reset`, { method: 'POST' }).catch(() => undefined);
}

function emitLiveChunk(chunk: string): void {
  liveBuffer += chunk;
  for (const listener of liveListeners) {
    listener(chunk);
  }
}

export async function beginBootstrapSession(phase: BootstrapPhase = 'uv'): Promise<void> {
  const paths = runtimePaths();
  await fs.mkdir(paths.logs, { recursive: true });
  await fs.mkdir(paths.state, { recursive: true });
  await notifyBootstrapReset();

  const now = new Date().toISOString();
  const state: BootstrapState = {
    status: 'running',
    phase,
    startedAt: now,
    updatedAt: now
  };

  await fs.writeFile(logPath(paths.root), '', 'utf8');
  await fs.writeFile(statePath(paths.root), JSON.stringify(state, null, 2), 'utf8');
  await appendBootstrapLine(`[electropython] bootstrap started (${phase})`);
}

export async function setBootstrapPhase(phase: BootstrapPhase): Promise<void> {
  await updateBootstrapState({ phase });
  await appendBootstrapLine(`[electropython] phase: ${phase}`);
}

export async function setBootstrapReady(): Promise<void> {
  await updateBootstrapState({ status: 'ready', phase: 'ready' });
  await appendBootstrapLine('[electropython] bootstrap complete');
}

export async function setBootstrapError(error: string): Promise<void> {
  await updateBootstrapState({ status: 'error', error });
  await appendBootstrapLine(`[electropython] bootstrap failed: ${error}`);
}

async function updateBootstrapState(patch: Partial<BootstrapState>): Promise<void> {
  const paths = runtimePaths();
  const current = await readBootstrapState();
  const next: BootstrapState = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString()
  };
  await fs.mkdir(paths.state, { recursive: true });
  await fs.writeFile(statePath(paths.root), JSON.stringify(next, null, 2), 'utf8');
}

export async function readBootstrapState(): Promise<BootstrapState> {
  const paths = runtimePaths();
  try {
    const raw = await fs.readFile(statePath(paths.root), 'utf8');
    return JSON.parse(raw) as BootstrapState;
  } catch {
    return {
      status: 'idle',
      phase: 'uv',
      startedAt: '',
      updatedAt: ''
    };
  }
}

function postBootstrapChunk(text: string): void {
  void fetch(`${NODE_API}/runtime/bootstrap/chunk`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text })
  }).catch(() => undefined);
}

export async function appendBootstrapRaw(text: string): Promise<void> {
  if (!text) return;
  const paths = runtimePaths();
  await fs.mkdir(paths.logs, { recursive: true });
  await fs.appendFile(logPath(paths.root), text, 'utf8');
  postBootstrapChunk(text);
}

export function pushBootstrapChunk(text: string): void {
  if (!text) return;
  emitLiveChunk(text);
}

export async function appendBootstrapLine(text: string): Promise<void> {
  await appendBootstrapRaw(text.endsWith('\n') ? text : `${text}\n`);
}

export async function readBootstrapLog(offset = 0): Promise<{ text: string; offset: number }> {
  const paths = runtimePaths();
  try {
    const file = logPath(paths.root);
    const stat = await fs.stat(file);
    const start = Math.min(offset, stat.size);
    const handle = await fs.open(file, 'r');
    try {
      const length = stat.size - start;
      const buffer = Buffer.alloc(length);
      await handle.read(buffer, 0, length, start);
      return { text: buffer.toString('utf8'), offset: stat.size };
    } finally {
      await handle.close();
    }
  } catch {
    return { text: '', offset: 0 };
  }
}
