import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';

const HOST = '0.0.0.0';
const PORT = 4321;
const TARGET_URL = `http://127.0.0.1:${PORT}/merchbase-co/`;
const OUTPUT_DIR = path.resolve('artifacts');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'merchbase-dev.png');

async function waitForServer(url: string, timeoutMs = 60_000, pollIntervalMs = 500) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.ok || (response.status >= 300 && response.status < 400)) {
        return;
      }
    } catch (error) {
      // Server not ready yet, continue polling.
    }
    await delay(pollIntervalMs);
  }
  throw new Error(`Timed out after ${timeoutMs}ms waiting for ${url}`);
}

async function stopProcess(child: ReturnType<typeof spawn>) {
  if (child.killed) {
    return;
  }

  child.kill();
  try {
    await once(child, 'exit');
  } catch {
    // ignore if the process has already exited
  }
}

async function main() {
  const devServer = spawn(
    'astro',
    ['dev', '--host', HOST, '--port', String(PORT)],
    {
      env: { ...process.env },
      stdio: 'inherit',
    },
  );

  let shuttingDown = false;
  const handleShutdown = async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    await stopProcess(devServer);
  };

  process.once('SIGINT', () => {
    handleShutdown().finally(() => process.exit(130));
  });
  process.once('SIGTERM', () => {
    handleShutdown().finally(() => process.exit(143));
  });

  const exitWatcher = (async () => {
    const [code, signal] = await once(devServer, 'exit');
    throw new Error(
      `Astro dev exited before the screenshot was captured (code: ${code}, signal: ${signal ?? 'none'})`,
    );
  })();

  try {
    await Promise.race([waitForServer(TARGET_URL), exitWatcher]);

    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
      await mkdir(OUTPUT_DIR, { recursive: true });
      await page.screenshot({ path: OUTPUT_PATH, fullPage: true });
      console.log(`Screenshot saved to ${OUTPUT_PATH}`);
    } finally {
      await browser.close();
    }
  } finally {
    await handleShutdown();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
