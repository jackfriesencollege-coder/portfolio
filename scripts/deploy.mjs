#!/usr/bin/env node
/* ==========================================================================
   PUBLISH THE SITE
   --------------------------------------------------------------------------
   Run this with:  npm run deploy

   It builds the site and uploads it to Cloudflare Pages.

   Cloudflare needs a key to prove the upload is really from you. That key
   lives in a file in your home folder, kept deliberately outside this project
   so it can never be committed to GitHub by accident. This script reads it and
   hands it to Cloudflare, which is why you are never asked to log in.

   Node is invoked directly rather than through the astro/wrangler shortcuts,
   because those break on Windows paths containing spaces.

   Run  npm run deploy -- --check  to confirm everything is set up without
   actually publishing.
   ========================================================================== */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PROJECT = 'jack-friesen';
const ACCOUNT_ID = 'c74c31e381ffc1aea65576c4d55e8df7';
const TOKEN_FILE = join(homedir(), '.cloudflare-token');
const SITE_URL = 'https://jack-friesen.pages.dev';

const checkOnly = process.argv.includes('--check');

/** Environment wins, so a token can still be supplied by hand when needed. */
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
  console.error([
    '',
    "Can't publish: no Cloudflare key found.",
    '',
    `Looked in: ${TOKEN_FILE}`,
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

const tools = [
  ['astro', join(ROOT, 'node_modules', 'astro', 'astro.js')],
  ['wrangler', join(ROOT, 'node_modules', 'wrangler', 'bin', 'wrangler.js')],
];
const missing = tools.filter(([, path]) => !existsSync(path)).map(([name]) => name);

if (missing.length) {
  console.error(
    `\nCan't publish: ${missing.join(' and ')} not installed.\n\n` +
      'Run  npm install  first, then try again.\n',
  );
  process.exit(1);
}

if (checkOnly) {
  console.log([
    '',
    'Ready to publish.',
    '',
    `  Cloudflare key   found in ${found.source}`,
    `  Project          ${PROJECT}`,
    '  Build tools      astro and wrangler both installed',
    '',
    'Run  npm run deploy  to publish for real.',
    '',
  ].join('\n'));
  process.exit(0);
}

const env = {
  ...process.env,
  CLOUDFLARE_API_TOKEN: found.token,
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || ACCOUNT_ID,
};

function run(label, args) {
  console.log(`\n${label}`);
  const result = spawnSync(process.execPath, args, { cwd: ROOT, env, stdio: 'inherit' });

  if (result.status !== 0) {
    console.error(`\n${label} failed. Nothing was published.\n`);
    process.exit(result.status ?? 1);
  }
}

run('Building the site...', [join(ROOT, 'node_modules', 'astro', 'astro.js'), 'build']);
run('Uploading to Cloudflare...', [
  join(ROOT, 'node_modules', 'wrangler', 'bin', 'wrangler.js'),
  'pages', 'deploy', 'dist', '--project-name', PROJECT,
]);

console.log(`\nPublished. ${SITE_URL}`);
console.log('Changes are usually live within a few seconds.\n');
