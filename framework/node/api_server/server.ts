import http from 'node:http';
import { callNodeApi, listNodeApis, listNodeStreams } from './registry';
import { registerNodeCapabilities } from '../../../app/node/startup';
import { actionRegistry } from '../../../app/logic/actions/registry';
import { log, listLogs } from '../../shared/logging/logger';
import { listBridgeTraces } from '../bridge/traces';
import { handleBootstrapRoute } from '../../runtime/bootstrap-routes';

registerNodeCapabilities();

let lastDevStatePatch: unknown = undefined;

async function readJson(req: http.IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : undefined;
}

function setCors(res: http.ServerResponse) {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-methods', 'GET,POST,OPTIONS');
  res.setHeader('access-control-allow-headers', 'content-type');
}

function send(res: http.ServerResponse, status: number, payload: unknown) {
  setCors(res);
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(payload, null, 2));
}

async function pythonHealth(port = Number(process.env.ELECTROPYTHON_PYTHON_PORT ?? 37620)) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 700);
  try {
    const response = await fetch(`http://127.0.0.1:${port}/health`, { signal: controller.signal });
    if (!response.ok) return { ok: false, port, error: `${response.status} ${response.statusText}` };
    return { ok: true, port, ...(await response.json()) };
  } catch (error) {
    return { ok: false, port, error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

function nodeHealth(port: number) {
  return {
    ok: true,
    runtime: 'node',
    port,
    version: process.version,
    platform: process.platform,
    arch: process.arch,
    apis: listNodeApis(),
    streams: listNodeStreams()
  };
}

function componentRegistrySnapshot() {
  return {
    components: [
      { name: 'StatusCard', path: 'app/ui/components/StatusCard.svelte', kind: 'widget', status: 'ready' },
      { name: 'DesignMode', path: 'app/ui/design/DesignMode.svelte', kind: 'surface', status: 'ready' },
      { name: 'RuntimeHealthPanel', path: 'app/ui/design/DesignMode.svelte', kind: 'panel', status: 'template' },
      { name: 'ComponentGallery', path: 'app/ui/design/DesignMode.svelte', kind: 'panel', status: 'template' },
      { name: 'DevApiExplorer', path: 'app/ui/design/DesignMode.svelte', kind: 'panel', status: 'template' }
    ]
  };
}

function themeSnapshot() {
  return {
    tokens: [
      '--ep-bg', '--ep-surface', '--ep-card', '--ep-text', '--ep-muted',
      '--ep-accent', '--ep-accent-strong', '--ep-success', '--ep-warning', '--ep-danger'
    ],
    modes: ['light', 'dark', 'system'],
    source: 'app/ui/stores/app-state.svelte.ts'
  };
}

export function startNodeCapabilityServer(port = 37621) {
  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === 'OPTIONS') {
        setCors(res);
        res.writeHead(204);
        res.end();
        return;
      }

      const url = new URL(req.url ?? '/', 'http://127.0.0.1');

      if (await handleBootstrapRoute(req, res, url.pathname, url.searchParams)) {
        return;
      }

      if (req.method === 'GET' && url.pathname === '/health') {
        return send(res, 200, nodeHealth(port));
      }

      if (req.method === 'GET' && url.pathname === '/actions') {
        return send(res, 200, { actions: actionRegistry.listPublic() });
      }

      if (req.method === 'POST' && url.pathname.startsWith('/actions/')) {
        const name = decodeURIComponent(url.pathname.slice('/actions/'.length));
        const input = await readJson(req);
        return send(res, 200, { ok: true, result: await actionRegistry.call(name, input, { source: 'api' }) });
      }

      if (req.method === 'POST' && url.pathname.startsWith('/node/')) {
        const name = decodeURIComponent(url.pathname.slice('/node/'.length));
        return send(res, 200, { ok: true, result: await callNodeApi(name, await readJson(req)) });
      }

      if (req.method === 'GET' && url.pathname === '/__dev__/health') {
        const python = await pythonHealth();
        return send(res, 200, {
          ok: true,
          node: nodeHealth(port),
          python,
          bridge: { ok: true, recentCalls: listBridgeTraces(25) },
          environment: {
            cwd: process.cwd(),
            pid: process.pid,
            nodeEnv: process.env.NODE_ENV ?? 'development',
            platform: process.platform,
            arch: process.arch
          }
        });
      }

      if (req.method === 'GET' && url.pathname === '/__dev__/actions') {
        return send(res, 200, {
          ok: true,
          publicActions: actionRegistry.listPublic(),
          allActions: actionRegistry.listAll(),
          surfaces: ['ui', 'electron', 'cli', 'api', 'mcp']
        });
      }

      if (req.method === 'GET' && url.pathname === '/__dev__/apis') {
        const python = await pythonHealth();
        return send(res, 200, {
          ok: true,
          node: { apis: listNodeApis() },
          python: { ok: python.ok, apis: (python as { apis?: string[] }).apis ?? [], error: (python as { error?: string }).error }
        });
      }

      if (req.method === 'GET' && url.pathname === '/__dev__/streams') {
        const python = await pythonHealth();
        return send(res, 200, {
          ok: true,
          node: { streams: listNodeStreams() },
          python: { ok: python.ok, streams: (python as { streams?: string[] }).streams ?? [], error: (python as { error?: string }).error }
        });
      }

      if (req.method === 'GET' && url.pathname === '/__dev__/bridge') {
        return send(res, 200, {
          ok: true,
          policy: {
            hiddenBridgeCallsAllowed: false,
            tracing: true,
            visibleInDesignMode: true
          },
          recentCalls: listBridgeTraces()
        });
      }

      if (req.method === 'GET' && url.pathname === '/__dev__/state') {
        return send(res, 200, {
          ok: true,
          note: 'Renderer Svelte state is owned by the UI. This endpoint stores server-side dev patch probes only.',
          lastDevStatePatch
        });
      }

      if (req.method === 'POST' && url.pathname === '/__dev__/state/patch') {
        lastDevStatePatch = await readJson(req);
        log('info', 'dev-api', 'accepted state patch probe', lastDevStatePatch);
        return send(res, 200, { ok: true, accepted: true, lastDevStatePatch });
      }

      if (req.method === 'GET' && url.pathname === '/__dev__/components') {
        return send(res, 200, { ok: true, ...componentRegistrySnapshot() });
      }

      if (req.method === 'GET' && url.pathname === '/__dev__/theme') {
        return send(res, 200, { ok: true, ...themeSnapshot() });
      }

      if (req.method === 'GET' && url.pathname === '/__dev__/logs') {
        return send(res, 200, { ok: true, logs: listLogs() });
      }

      if (req.method === 'POST' && url.pathname === '/__dev__/self-test') {
        const python = await pythonHealth();
        return send(res, 200, {
          ok: python.ok,
          checks: [
            { name: 'node-api', ok: true },
            { name: 'python-api', ok: python.ok, details: python },
            { name: 'actions', ok: actionRegistry.listPublic().length > 0 },
            { name: 'bridge-tracing', ok: true }
          ]
        });
      }

      if (req.method === 'POST' && url.pathname === '/__dev__/diagnostics/export') {
        const python = await pythonHealth();
        return send(res, 200, {
          ok: true,
          exportedAt: new Date().toISOString(),
          health: { node: nodeHealth(port), python },
          actions: actionRegistry.listAll(),
          apis: { node: listNodeApis(), python: (python as { apis?: string[] }).apis ?? [] },
          streams: { node: listNodeStreams(), python: (python as { streams?: string[] }).streams ?? [] },
          bridge: listBridgeTraces(),
          logs: listLogs()
        });
      }

      return send(res, 404, { ok: false, error: 'not_found' });
    } catch (error) {
      log('error', 'node-api', 'request failed', error);
      return send(res, 500, { ok: false, error: error instanceof Error ? error.message : String(error) });
    }
  });

  server.listen(port, '127.0.0.1', () => {
    log('info', 'node-api', `listening on http://127.0.0.1:${port}`);
  });
  return server;
}
