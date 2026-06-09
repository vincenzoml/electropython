import path from 'node:path';
import { fileURLToPath } from 'node:url';

const runtimeDir = path.dirname(fileURLToPath(import.meta.url));

export function projectRoot(): string {
  if (process.env.ELECTROPYTHON_PROJECT_ROOT) {
    return path.resolve(process.env.ELECTROPYTHON_PROJECT_ROOT);
  }
  return path.resolve(runtimeDir, '../../..');
}

export function resourcesRoot(): string | undefined {
  if (process.env.ELECTROPYTHON_RESOURCES) {
    return path.resolve(process.env.ELECTROPYTHON_RESOURCES);
  }
  const resourcesPath = (process as NodeJS.Process & { resourcesPath?: string }).resourcesPath;
  return resourcesPath ? path.resolve(resourcesPath) : undefined;
}
