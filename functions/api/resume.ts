/* ==========================================================================
   GET /api/resume
   --------------------------------------------------------------------------
   Fetches the Google Doc and returns it as a clean HTML fragment.

   This has to run on the server: Google's export sends no CORS headers, so
   the browser can't fetch the document directly.

   The resume page already ships a copy rendered at build time, so if this
   ever fails the page simply keeps showing that. Nothing breaks.
   ========================================================================== */

import { site } from '../../site.config';
import { fetchResumeDoc, transformResumeDoc } from '../../src/lib/resume-doc';

/** How long Cloudflare may serve a cached copy before re-checking the doc. */
const CACHE_SECONDS = 300;

export const onRequestGet: PagesFunction = async () => {
  try {
    const res = await fetchResumeDoc(site.resumeDocId, 'html', CACHE_SECONDS);
    const html = transformResumeDoc(await res.text(), {
      redactPhoneNumbers: site.hidePhoneOnPage,
    });

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': `public, max-age=${CACHE_SECONDS}`,
        'x-content-type-options': 'nosniff',
      },
    });
  } catch (error) {
    return new Response(`Could not reach the resume document: ${error}`, {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
};
