export async function callPython<TOut = unknown>(name: string, payload?: unknown, port = 37620): Promise<TOut> {
  const res = await fetch(`http://127.0.0.1:${port}/api/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload ?? {})
  });

  if (!res.ok) {
    throw new Error(`Python API ${name} failed: ${res.status}`);
  }

  const body = await res.json();
  return body.result as TOut;
}
