import { spawn } from 'node:child_process';
import { BOOTSTRAP_PTY_COLS, BOOTSTRAP_PTY_ROWS } from '../../runtime/bootstrap-terminal';
import { runCommand } from './run-command';

export type RunPtyOptions = {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  cols?: number;
  rows?: number;
  inherit?: boolean;
  onOutput?: (chunk: string) => void;
};

export type RunPtyResult = {
  code: number;
};

function ptyEnv(options: RunPtyOptions): Record<string, string> {
  const cols = String(options.cols ?? BOOTSTRAP_PTY_COLS);
  return {
    ...Object.fromEntries(
      Object.entries({ ...process.env, ...options.env }).filter(
        (entry): entry is [string, string] => entry[1] !== undefined
      )
    ),
    TERM: 'xterm-256color',
    FORCE_COLOR: '1',
    CLICOLOR_FORCE: '1',
    COLORTERM: 'truecolor',
    COLUMNS: cols
  };
}

async function runPtyNative(
  command: string,
  args: string[],
  options: RunPtyOptions
): Promise<RunPtyResult> {
  const pty = await import('node-pty');
  const env = ptyEnv(options);

  return new Promise((resolve, reject) => {
    const child = pty.spawn(command, args, {
      name: 'xterm-256color',
      cols: options.cols ?? BOOTSTRAP_PTY_COLS,
      rows: options.rows ?? BOOTSTRAP_PTY_ROWS,
      cwd: options.cwd,
      env
    });

    child.onData(data => {
      if (options.inherit !== false) {
        process.stdout.write(data);
      }
      options.onOutput?.(data);
    });

    child.onExit(({ exitCode }) => {
      resolve({ code: exitCode ?? 1 });
    });

    child.on('error', reject);
  });
}

function runPtyScript(
  command: string,
  args: string[],
  options: RunPtyOptions
): Promise<RunPtyResult> {
  const env = ptyEnv(options);
  const shellCommand = [command, ...args.map(arg => `'${arg.replace(/'/g, `'\\''`)}'`)].join(' ');

  return new Promise((resolve, reject) => {
    const child =
      process.platform === 'darwin'
        ? spawn('script', ['-q', '/dev/null', 'sh', '-lc', shellCommand], {
            cwd: options.cwd,
            env,
            stdio: ['ignore', 'pipe', 'pipe']
          })
        : spawn('script', ['-q', '-c', shellCommand, '/dev/null'], {
            cwd: options.cwd,
            env,
            stdio: ['ignore', 'pipe', 'pipe']
          });

    const handleChunk = (chunk: Buffer) => {
      const text = String(chunk);
      if (options.inherit !== false) {
        process.stdout.write(chunk);
      }
      options.onOutput?.(text);
    };

    child.stdout?.on('data', handleChunk);
    child.stderr?.on('data', handleChunk);
    child.on('error', reject);
    child.on('close', code => resolve({ code: code ?? 1 }));
  });
}

export async function runPty(
  command: string,
  args: string[],
  options: RunPtyOptions = {}
): Promise<RunPtyResult> {
  try {
    return await runPtyNative(command, args, options);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('posix_spawnp failed')) {
      try {
        return await runPtyScript(command, args, options);
      } catch {
        // fall through to plain spawn below
      }
    }

    const result = await runCommand(command, args, {
      cwd: options.cwd,
      env: ptyEnv(options),
      inherit: options.inherit,
      onOutput: options.onOutput
        ? (chunk, stream) => options.onOutput?.(chunk)
        : undefined
    });
    return { code: result.code };
  }
}
