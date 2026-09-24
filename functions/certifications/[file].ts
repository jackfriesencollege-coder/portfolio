/* ==========================================================================
   GET /certifications/<slug>.pdf
   --------------------------------------------------------------------------
   Streams a certificate PDF out of Google Drive.

   Only the slugs listed in site.config.ts are served. That matters: without
   the allowlist this would be an open proxy, and anyone could pipe arbitrary
   Drive files through your domain.

   Serving from this domain also means <object> can embed the PDF inline,
   which Drive's own URLs won't allow.

   Add ?download to force a save dialog instead of opening in the viewer.
   ========================================================================== */

import { site } from '../../site.config';

const CACHE_SECONDS = 86_400; // Certificates never change once issued.

export const onRequestGet: PagesFunction = async ({ params, request }) => {
  const requested = Array.isArray(params.file) ? params.file[0] : params.file;
  const slug = String(requested ?? '').replace(/\.pdf$/i, '');

  const cert = site.certifications.find((c) => c.slug === slug);
  if (!cert) {
    return new Response('Not found', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const filename = `${site.name.replace(/\s+/g, '-')}-${cert.abbr || cert.slug}.pdf`;
  const forceDownload = new URL(request.url).searchParams.has('download');

  try {
    const upstream = await fetch(
      `https://drive.google.com/uc?export=download&id=${encodeURIComponent(cert.driveFileId)}`,
      { cf: { cacheEverything: true, cacheTtl: CACHE_SECONDS } } as RequestInit,
    );

    if (!upstream.ok) throw new Error(`Drive returned ${upstream.status}`);

    return new Response(upstream.body, {
      headers: {
        // Drive answers with application/octet-stream, which stops browsers
        // rendering it inline.
        'content-type': 'application/pdf',
        'content-disposition':
          `${forceDownload ? 'attachment' : 'inline'}; filename="${filename}"`,
        'cache-control': `public, max-age=${CACHE_SECONDS}`,
        'x-content-type-options': 'nosniff',
      },
    });
  } catch (error) {
    return new Response(`Could not reach the certificate file: ${error}`, {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
};
