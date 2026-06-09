import { spawn } from 'node:child_process';

export type RunCommandOptions = {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  inherit?: boolean;
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
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', chunk => {
      stdout += String(chunk);
    });
    child.stderr?.on('data', chunk => {
      stderr += String(chunk);
    });

    child.on('error', reject);
    child.on('close', code => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}
