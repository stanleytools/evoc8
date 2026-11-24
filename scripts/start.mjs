// Starts the shop, unless it is already running in another terminal.
// Not part of any exercise.
import { spawn } from 'node:child_process';

const addresses = ['http://127.0.0.1:5173/', 'http://[::1]:5173/'];

async function answers(address) {
  try {
    await fetch(address, { signal: AbortSignal.timeout(1500) });
    return true;
  } catch {
    return false;
  }
}

async function alreadyRunning() {
  const results = await Promise.all(addresses.map(answers));
  return results.some(Boolean);
}

if (await alreadyRunning()) {
  console.log('\nThe shop is already running.');
  console.log('To see it, open the Ports panel and click the globe icon next to "Storefront".\n');
  process.exit(0);
}

const server = spawn('npx', ['vite'], { stdio: 'inherit' });
server.on('exit', (code) => process.exit(code ?? 0));
