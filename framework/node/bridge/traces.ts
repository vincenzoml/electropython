export type BridgeTrace = {
  id: string;
  source: 'node' | 'python' | 'ui' | 'electron' | 'cli' | 'ai-api' | 'mcp';
  target: 'node' | 'python';
  name: string;
  status: 'started' | 'ok' | 'error';
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
  error?: string;
};

const MAX_TRACES = 200;
const traces: BridgeTrace[] = [];

export function startBridgeTrace(trace: Omit<BridgeTrace, 'id' | 'status' | 'startedAt'>) {
  const row: BridgeTrace = {
    ...trace,
    id: `bridge_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'started',
    startedAt: new Date().toISOString()
  };
  traces.push(row);
  if (traces.length > MAX_TRACES) traces.shift();
  return row.id;
}

export function finishBridgeTrace(id: string, status: 'ok' | 'error', error?: unknown) {
  const row = traces.find(item => item.id === id);
  if (!row) return;
  row.status = status;
  row.finishedAt = new Date().toISOString();
  row.durationMs = Date.parse(row.finishedAt) - Date.parse(row.startedAt);
  if (error) row.error = error instanceof Error ? error.message : String(error);
}

export function listBridgeTraces(limit = 100): BridgeTrace[] {
  return traces.slice(-limit).reverse();
}
