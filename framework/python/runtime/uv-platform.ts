import { UV_PLATFORMS, type UvPlatformKey } from './uv-manifest';

export function uvPlatformKey(): UvPlatformKey {
  const { platform, arch } = process;

  if (platform === 'darwin') {
    return arch === 'arm64' ? 'darwin-arm64' : 'darwin-x64';
  }
  if (platform === 'linux') {
    return arch === 'arm64' ? 'linux-arm64' : 'linux-x64';
  }
  if (platform === 'win32') {
    return arch === 'arm64' ? 'win32-arm64' : 'win32-x64';
  }

  throw new Error(`Unsupported platform for uv: ${platform}-${arch}`);
}

export function uvPlatformManifest() {
  return UV_PLATFORMS[uvPlatformKey()];
}
