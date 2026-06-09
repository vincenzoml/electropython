import { spawn } from 'node:child_process';

export type RunCommandOptions = {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  inherit?: boolean;
  onOutput?: (chunk: string, stream: 'stdout' | 'stderr') => void;
};

export type RunCommandResult = {
  code: number;
  stdout: string;
  stderr: string;
};

export function runCommand(
  command: string,
  args: string[],
  options: RunCommandOptions = {}
): Promise<RunCommandResult> {
  return new Promise((resolve, reject) => {
    const inherit = options.inherit ?? false;
    const onOutput = options.onOutput;
    const pipe = Boolean(onOutput);
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: pipe ? ['ignore', 'pipe', 'pipe'] : inherit ? 'inherit' : ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    const handleChunk = (chunk: Buffer, stream: 'stdout' | 'stderr') => {
      const text = String(chunk);
      if (stream === 'stdout') stdout += text;
      else stderr += text;
      if (inherit) {
        (stream === 'stdout' ? process.stdout : process.stderr).write(chunk);
      }
      onOutput?.(text, stream);
    };

    child.stdout?.on('data', chunk => handleChunk(Buffer.from(chunk), 'stdout'));
    child.stderr?.on('data', chunk => handleChunk(Buffer.from(chunk), 'stderr'));

    child.on('error', reject);
    child.on('close', code => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}
