import { finishBridgeTrace, startBridgeTrace } from './traces';
import { log } from '../../shared/logging/logger';

export async function callPython<TOut = unknown>(name: string, payload?: unknown, port = 37620): Promise<TOut> {
  const traceId = startBridgeTrace({ source: 'node', target: 'python', name });
  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/${encodeURIComponent(name)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ payload: payload ?? {} })
    });

    if (!res.ok) {
      throw new Error(`Python API ${name} failed: ${res.status}`);
    }

    const body = await res.json();
    finishBridgeTrace(traceId, 'ok');
    return body.result as TOut;
  } catch (error) {
    finishBridgeTrace(traceId, 'error', error);
    log('error', 'bridge', `Node -> Python call failed: ${name}`, error);
    throw error;
  }
}
