export type NodeApiHandler<TIn = unknown, TOut = unknown> = (input: TIn) => Promise<TOut> | TOut;
export type NodeStreamHandler<TOut = unknown> = () => AsyncGenerator<TOut>;

const apis = new Map<string, NodeApiHandler>();
const streams = new Map<string, NodeStreamHandler>();

export function nodeApi<TIn = unknown, TOut = unknown>(name: string, handler: NodeApiHandler<TIn, TOut>) {
  if (apis.has(name)) throw new Error(`Node API already registered: ${name}`);
  apis.set(name, handler as NodeApiHandler);
}

export function nodeStream<TOut = unknown>(name: string, handler: NodeStreamHandler<TOut>) {
  if (streams.has(name)) throw new Error(`Node stream already registered: ${name}`);
  streams.set(name, handler as NodeStreamHandler);
}

export async function callNodeApi(name: string, input: unknown) {
  const handler = apis.get(name);
  if (!handler) throw new Error(`Unknown Node API: ${name}`);
  return handler(input);
}

export function listNodeApis() {
  return [...apis.keys()].sort();
}

export function listNodeStreams() {
  return [...streams.keys()].sort();
}
