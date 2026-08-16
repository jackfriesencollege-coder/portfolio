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

1. Put the new PDF in `public/resume/`
2. Open `site.config.ts` and update these two lines:

```ts
resumeFile: '/resume/Jack-Friesen-Resume.pdf',   // must match the filename exactly
resumeUpdated: 'August 2026',
```

Easiest approach: always name the file `Jack-Friesen-Resume.pdf` and just
overwrite it. Then you only ever change the date.

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

## Folder map

```
Engineering Portfolio/
├─ site.config.ts          ← your name, email, links, resume filename
├─ public/
│  ├─ resume/              ← your resume PDF goes here
│  └─ favicon.svg
└─ src/
   ├─ assets/headshot.jpg  ← replace to change your photo (keep the name)
   ├─ content/
   │  ├─ about.md          ← your bio
   │  └─ projects/         ← one folder per project
   │     └─ _template/     ← copy this to start a new one
   ├─ components/          ← reusable pieces (nav, footer, project card)
   ├─ layouts/             ← the page shell
   ├─ pages/               ← one file per page of the site
   └─ styles/global.css    ← all colours, fonts and spacing
```

Anything not listed above is machinery you can ignore.

---

## Commands

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Preview locally at http://localhost:4321      |
| `npm run deploy`  | Build and publish to jack-friesen.pages.dev   |
| `npm run build`   | Build the final site into `dist/`             |
| `npm run preview` | View the built site exactly as visitors see it |

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
