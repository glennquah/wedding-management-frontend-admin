import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';

const { encode } = createRequire(import.meta.url)('next-auth/jwt');

async function startPortal(app) {
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  const base = `http://127.0.0.1:${port}`;
  const secret = randomBytes(32).toString('base64');
  const child = spawn(process.execPath, [
    'node_modules/next/dist/bin/next', 'start', `apps/${app}`, '--hostname', '127.0.0.1', '--port', String(port),
  ], {
    env: { ...process.env, NEXTAUTH_URL: base, NEXTAUTH_SECRET: secret },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { output += chunk; });
  const stop = async () => {
    if (child.exitCode !== null) return;
    const exited = once(child, 'exit');
    child.kill('SIGTERM');
    const timer = setTimeout(() => child.kill('SIGKILL'), 5000);
    try { await exited; } finally { clearTimeout(timer); }
  };
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`${base}/api/auth/providers`, { signal: AbortSignal.timeout(1000) });
      if (response.ok) return { base, secret, stop };
    } catch { /* Wait for the production server to become ready. */ }
    if (child.exitCode !== null) break;
    await delay(250);
  }
  await stop();
  throw new Error(`${app} production server did not start. Run npm run build first.\n${output}`);
}

for (const [app, protectedPaths, rejectedRole] of [
  ['external', ['/admin', '/admin/guest-list', '/vendor', '/vendor/orders'], 'SUPERADMIN'],
  ['internal', ['/', '/admin-management', '/vendor-management'], 'ADMIN'],
]) {
  test(`${app} portal protects routes and keeps sign-in public`, { timeout: 45000 }, async () => {
    const portal = await startPortal(app);
    try {
      for (const path of protectedPaths) {
        const response = await fetch(`${portal.base}${path}`, { redirect: 'manual' });
        assert.equal(response.status, 307, `Anonymous access to ${app}${path}`);
        assert.equal(new URL(response.headers.get('location'), portal.base).pathname, '/login');
      }
      // A correctly signed session with the wrong role must also be rejected.
      const token = await encode({ secret: portal.secret, token: { role: rejectedRole } });
      const cookie = `next-auth.session-token-${app}=${token}`;
      const response = await fetch(`${portal.base}${protectedPaths[0]}`, {
        redirect: 'manual', headers: { cookie },
      });
      assert.equal(response.status, 307, `Wrong role admitted by ${app}`);
      assert.equal(new URL(response.headers.get('location'), portal.base).pathname, '/login');
      const allowedToken = await encode({
        secret: portal.secret,
        token: {
          id: '1', name: 'Local Smoke Test', email: 'smoke@example.invalid',
          role: app === 'external' ? 'ADMIN' : 'SUPERADMIN',
          backendTokens: {
            accessToken: 'local-only-placeholder', refreshToken: 'local-only-placeholder',
            expiresIn: Date.now() + 3600000,
          },
        },
      });
      const allowed = await fetch(`${portal.base}${protectedPaths[0]}`, {
        redirect: 'manual',
        headers: { cookie: `next-auth.session-token-${app}=${allowedToken}` },
      });
      assert.equal(allowed.status, 200, `Allowed role rejected by ${app}`);
      assert.equal((await fetch(`${portal.base}/login`)).status, 200);
      const providers = await fetch(`${portal.base}/api/auth/providers`);
      assert.equal(providers.status, 200);
      assert.ok((await providers.json()).credentials);
      if (app === 'external') assert.equal((await fetch(portal.base)).status, 200);
    } finally {
      await portal.stop();
    }
  });
}
