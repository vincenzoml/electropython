export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogRow = {
  level: LogLevel;
  scope: string;
  message: string;
  details?: unknown;
  time: string;
};

const MAX_LOG_ROWS = 500;
const rows: LogRow[] = [];

export function log(level: LogLevel, scope: string, message: string, details?: unknown): void {
  const row: LogRow = {
    level,
    scope,
    message,
    details,
    time: new Date().toISOString()
  };
  rows.push(row);
  if (rows.length > MAX_LOG_ROWS) rows.shift();

  const line = JSON.stringify(row);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export function listLogs(limit = 200): LogRow[] {
  return rows.slice(-limit);
}

export function clearLogs(): void {
  rows.length = 0;
}
