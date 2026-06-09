export async function callAction<TOut = unknown>(name: string, payload?: unknown): Promise<TOut> {
  const res = await fetch(`http://127.0.0.1:37621/actions/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload ?? {})
  });
  if (!res.ok) throw new Error(`Action failed: ${name}`);
  const body = await res.json();
  return body.result as TOut;
}
