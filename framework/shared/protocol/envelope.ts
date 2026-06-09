export type RuntimeName = 'ui' | 'electron' | 'node' | 'python' | 'cli' | 'ai-api' | 'mcp';

export type CapabilityEnvelope<TPayload = unknown> = {
  id: string;
  kind: 'call' | 'response' | 'stream' | 'error' | 'cancel' | 'health';
  source: RuntimeName;
  target: RuntimeName;
  name: string;
  payload?: TPayload;
  timestamp: string;
  correlationId?: string;
  timeoutMs?: number;
};

export type CapabilityError = {
  code: string;
  message: string;
  details?: unknown;
  retryable?: boolean;
};

export type CapabilityResponse<TPayload = unknown> = CapabilityEnvelope<TPayload> & {
  kind: 'response';
};

export function makeId(prefix = 'cap'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
