export type ActionVisibility = 'public' | 'agent' | 'developer';
export type ActionSource = 'ui' | 'cli' | 'api' | 'mcp' | 'electron' | 'test';

export type ActionContext = {
  source: ActionSource;
  userIntent?: string;
  traceId?: string;
};

export type ActionDefinition<TIn = unknown, TOut = unknown> = {
  name: string;
  title: string;
  description: string;
  visibility: ActionVisibility;
  inputSchema?: unknown;
  outputSchema?: unknown;
  handler: (input: TIn, context: ActionContext) => Promise<TOut> | TOut;
};
