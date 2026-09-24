#!/usr/bin/env node
/* ==========================================================================
   PUBLISH THE SITE
   --------------------------------------------------------------------------
   Run this from the project folder. See the README for why it isn't
   "npm run deploy".

   Add --check to test everything without publishing anything.

   Before uploading, this checks that the services it depends on are actually
   reachable, and says plainly which one isn't. A failure here is almost never
   the website's fault -- it's usually antivirus, a VPN, or an expired key --
   and each of those needs a different fix, so guessing is expensive.
   ========================================================================== */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BACKSLASH = String.fromCharCode(92);
const SELF = '.' + BACKSLASH + 'deploy';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PROJECT = 'jack-friesen';
const ACCOUNT_ID = 'c74c31e381ffc1aea65576c4d55e8df7';
const TOKEN_FILE = join(homedir(), '.cloudflare-token');
const SITE_URL = 'https://jack-friesen.pages.dev';

/* Some antivirus products (Norton, on this machine) inspect encrypted traffic
   by substituting their own certificate. Node trusts its own built-in list and
   rejects that, which surfaces as a bare "fetch failed". Pointing Node at the
   Windows certificate store, where the antivirus root is already trusted,
   makes it work. Harmless when nothing is intercepting. */
const NORTON_CERT = 'C:/ProgramData/Norton/Antivirus/wscert.pem';

const checkOnly = process.argv.includes('--check');

const line = (s = '') => console.log(s);
const fail = (s = '') => console.error(s);

/* -------------------------------------------------------------------------- */
/* Cloudflare key                                                             */
/* -------------------------------------------------------------------------- */

function findToken() {
  const fromEnv = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (fromEnv) return { token: fromEnv, source: 'the CLOUDFLARE_API_TOKEN environment variable' };

  if (existsSync(TOKEN_FILE)) {
    const token = readFileSync(TOKEN_FILE, 'utf8').trim();
    if (token) return { token, source: TOKEN_FILE };
  }
  return null;
}

const found = findToken();

if (!found) {
  fail([
    '',
    "Can't publish: no Cloudflare key found.",
    '',
    'Looked in: ' + TOKEN_FILE,
    '',
    'That file holds the key that lets this computer publish the site. If it',
    'was moved or deleted, make a new one at:',
    '',
    '  https://dash.cloudflare.com/profile/api-tokens',
    '',
    'Create a Custom Token with this permission:',
    '',
    '  Account  >  Cloudflare Pages  >  Edit',
    '',
    'then paste it into that file as a single line and run this again.',
    '',
  ].join('\n'));
  process.exit(1);
}

/* -------------------------------------------------------------------------- */
/* Build tools                                                                */
/* -------------------------------------------------------------------------- */

const ASTRO = join(ROOT, 'node_modules', 'astro', 'astro.js');
const WRANGLER = join(ROOT, 'node_modules', 'wrangler', 'bin', 'wrangler.js');

const missingTools = [['astro', ASTRO], ['wrangler', WRANGLER]]
  .filter((entry) => !existsSync(entry[1]))
  .map((entry) => entry[0]);

if (missingTools.length) {
  fail(
    "\nCan't publish: " + missingTools.join(' and ') + ' not installed.\n\n' +
      'Run  npm.cmd install  first, then try again.\n',
  );
  process.exit(1);
}

/* -------------------------------------------------------------------------- */
/* Environment for the build and the upload                                   */
/* -------------------------------------------------------------------------- */

const env = {
  ...process.env,
  CLOUDFLARE_API_TOKEN: found.token,
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || ACCOUNT_ID,
};

if (!env.NODE_EXTRA_CA_CERTS && existsSync(NORTON_CERT)) {
  env.NODE_EXTRA_CA_CERTS = NORTON_CERT;
}

// Applies to every Node process this starts, including ones wrangler starts.
env.NODE_OPTIONS = [process.env.NODE_OPTIONS, '--use-system-ca'].filter(Boolean).join(' ');

/* -------------------------------------------------------------------------- */
/* Reachability                                                               */
/* -------------------------------------------------------------------------- */

function resumeDocId() {
  try {
    const config = readFileSync(join(ROOT, 'site.config.ts'), 'utf8');
    const match = config.match(/resumeDocId:\s*'([^']+)'/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function probe(label, url, init) {
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(20000) });

    // Release the socket. Leaving the body unread holds the connection open,
    // which delays exit and can trip a libuv assertion on Windows.
    if (res.body) await res.body.cancel();

    return { label, ok: true, status: res.status };
  } catch (error) {
    // "fetch failed" on its own says nothing; the real reason is in `cause`.
    const cause = error && error.cause ? error.cause.message || error.cause.code || '' : '';
    return { label, ok: false, message: error ? error.message : String(error), cause };
  }
}

async function preflight() {
  const docId = resumeDocId();

  const checks = [
    probe('Cloudflare (publishing)', 'https://api.cloudflare.com/client/v4/user/tokens/verify', {
      headers: { authorization: 'Bearer ' + found.token },
    }),
  ];

  if (docId) {
    checks.push(
      probe(
        'Google Docs (your resume)',
        'https://docs.google.com/document/d/' + docId + '/export?format=html',
      ),
    );
  }

  const results = await Promise.all(checks);

  for (const result of results) {
    line('  ' + result.label.padEnd(26) + (result.ok ? 'reachable' : 'UNREACHABLE'));
  }

  const unreachable = results.filter((r) => !r.ok);
  const cloudflare = results.find((r) => r.label.indexOf('Cloudflare') === 0);

  if (unreachable.length) {
    fail('');
    fail("Can't reach the internet services this needs.");
    fail('');
    for (const r of unreachable) {
      fail('  ' + r.label);
      fail('    ' + r.message + (r.cause ? '  (' + r.cause + ')' : ''));
    }
    fail('');
    fail('Switching Wi-Fi networks will not help if the cause is on this');
    fail('computer. The usual suspects, most likely first:');
    fail('');
    fail('  1. Antivirus inspecting encrypted traffic. Norton is installed');
    fail('     here. Turn its HTTPS / web scanning off briefly and try again.');
    fail('     A certificate complaint above points squarely at this.');
    fail('  2. A VPN or campus network blocking the connection.');
    fail('  3. Genuinely offline.');
    fail('');
    fail('If none of that fixes it, paste the lines above to Claude.');
    return false;
  }

  // The key itself may be expired or revoked. That looks nothing like a network
  // problem, but it stops the upload just the same.
  if (cloudflare && cloudflare.status !== 200) {
    fail('');
    fail('Cloudflare rejected the key (HTTP ' + cloudflare.status + ').');
    fail('');
    fail('The key is no longer valid. It came from:');
    fail('  ' + found.source);
    fail('');
    fail('Make a new one at https://dash.cloudflare.com/profile/api-tokens');
    fail('with  Account > Cloudflare Pages > Edit,  then paste it into that');
    fail('file as a single line.');
    fail('');
    return false;
  }

  return true;
}

/* -------------------------------------------------------------------------- */
/* Run                                                                        */
/* -------------------------------------------------------------------------- */

function run(label, args) {
  line('\n' + label);
  const result = spawnSync(process.execPath, args, { cwd: ROOT, env, stdio: 'inherit' });

  if (result.status !== 0) {
    fail('\n' + label + ' failed. Nothing was published.\n');
    process.exit(result.status === null ? 1 : result.status);
  }
}

line('\nChecking connections...');

const ready = await preflight();

/* Past this point the process must be allowed to end on its own. Calling
   process.exit() here, with network handles still closing, trips a libuv
   assertion on Windows and reports a crash after a run that actually
   succeeded. Setting exitCode lets Node shut down cleanly instead. */
if (!ready) {
  process.exitCode = 1;
} else if (checkOnly) {
  line('');
  line('Ready to publish.');
  line('');
  line('  Cloudflare key   valid, from ' + found.source);
  line('  Project          ' + PROJECT);
  line('  Build tools      astro and wrangler both installed');
  line('');
  line('Run  ' + SELF + '  to publish for real.');
  line('');
} else {
  run('Building the site...', [ASTRO, 'build']);
  run('Uploading to Cloudflare...', [
    WRANGLER, 'pages', 'deploy', 'dist', '--project-name', PROJECT,
  ]);

  line('\nPublished. ' + SITE_URL);
  line('Changes are usually live within a few seconds.\n');
}
