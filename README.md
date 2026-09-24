# Jack Friesen — Engineering Portfolio

Personal portfolio site. Built with [Astro](https://astro.build), deployed on
Cloudflare Pages.

---

## Running it on your computer

Open PowerShell in this folder and run:

```powershell
npm run dev
```

Then open **http://localhost:4321** in your browser.

Leave that window running while you work. Every time you save a file, the page
in the browser updates by itself — you don't need to restart anything.

Press `Ctrl + C` in the terminal to stop it.

> First time only: run `npm install` before `npm run dev`.

---

## The four things you'll actually edit

### 1. Add a project

1. Go to `src/content/projects/`
2. Copy the `_template` folder and rename the copy — the new name becomes the
   web address. Use lowercase-with-hyphens: `pcb-test-rig` → `/projects/pcb-test-rig`
3. Drop your images into that folder
4. Open `index.md` inside it and fill in the details

That's it. The card, the project page, and the link all appear on their own.

**Minimum viable project** — everything else is optional:

```markdown
---
title: 'Load Cell Test Rig'
blurb: 'Bench rig for calibrating load cells to ±0.5% across a 0–50 kg range.'
date: 2026-09-01
cover: './cover.jpg'
---

Write whatever you want here.

![Rig on the bench](./photo-1.jpg)
```

Useful extras:

| Field      | What it does                                          |
| ---------- | ----------------------------------------------------- |
| `featured` | `true` puts it on the home page                       |
| `draft`    | `true` hides it from the live site (still visible locally) |
| `tags`     | Small labels on the card, e.g. `['KiCad', 'Controls']` |
| `role`     | Shown in the sidebar, e.g. `'Design lead, 4-person team'` |
| `link`     | Adds a button to an external report or repo            |

**To delete a project**, delete its folder.

### 2. Update your resume

**Edit the Google Doc. That's the whole job.**

The site reads your resume straight from
[the doc](https://docs.google.com/document/d/1HkGkmdoUi80LOQhGJcyKhKJCz7MwMlj1UZtp53juLa8/edit) —
both the text on the page and the "Download PDF" button. Changes show up
within about five minutes. Nothing to rebuild, re-upload, or re-deploy.

A few things worth knowing:

| What you do in the doc | What the site does |
| ---------------------- | ------------------ |
| Bold some text | Renders bold |
| A line with a horizontal rule under it | Becomes a section heading |
| Tab across to a date | Date is pushed to the right margin |
| Bullet list | Stays a bullet list |

Section headings are shown in small caps regardless of how you type them, so
`EDUCATION` and `Involvement` come out looking the same.

**Your phone number is stripped from the page**, so bots can't scrape it. The
PDF download is your untouched document and still has it. To change that, set
`hidePhoneOnPage: false` in `site.config.ts`.

The doc has to stay shared as **"Anyone with the link can view"**. If sharing
is ever turned off, the page falls back to whatever it last saw at build time.

### 2b. Add a certification

Upload the certificate PDF to Google Drive, share it as **"Anyone with the
link can view"**, then copy the id out of its address:

```
drive.google.com/file/d/THIS-PART-HERE/view
```

Add a block to `certifications` in `site.config.ts` and it appears on the
resume page, with a viewer and a download button. Delete the block to remove
it; empty the list to hide the section entirely.

### 3. Edit your bio

`src/content/about.md` — plain text. Lines starting with `##` are headings.

### 4. Change your name, email, links, tagline

`site.config.ts` — every personal detail lives in that one file.

---

## Publishing your changes

Live site: **https://jack-friesen.pages.dev**

```powershell
npm run deploy
```

That builds the site and uploads it to Cloudflare. Live in under a minute.

The first time you run it, a browser window opens to sign in to Cloudflare.
After that it's silent.

Saving your work to GitHub is a separate step (do both — GitHub is your backup
and undo history):

```powershell
git add .
git commit -m "Add load cell project"
git push
```

> Pushing to GitHub does **not** publish the site on its own. `npm run deploy`
> is what publishes.

---

## Sending new photos and documents

Drop them in **`_source/_inbox/`** and say they're there. No need to sort,
rename, or resize — straight off the phone is best, since the site makes its own
smaller copies. Once they're used they get filed into `_source/<project>/`.

`_source/` is git-ignored, so originals stay on your machine and never bloat the
repo. See `_source/README.md`.

## Folder map

```
Engineering Portfolio/
├─ site.config.ts          ← your name, email, links, resume doc, certifications
├─ _source/                ← original photos & documents (never published)
│  ├─ _inbox/              ← drop new files here
│  └─ <project>/           ← originals, one folder per project
├─ functions/              ← fetches the resume & certificates from Google
├─ public/
│  ├─ _redirects           ← keeps old resume links working
│  └─ favicon.svg
└─ src/
   ├─ assets/headshot.jpg  ← replace to change your photo (keep the name)
   ├─ content/
   │  ├─ about.md          ← your bio
   │  └─ projects/         ← one folder per project (what's on the site)
   │     └─ _template/     ← copy this to start a new one
   ├─ components/          ← reusable pieces (nav, footer, project card)
   ├─ layouts/             ← the page shell
   ├─ pages/               ← one file per page of the site
   └─ styles/global.css    ← all colours, fonts and spacing
```

Anything not listed above is machinery you can ignore.

---

## Commands

| Command            | What it does                                   |
| ------------------ | ---------------------------------------------- |
| `npm run dev`      | Preview locally at http://localhost:4321       |
| `npm run dev:live` | Preview with the Google Doc and certificate PDFs working |
| `npm run deploy`   | Build and publish to jack-friesen.pages.dev    |
| `npm run build`    | Build the final site into `dist/`              |
| `npm run preview`  | View the built site exactly as visitors see it |

> `npm run dev` is the fast one you'll use most. It can't serve the live
> resume or the certificate PDFs, because those need Cloudflare's server —
> the resume still shows, just frozen as of the last build. Use
> `npm run dev:live` when you specifically want to check those.

---

## If something breaks

**The terminal shows a red error after I edited a project.**
Almost always a typo in the `---` block at the top of `index.md`. The error names
the file and the field. Common causes: a missing quote, a missing comma, or a
date that isn't in `YYYY-MM-DD` form.

**My image doesn't show up.**
The path must start with `./` and match the filename exactly, capitals included.
`./Cover.JPG` and `./cover.jpg` are different files.

**The site won't start at all.**
Delete the `node_modules` folder and run `npm install` again.

**The resume page is empty, or shows an old version.**
Check the Google Doc is still shared as "Anyone with the link can view" —
that's nearly always the cause. Edits can also take up to five minutes to
appear, since the site caches the doc to stay fast.

**A build prints `unable to verify the first certificate`.**
Norton intercepts secure connections, and Node doesn't trust its certificate
by default. Your normal terminal is already set up for this. If it ever does
happen, `node --use-system-ca` tells Node to trust Windows' certificate store.
