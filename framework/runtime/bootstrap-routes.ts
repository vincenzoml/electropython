import type http from 'node:http';
import {
  pushBootstrapChunk,
  readBootstrapLog,
  readBootstrapState,
  readLiveBootstrapBuffer,
  resetLiveBootstrapBuffer,
  subscribeBootstrapChunks
} from './bootstrap-log';

function sendJson(res: http.ServerResponse, status: number, payload: unknown) {
  res.writeHead(status, {
    'content-type': 'application/json',
    'access-control-allow-origin': '*'
  });
  res.end(JSON.stringify(payload, null, 2));
}

async function readJson(req: http.IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : undefined;
}

export async function handleBootstrapRoute(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  pathname: string,
  searchParams: URLSearchParams
): Promise<boolean> {
  if (req.method === 'GET' && pathname === '/runtime/bootstrap/state') {
    sendJson(res, 200, await readBootstrapState());
    return true;
  }

  if (req.method === 'GET' && pathname === '/runtime/bootstrap/log') {
    const offset = Number(searchParams.get('offset') ?? '0');
    const log = await readBootstrapLog(Number.isFinite(offset) ? offset : 0);
    sendJson(res, 200, log);
    return true;
  }

  if (req.method === 'POST' && pathname === '/runtime/bootstrap/reset') {
    resetLiveBootstrapBuffer();
    res.writeHead(204, { 'access-control-allow-origin': '*' });
    res.end();
    return true;
  }

  if (req.method === 'POST' && pathname === '/runtime/bootstrap/chunk') {
    const body = (await readJson(req)) as { text?: string };
    if (body.text) {
      pushBootstrapChunk(body.text);
    }
    sendJson(res, 202, { ok: true });
    return true;
  }

  if (req.method === 'GET' && pathname === '/runtime/bootstrap/stream') {
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
      'access-control-allow-origin': '*'
    });

    let closed = false;
    req.on('close', () => {
      closed = true;
    });

    const backlog = readLiveBootstrapBuffer();
    if (backlog) {
      res.write(`event: log\ndata: ${JSON.stringify(backlog)}\n\n`);
    } else {
      const initial = await readBootstrapLog(0);
      if (initial.text) {
        res.write(`event: log\ndata: ${JSON.stringify(initial.text)}\n\n`);
      }
    }

    const unsubscribe = subscribeBootstrapChunks(chunk => {
      if (closed) return;
      res.write(`event: log\ndata: ${JSON.stringify(chunk)}\n\n`);
    });

    const pushState = async () => {
      if (closed) return;
      const state = await readBootstrapState();
      res.write(`event: state\ndata: ${JSON.stringify(state)}\n\n`);
      if (state.status === 'ready' || state.status === 'error') {
        res.write(`event: done\ndata: ${JSON.stringify({ status: state.status })}\n\n`);
        unsubscribe();
        res.end();
        return;
      }
      setTimeout(() => {
        void pushState();
      }, 400);
    };

    void pushState();
    return true;
  }

  return false;
}
