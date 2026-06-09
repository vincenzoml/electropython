import fs from 'node:fs/promises';
import path from 'node:path';
import { runtimePaths } from '../../runtime/paths';
import { loadConfig } from '../../shared/config/load-config';
import { projectRoot } from './project-root';
import { runCommand } from './run-command';
import { resolveUvBinary, vendoredUvBinaryPath, vendorUvRoots } from './uv-launcher';
import { UV_VERSION } from './uv-manifest';
import { uvPlatformKey } from './uv-platform';
import { venvPythonPath } from './venv-paths';

type CheckResult = {
  name: string;
  ok: boolean;
  detail: string;
};

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function checkUv(): Promise<CheckResult> {
  try {
    const uv = await resolveUvBinary(runtimePaths().cache);
    const result = await runCommand(uv, ['--version'], { inherit: false });
    const detail = result.stdout.trim() || result.stderr.trim() || uv;
    return {
      name: 'uv',
      ok: result.code === 0,
      detail
    };
  } catch (error) {
    return {
      name: 'uv',
      ok: false,
      detail: error instanceof Error ? error.message : String(error)
    };
  }
}

async function checkVendoredUv(): Promise<CheckResult> {
  const platform = uvPlatformKey();
  for (const root of vendorUvRoots()) {
    const candidate = vendoredUvBinaryPath(root, platform);
    if (await pathExists(candidate)) {
      return { name: 'vendored-uv', ok: true, detail: candidate };
    }
  }
  return {
    name: 'vendored-uv',
    ok: true,
    detail: `not bundled; will download uv ${UV_VERSION} on first use`
  };
}

async function checkRuntimeDirs(): Promise<CheckResult> {
  const paths = runtimePaths();
  const missing: string[] = [];
  for (const [name, dir] of Object.entries(paths)) {
    if (!(await pathExists(dir))) {
      missing.push(`${name}=${dir}`);
    }
  }
  return {
    name: 'runtime-dirs',
    ok: missing.length === 0,
    detail: missing.length === 0 ? paths.root : `missing: ${missing.join(', ')}`
  };
}

async function checkVenv(): Promise<CheckResult> {
  const paths = runtimePaths();
  const venvPython = venvPythonPath(paths.venv);
  if (!(await pathExists(venvPython))) {
    return {
      name: 'venv',
      ok: false,
      detail: `venv python not found at ${venvPython}; run npm run python-api or npm run dev`
    };
  }

  const result = await runCommand(venvPython, ['--version'], { inherit: false });
  return {
    name: 'venv',
    ok: result.code === 0,
    detail: (result.stdout || result.stderr).trim()
  };
}

async function checkConfiguredPython(): Promise<CheckResult> {
  const config = loadConfig();
  const paths = runtimePaths();
  const venvPython = venvPythonPath(paths.venv);
  if (!(await pathExists(venvPython))) {
    return {
      name: 'python-version',
      ok: false,
      detail: `configured ${config.python.version}; venv not provisioned yet`
    };
  }

  const result = await runCommand(
    venvPython,
    ['-c', 'import sys; print(".".join(map(str, sys.version_info[:2])))'],
    { inherit: false }
  );
  const version = result.stdout.trim();
  const ok = version === config.python.version || version.startsWith(`${config.python.version}.`);
  return {
    name: 'python-version',
    ok,
    detail: ok ? version : `expected ${config.python.version}, found ${version || 'unknown'}`
  };
}

async function checkRequirements(): Promise<CheckResult> {
  const config = loadConfig();
  const requirementsPath = path.resolve(projectRoot(), config.python.requirements);
  if (!(await pathExists(requirementsPath))) {
    return {
      name: 'requirements',
      ok: false,
      detail: `missing ${requirementsPath}`
    };
  }

  const paths = runtimePaths();
  const venvPython = venvPythonPath(paths.venv);
  if (!(await pathExists(venvPython))) {
    return {
      name: 'requirements',
      ok: false,
      detail: `${config.python.requirements} present; venv not provisioned`
    };
  }

  const result = await runCommand(
    venvPython,
    ['-c', 'import fastapi, uvicorn, pydantic; print("ok")'],
    { inherit: false }
  );
  return {
    name: 'requirements',
    ok: result.code === 0,
    detail: result.code === 0 ? config.python.requirements : result.stderr.trim() || 'imports failed'
  };
}

async function checkHealth(port: number, label: string): Promise<CheckResult> {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(1500) });
    const body = await response.text();
    return {
      name: label,
      ok: response.ok,
      detail: response.ok ? body : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      name: label,
      ok: false,
      detail: error instanceof Error ? error.message : String(error)
    };
  }
}

async function main(): Promise<void> {
  const paths = runtimePaths();
  const config = loadConfig();

  console.log('ElectroPython doctor');
  console.log(`project: ${projectRoot()}`);
  console.log(`runtime: ${paths.root}`);
  console.log(`configured Python: ${config.python.version}`);
  console.log(`uv pin: ${UV_VERSION}`);
  console.log('');

  const checks = await Promise.all([
    checkVendoredUv(),
    checkUv(),
    checkRuntimeDirs(),
    checkVenv(),
    checkConfiguredPython(),
    checkRequirements(),
    checkHealth(37620, 'python-api'),
    checkHealth(37621, 'node-api')
  ]);

  let failed = 0;
  for (const check of checks) {
    const status = check.ok ? 'ok' : 'FAIL';
    console.log(`[${status}] ${check.name}: ${check.detail}`);
    if (!check.ok) failed += 1;
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
