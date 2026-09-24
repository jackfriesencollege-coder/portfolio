/* ==========================================================================
   GET /resume.pdf
   --------------------------------------------------------------------------
   Streams the Google Doc's own PDF export, so the download is always the
   current version of the document.

   Serving it from this domain instead of linking to Google keeps the URL
   tidy, lets the browser name the file properly, and means the link still
   works if the doc is ever moved to a different account.

   Add ?download to force a save dialog instead of opening in the viewer.
   ========================================================================== */

import { site } from '../site.config';
import { fetchResumeDoc } from '../src/lib/resume-doc';

const CACHE_SECONDS = 300;

export const onRequestGet: PagesFunction = async ({ request }) => {
  const filename = `${site.name.replace(/\s+/g, '-')}-Resume.pdf`;
  const forceDownload = new URL(request.url).searchParams.has('download');

  try {
    const upstream = await fetchResumeDoc(site.resumeDocId, 'pdf', CACHE_SECONDS);

    return new Response(upstream.body, {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition':
          `${forceDownload ? 'attachment' : 'inline'}; filename="${filename}"`,
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
