export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export function log(level: LogLevel, scope: string, message: string, details?: unknown): void {
  const row = {
    level,
    scope,
    message,
    details,
    time: new Date().toISOString()
  };
  const line = JSON.stringify(row);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}
