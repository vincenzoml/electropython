import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { projectRoot, resourcesRoot } from './project-root';
import { runCommand } from './run-command';
import { UV_RELEASE_BASE, UV_VERSION } from './uv-manifest';
import { uvPlatformKey, uvPlatformManifest } from './uv-platform';
import { log } from '../../shared/logging/logger';

const VENDOR_DIR = 'vendor/uv';

export function vendorUvRoots(): string[] {
  const roots: string[] = [];
  const resources = resourcesRoot();
  if (resources) {
    roots.push(path.join(resources, VENDOR_DIR));
  }
  roots.push(path.join(projectRoot(), VENDOR_DIR));
  return roots;
}

export function vendoredUvBinaryPath(root: string, platform = uvPlatformKey()): string {
  const manifest = uvPlatformManifest();
  return path.join(root, platform, manifest.binaryName);
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function sha256File(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath);
  return createHash('sha256').update(data).digest('hex');
}

async function downloadFile(url: string, destination: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, bytes);
}

async function extractArchive(archivePath: string, destinationDir: string): Promise<void> {
  await fs.mkdir(destinationDir, { recursive: true });

  if (archivePath.endsWith('.tar.gz')) {
    const result = await runCommand('tar', ['-xzf', archivePath, '-C', destinationDir]);
    if (result.code !== 0) {
      throw new Error(`tar extraction failed: ${result.stderr || result.stdout}`);
    }
    return;
  }

  if (archivePath.endsWith('.zip')) {
    if (process.platform === 'win32') {
      const result = await runCommand('powershell', [
        '-NoProfile',
        '-Command',
        `Expand-Archive -Path '${archivePath.replace(/'/g, "''")}' -DestinationPath '${destinationDir.replace(/'/g, "''")}' -Force`
      ]);
      if (result.code !== 0) {
        throw new Error(`zip extraction failed: ${result.stderr || result.stdout}`);
      }
      return;
    }

    const result = await runCommand('unzip', ['-o', archivePath, '-d', destinationDir]);
    if (result.code !== 0) {
      throw new Error(`unzip extraction failed: ${result.stderr || result.stdout}`);
    }
  }
}

async function installUvFromArchive(cacheDir: string, installDir: string): Promise<string> {
  const platform = uvPlatformKey();
  const manifest = uvPlatformManifest();
  const archivePath = path.join(cacheDir, manifest.archive);
  const downloadUrl = `${UV_RELEASE_BASE}/${manifest.archive}`;

  if (!(await pathExists(archivePath))) {
    log('info', 'uv-launcher', `downloading uv ${UV_VERSION}`, { url: downloadUrl });
    await downloadFile(downloadUrl, archivePath);
  }

  const digest = await sha256File(archivePath);
  if (digest !== manifest.sha256) {
    await fs.rm(archivePath, { force: true });
    throw new Error(
      `uv archive SHA256 mismatch for ${manifest.archive}: expected ${manifest.sha256}, got ${digest}`
    );
  }

  const extractDir = path.join(cacheDir, 'extract', platform);
  await fs.rm(extractDir, { recursive: true, force: true });
  await extractArchive(archivePath, extractDir);

  const extractedBinary = path.join(extractDir, manifest.extractDir, manifest.binaryName);
  if (!(await pathExists(extractedBinary))) {
    throw new Error(`uv binary missing after extraction: ${extractedBinary}`);
  }

  const installedBinary = path.join(installDir, manifest.binaryName);
  await fs.mkdir(installDir, { recursive: true });
  await fs.copyFile(extractedBinary, installedBinary);
  if (process.platform !== 'win32') {
    await fs.chmod(installedBinary, 0o755);
  }

  log('info', 'uv-launcher', `installed uv ${UV_VERSION}`, { path: installedBinary });
  return installedBinary;
}

export async function resolveUvBinary(cacheDir?: string): Promise<string> {
  for (const root of vendorUvRoots()) {
    const candidate = vendoredUvBinaryPath(root);
    if (await pathExists(candidate)) {
      log('info', 'uv-launcher', 'using vendored uv', { path: candidate });
      return candidate;
    }
  }

  const platform = uvPlatformKey();
  const installRoot = path.join(projectRoot(), VENDOR_DIR, platform);
  const installed = path.join(installRoot, uvPlatformManifest().binaryName);
  if (await pathExists(installed)) {
    return installed;
  }

  const downloadCache = cacheDir ?? path.join(projectRoot(), '.electropython', 'cache', 'uv');
  await fs.mkdir(downloadCache, { recursive: true });
  return installUvFromArchive(downloadCache, installRoot);
}

export async function bootstrapUv(cacheDir?: string): Promise<string> {
  return resolveUvBinary(cacheDir);
}
