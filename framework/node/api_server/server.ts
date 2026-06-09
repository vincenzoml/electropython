import http from 'node:http';
import { callNodeApi, listNodeApis, listNodeStreams } from './registry';
import { registerNodeCapabilities } from '../../../app/node/startup';
import { actionRegistry } from '../../../app/logic/actions/registry';
import { handleBootstrapRoute } from '../../runtime/bootstrap-routes';
import { log } from '../../shared/logging/logger';

registerNodeCapabilities();

async function readJson(req: http.IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : undefined;
}

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type'
};

function send(res: http.ServerResponse, status: number, payload: unknown) {
  res.writeHead(status, { 'content-type': 'application/json', ...corsHeaders });
  res.end(JSON.stringify(payload, null, 2));
}

export function startNodeCapabilityServer(port = 37621) {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1');

      if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        res.end();
        return;
      }

      if (await handleBootstrapRoute(req, res, url.pathname, url.searchParams)) {
        return;
      }

      if (req.method === 'GET' && url.pathname === '/health') {
        return send(res, 200, { ok: true, runtime: 'node', apis: listNodeApis(), streams: listNodeStreams() });
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

      return send(res, 404, { ok: false, error: 'not_found' });
    } catch (error) {
      return send(res, 500, { ok: false, error: String(error) });
    }
  });

  server.listen(port, '127.0.0.1', () => {
    log('info', 'node-api', `listening on http://127.0.0.1:${port}`);
  });
  return server;
}
