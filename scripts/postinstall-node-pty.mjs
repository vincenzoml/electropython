import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const prebuilds = path.join(root, 'node_modules', 'node-pty', 'prebuilds');

if (!fs.existsSync(prebuilds)) {
  process.exit(0);
}

for (const platform of fs.readdirSync(prebuilds)) {
  const helper = path.join(prebuilds, platform, 'spawn-helper');
  if (fs.existsSync(helper)) {
    fs.chmodSync(helper, 0o755);
  }
}
