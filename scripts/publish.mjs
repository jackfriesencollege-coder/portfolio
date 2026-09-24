#!/usr/bin/env node
/* ==========================================================================
   SAVE AND PUBLISH
   --------------------------------------------------------------------------
   Does the whole after-editing routine in one go:

     1. saves your changes to GitHub   (add, commit, push)
     2. puts them live on the website  (build, upload)

   Run it from the project folder:

     .\publish "what you changed"

   The message is optional but worth writing -- it's what you'll read later
   when trying to remember what a change was for.

   Add --check to see what it would do without doing anything.

   Why this exists: "git push" uploads commits, not files. Saving a file in
   your editor doesn't tell Git anything, so pushing without committing first
   reports "Everything up-to-date" while your edits sit there unsaved. This
   runs the steps in the right order so that can't happen.
   ========================================================================== */

import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BACKSLASH = String.fromCharCode(92);
const SELF = '.' + BACKSLASH + 'publish';

const argv = process.argv.slice(2);
const checkOnly = argv.includes('--check');
const message = argv.filter((a) => a !== '--check').join(' ').trim() || 'Update the website';

const line = (s = '') => console.log(s);
const fail = (s = '') => console.error(s);

function git(args, options) {
  return spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', ...options });
}

function gitLoud(args) {
  return spawnSync('git', args, { cwd: ROOT, stdio: 'inherit' });
}

/* -------------------------------------------------------------------------- */
/* 0. Sanity                                                                  */
/* -------------------------------------------------------------------------- */

const insideRepo = git(['rev-parse', '--is-inside-work-tree']);

if (insideRepo.status !== 0) {
  fail('');
  fail("This folder isn't a Git repository, so there's nothing to save.");
  fail('');
  fail('Run this from:  ' + ROOT);
  fail('');
  process.exit(1);
}

/* -------------------------------------------------------------------------- */
/* 1. What changed                                                            */
/* -------------------------------------------------------------------------- */

const status = git(['status', '--porcelain']);
const changedFiles = status.stdout.split('\n').filter((l) => l.trim().length > 0);
const hasChanges = changedFiles.length > 0;

// Commits made earlier but never pushed.
const unpushed = git(['log', '--oneline', '@{u}..HEAD']);
const unpushedCount = unpushed.status === 0
  ? unpushed.stdout.split('\n').filter((l) => l.trim().length > 0).length
  : 0;

line('');
if (hasChanges) {
  line('Files you changed:');
  line('');
  for (const entry of changedFiles) line('  ' + entry.trim());
} else {
  line('No file changes to save.');
}

if (unpushedCount > 0) {
  line('');
  line(unpushedCount + ' earlier change(s) saved but not yet on GitHub.');
}

if (checkOnly) {
  line('');
  line('What  ' + SELF + '  would do:');
  line('');
  if (hasChanges) {
    line('  1. Save those files to GitHub as: "' + message + '"');
  } else if (unpushedCount > 0) {
    line('  1. Push the earlier saved change(s) to GitHub');
  } else {
    line('  1. Nothing to save -- GitHub is already up to date');
  }
  line('  2. Build the site and upload it to Cloudflare');
  line('');
  process.exit(0);
}

/* -------------------------------------------------------------------------- */
/* 2. Save to GitHub                                                          */
/* -------------------------------------------------------------------------- */

if (hasChanges) {
  line('');
  line('Saving to GitHub...');

  if (gitLoud(['add', '-A']).status !== 0) {
    fail('\nCould not stage your changes. Nothing was published.\n');
    process.exit(1);
  }

  if (gitLoud(['commit', '-m', message]).status !== 0) {
    fail('\nCould not save your changes. Nothing was published.\n');
    process.exit(1);
  }
}

if (hasChanges || unpushedCount > 0) {
  const pushed = gitLoud(['push']);

  if (pushed.status !== 0) {
    // Worth continuing: the work is safe in a local commit, and getting the
    // site updated is usually the more urgent half.
    fail('');
    fail("Couldn't reach GitHub, so your changes aren't backed up there yet.");
    fail('They are saved on this computer. Try  git push  again later.');
    fail('');
    fail('Carrying on with publishing the site...');
  }
}

/* -------------------------------------------------------------------------- */
/* 3. Publish the site                                                        */
/* -------------------------------------------------------------------------- */

const deployed = spawnSync(process.execPath, [join(ROOT, 'scripts', 'deploy.mjs')], {
  cwd: ROOT,
  stdio: 'inherit',
});

process.exitCode = deployed.status === null ? 1 : deployed.status;
