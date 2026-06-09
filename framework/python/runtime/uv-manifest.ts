export const UV_VERSION = '0.7.12';

export const UV_RELEASE_BASE = `https://github.com/astral-sh/uv/releases/download/${UV_VERSION}`;

export type UvPlatformKey =
  | 'darwin-arm64'
  | 'darwin-x64'
  | 'linux-arm64'
  | 'linux-x64'
  | 'win32-arm64'
  | 'win32-x64';

export type UvPlatformManifest = {
  archive: string;
  sha256: string;
  extractDir: string;
  binaryName: string;
};

export const UV_PLATFORMS: Record<UvPlatformKey, UvPlatformManifest> = {
  'darwin-arm64': {
    archive: 'uv-aarch64-apple-darwin.tar.gz',
    sha256: '189108cd026c25d40fb086eaaf320aac52c3f7aab63e185bac51305a1576fc7e',
    extractDir: 'uv-aarch64-apple-darwin',
    binaryName: 'uv'
  },
  'darwin-x64': {
    archive: 'uv-x86_64-apple-darwin.tar.gz',
    sha256: 'a338354420dba089218c05d4d585e4bcf174a65fe53260592b2af19ceec85835',
    extractDir: 'uv-x86_64-apple-darwin',
    binaryName: 'uv'
  },
  'linux-arm64': {
    archive: 'uv-aarch64-unknown-linux-gnu.tar.gz',
    sha256: '23233d2e950ed8187858350da5c6803b14cbbeaef780382093bb2f2bc4ba1200',
    extractDir: 'uv-aarch64-unknown-linux-gnu',
    binaryName: 'uv'
  },
  'linux-x64': {
    archive: 'uv-x86_64-unknown-linux-gnu.tar.gz',
    sha256: '735891fb553d0be129f3aa39dc8e9c4c49aaa76ec17f7dfb6a732e79a714873a',
    extractDir: 'uv-x86_64-unknown-linux-gnu',
    binaryName: 'uv'
  },
  'win32-arm64': {
    archive: 'uv-aarch64-pc-windows-msvc.zip',
    sha256: 'fbedfb71356d0e63c86b507cf1434a58406afe6eac77aee9d37b8282d4006e14',
    extractDir: 'uv-aarch64-pc-windows-msvc',
    binaryName: 'uv.exe'
  },
  'win32-x64': {
    archive: 'uv-x86_64-pc-windows-msvc.zip',
    sha256: '2cf29c8ffaa2549aa0f86927b2510008e8ca3dcd2100277d86faf437382a371b',
    extractDir: 'uv-x86_64-pc-windows-msvc',
    binaryName: 'uv.exe'
  }
};
