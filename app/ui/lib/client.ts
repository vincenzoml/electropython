export const NODE_API_BASE = 'http://127.0.0.1:37621';

async function readJsonResponse<TOut>(res: Response, label: string): Promise<TOut> {
  const body = await res.json().catch(() => ({})) as { error?: unknown; result?: unknown };
  if (!res.ok) {
    const error = typeof body.error === 'string' ? body.error : `${res.status} ${res.statusText}`;
    throw new Error(`${label} failed: ${error}`);
  }
  return (body.result ?? body) as TOut;
}

export async function callAction<TOut = unknown>(name: string, payload?: unknown): Promise<TOut> {
  const res = await fetch(`${NODE_API_BASE}/actions/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload ?? {})
  });
  return readJsonResponse<TOut>(res, `Action ${name}`);
}

export async function callNodeApi<TOut = unknown>(name: string, payload?: unknown): Promise<TOut> {
  const res = await fetch(`${NODE_API_BASE}/node/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload ?? {})
  });
  return readJsonResponse<TOut>(res, `Node API ${name}`);
}
