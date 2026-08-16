/* ==========================================================================
   CONTENT SCHEMA
   --------------------------------------------------------------------------
   This defines what fields a project is allowed to have. You normally never
   need to touch this file — it exists so that if you make a typo in a
   project's index.md, the site tells you exactly what's wrong instead of
   building a broken page.

   To add a project, see:  src/content/projects/_template/index.md
   ========================================================================== */

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({
    base: './src/content/projects',
    // Every project is a folder containing an index.md.
    // Folders starting with an underscore (like _template) are ignored.
    pattern: ['**/index.md', '!**/_*/**'],
    // Turns "solar-still/index.md" into the URL /projects/solar-still
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),

  schema: ({ image }) =>
    z.object({
      /* Required ------------------------------------------------------- */
      title: z.string(),
      // One or two sentences shown on the project card.
      blurb: z.string(),
      // Used for sorting, newest first. Format: YYYY-MM-DD
      date: z.coerce.date(),

      /* Optional — delete the line entirely if you don't want it -------- */
      // Card image. Put the file in the project folder, then: cover: "./cover.jpg"
      cover: image().optional(),
      coverAlt: z.string().default(''),
      // Short labels, e.g. ["SolidWorks", "Thermodynamics"]
      tags: z.array(z.string()).default([]),
      // Shows this project on the home page.
      featured: z.boolean().default(false),
      // Hides it from the site without deleting the folder.
      draft: z.boolean().default(false),
      // Free-text facts listed in the sidebar of the project page.
      role: z.string().optional(),
      timeframe: z.string().optional(),
      // An outbound link, e.g. a report or repo.
      link: z.string().url().optional(),
      linkLabel: z.string().default('View source'),
    }),
});

export const collections = { projects };
