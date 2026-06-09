import { bootstrapUv } from './uv-launcher';
import { log } from '../../shared/logging/logger';

async function main(): Promise<void> {
  const uv = await bootstrapUv();
  log('info', 'bootstrap-uv', 'uv ready', { path: uv });
  console.log(uv);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
