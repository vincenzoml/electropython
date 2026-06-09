const DEFAULT_BASE_URL = 'http://127.0.0.1:37621';

export type DevApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export type DevSnapshot = {
  health: DevApiResult<unknown>;
  actions: DevApiResult<unknown>;
  apis: DevApiResult<unknown>;
  streams: DevApiResult<unknown>;
  bridge: DevApiResult<unknown>;
  components: DevApiResult<unknown>;
  theme: DevApiResult<unknown>;
  logs: DevApiResult<unknown>;
};

async function getJson<T>(path: string, baseUrl = DEFAULT_BASE_URL): Promise<DevApiResult<T>> {
  try {
    const response = await fetch(`${baseUrl}${path}`);
    if (!response.ok) return { ok: false, error: `${response.status} ${response.statusText}` };
    return { ok: true, data: await response.json() as T };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function postJson<T>(path: string, payload: unknown, baseUrl = DEFAULT_BASE_URL): Promise<DevApiResult<T>> {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload ?? {})
    });
    if (!response.ok) return { ok: false, error: `${response.status} ${response.statusText}` };
    return { ok: true, data: await response.json() as T };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function loadDevSnapshot(baseUrl = DEFAULT_BASE_URL): Promise<DevSnapshot> {
  const [health, actions, apis, streams, bridge, components, theme, logs] = await Promise.all([
    getJson('/__dev__/health', baseUrl),
    getJson('/__dev__/actions', baseUrl),
    getJson('/__dev__/apis', baseUrl),
    getJson('/__dev__/streams', baseUrl),
    getJson('/__dev__/bridge', baseUrl),
    getJson('/__dev__/components', baseUrl),
    getJson('/__dev__/theme', baseUrl),
    getJson('/__dev__/logs', baseUrl)
  ]);

  return { health, actions, apis, streams, bridge, components, theme, logs };
}

export async function callActionFromDesignMode(name: string, payload: unknown) {
  return postJson(`/actions/${encodeURIComponent(name)}`, payload);
}

export async function patchDevState(patch: unknown) {
  return postJson('/__dev__/state/patch', patch);
}
