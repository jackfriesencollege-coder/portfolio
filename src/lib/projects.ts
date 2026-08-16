import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * All projects, newest first.
 *
 * Anything marked `draft: true` stays visible while you're previewing
 * locally, but is left out of the published site.
 */
export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );

  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Projects marked `featured: true`, for the home page. */
export async function getFeaturedProjects(limit = 3) {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.data.featured);
  // If nothing is flagged as featured, fall back to the newest few
  // so the home page is never empty.
  return (featured.length > 0 ? featured : projects).slice(0, limit);
}

/** Formats a date as "May 2026". */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}
