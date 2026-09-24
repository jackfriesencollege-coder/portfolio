/* ==========================================================================
   RESUME DOC
   --------------------------------------------------------------------------
   Turns the Google Docs HTML export into clean, site-styled markup.

   You should never need to touch this file. To point the site at a different
   Google Doc, change `resumeDocId` in site.config.ts.

   Two things to know if you ever do read it:

   1. Google's export has no real headings -- every line is a <p> full of
      <span>s, and bold is expressed as a generated class name like "c1".
      Those class numbers change on every export, so this reads the document's
      own stylesheet to find which class means bold rather than assuming.

   2. Section titles are detected by the horizontal rule underneath them.
      That's the one structural signal Google preserves reliably.

   This runs both at build time (Node) and on Cloudflare's edge (Workers), so
   it must stay dependency-free and use no Node-only APIs.

   Non-breaking spaces are written as \u00a0 escapes throughout. Google's
   export is full of them and a literal one in this file would be invisible.
   ========================================================================== */

/** Tags allowed through to the page. Anything else is unwrapped or dropped. */
const ALLOWED_TAGS = new Set([
  'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li',
  'b', 'strong', 'i', 'em', 'a', 'br', 'sup', 'sub', 'span',
]);

/** Tags whose entire contents are discarded, not just the tag itself. */
const VOID_CONTENT_TAGS = 'script|style|iframe|object|embed|noscript|form|svg|math|template';

/** Whitespace, including the non-breaking spaces Google uses for tab stops. */
const SPACE = '[ \\t\\u00a0]';

/** Anything matching this is stripped from the rendered page (never the PDF). */
const PHONE_RE = /(?:\+?\d{1,2}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}(?!\d)/g;

export interface TransformOptions {
  /**
   * Remove phone numbers from the rendered page. The downloadable PDF is
   * untouched -- this only stops the number becoming scrapeable page text.
   */
  redactPhoneNumbers?: boolean;
}

export function resumeExportUrl(docId: string, format: 'html' | 'pdf'): string {
  return `https://docs.google.com/document/d/${encodeURIComponent(docId)}/export?format=${format}`;
}

/**
 * Google answers with `Cache-Control: no-cache`, so `cacheEverything` is
 * needed to let Cloudflare hold the response at the edge for `cacheTtl`
 * seconds. Node ignores the `cf` block at build time.
 */
export async function fetchResumeDoc(
  docId: string,
  format: 'html' | 'pdf' = 'html',
  cacheTtlSeconds = 300,
) {
  const res = await fetch(resumeExportUrl(docId, format), {
    headers: { accept: format === 'pdf' ? 'application/pdf' : 'text/html' },
    cf: { cacheEverything: true, cacheTtl: cacheTtlSeconds },
  } as RequestInit);

  if (!res.ok) {
    throw new Error(`Google Docs export for ${docId} returned ${res.status} ${res.statusText}`);
  }
  return res;
}

/* -------------------------------------------------------------------------- */
/* Transform                                                                  */
/* -------------------------------------------------------------------------- */

export function transformResumeDoc(raw: string, options: TransformOptions = {}): string {
  const { redactPhoneNumbers = true } = options;

  const boldClasses = findBoldClasses(raw);

  let html = isolateBody(raw);
  html = dropDangerousElements(html);
  html = convertBoldSpans(html, boldClasses);
  html = unwrapGoogleRedirects(html);
  html = normaliseAttributes(html);
  html = enforceTagAllowlist(html);

  let out = restructure(html);

  if (redactPhoneNumbers) {
    // Removing the number can leave a dangling bullet separator behind it.
    out = out.replace(PHONE_RE, '').replace(/\u2022\s*\u2022/g, '\u2022');
  }

  return tidy(out);
}

/**
 * Google writes bold as `.c1{font-weight:700}` in an inline stylesheet and
 * renumbers those classes every time the document is exported, so the mapping
 * has to be read from the document itself.
 */
function findBoldClasses(raw: string): Set<string> {
  const bold = new Set<string>();
  const style = raw.match(/<style[^>]*>([\s\S]*?)<\/style>/i)?.[1] ?? '';

  for (const rule of style.matchAll(/\.([A-Za-z][\w-]*)\s*\{([^}]*)\}/g)) {
    if (/font-weight\s*:\s*(?:bold|[6-9]00)/i.test(rule[2])) bold.add(rule[1]);
  }
  return bold;
}

function isolateBody(raw: string): string {
  const withBody = raw.replace(/[\s\S]*?<body[^>]*>/i, '');
  return withBody === raw ? raw : withBody.replace(/<\/body>[\s\S]*/i, '');
}

function dropDangerousElements(html: string): string {
  return html
    .replace(new RegExp(`<(${VOID_CONTENT_TAGS})\\b[\\s\\S]*?<\\/\\1\\s*>`, 'gi'), '')
    .replace(new RegExp(`<\\/?(?:${VOID_CONTENT_TAGS})\\b[^>]*>`, 'gi'), '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

/**
 * Rewrites bold <span>s as <b> and unwraps the rest. A stack is used because
 * the opening and closing tags have to be decided together -- `</span>` gives
 * no clue which kind of span it closes.
 */
function convertBoldSpans(html: string, boldClasses: Set<string>): string {
  const stack: boolean[] = [];

  return html.replace(/<span(?:\s[^>]*)?>|<\/span\s*>/gi, (tag) => {
    if (tag[1] === '/') return stack.pop() ? '</b>' : '';

    const classes = tag.match(/class\s*=\s*"([^"]*)"/i)?.[1] ?? '';
    const isBold = classes.split(/\s+/).some((c) => boldClasses.has(c));
    stack.push(isBold);
    return isBold ? '<b>' : '';
  });
}

/** Turns google.com/url?q=<real-url>&sa=... back into the real destination. */
function unwrapGoogleRedirects(html: string): string {
  return html.replace(
    /href\s*=\s*"https:\/\/www\.google\.com\/url\?q=([^"&]*)[^"]*"/gi,
    (match, encoded: string) => {
      try {
        return `href="${escapeAttribute(decodeURIComponent(encoded))}"`;
      } catch {
        return match;
      }
    },
  );
}

/**
 * Drops every attribute. `href` survives on links, but only for schemes that
 * cannot execute -- no `javascript:`, no `data:`.
 */
function normaliseAttributes(html: string): string {
  return html.replace(
    /<([A-Za-z][\w-]*)((?:\s+[^\s/>"'=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s/>]*))?)*)\s*(\/?)>/g,
    (_match, rawTag: string, attrs: string, selfClose: string) => {
      const tag = rawTag.toLowerCase();
      if (tag !== 'a') return `<${tag}${selfClose ? ' /' : ''}>`;

      const href = attrs.match(/href\s*=\s*"([^"]*)"/i)?.[1]?.trim() ?? '';
      if (!/^(?:https?:\/\/|mailto:|tel:|\/|#)/i.test(href)) return '<a>';

      const external = /^https?:\/\//i.test(href);
      const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${escapeAttribute(href)}"${rel}>`;
    },
  );
}

/**
 * Unwraps anything not on the allowlist, keeping its text. `<hr>` survives this
 * pass because `restructure` uses it to find section titles.
 */
function enforceTagAllowlist(html: string): string {
  return html.replace(/<\/?([A-Za-z][\w-]*)[^>]*>/g, (match, rawTag: string) => {
    const tag = rawTag.toLowerCase();
    if (tag === 'hr') return '<hr>';
    return ALLOWED_TAGS.has(tag) ? match : '';
  });
}

/* -------------------------------------------------------------------------- */
/* Structure                                                                  */
/* -------------------------------------------------------------------------- */

interface Block {
  kind: 'p' | 'list';
  html: string;
  isHeading: boolean;
}

/**
 * Rebuilds the flat run of <p>s into a real document: section headings,
 * two-column "title ... date" rows, and merged bullet lists.
 */
function restructure(html: string): string {
  const blocks = collectBlocks(html);
  const firstHeading = blocks.findIndex((b) => b.isHeading);

  // Everything above the first section title is the document's letterhead --
  // name, address, phone, email. The site already has a header and a contact
  // page, so it is dropped rather than duplicated (which also keeps the phone
  // number off the public page).
  const body = firstHeading > 0 ? blocks.slice(firstHeading) : blocks;

  const out: string[] = [];

  for (const block of body) {
    if (block.kind === 'list') {
      const items = collectListItems(block.html);
      if (!items.length) continue;

      // Google emits one <ul> per bullet; stitch runs of them back together.
      const previous = out[out.length - 1];
      if (previous?.startsWith('<ul>')) {
        out[out.length - 1] = previous.replace(/<\/ul>$/, '') + items.join('') + '</ul>';
      } else {
        out.push(`<ul>${items.join('')}</ul>`);
      }
      continue;
    }

    if (isBlank(block.html)) continue;

    if (block.isHeading) {
      // <h2> is already styled, so the document's own bolding is redundant.
      out.push(`<h2>${collapseSpaces(stripTags(block.html))}</h2>`);
      continue;
    }

    out.push(renderRow(block.html));
  }

  return out.join('\n');
}

function collectBlocks(html: string): Block[] {
  const blocks: Block[] = [];
  const blockRe = /<(p|ul|ol|h[1-4])\b[^>]*>([\s\S]*?)<\/\1\s*>|<hr>/gi;

  for (const match of html.matchAll(blockRe)) {
    // A bare <hr> underlines the block above it, marking it a section title.
    if (!match[1]) {
      const previous = blocks[blocks.length - 1];
      if (previous) previous.isHeading = true;
      continue;
    }

    const tag = match[1].toLowerCase();
    let inner = match[2];

    // Google sometimes nests the rule inside the paragraph it underlines.
    const hasInlineRule = inner.includes('<hr>');
    if (hasInlineRule) inner = inner.replace(/<hr>/g, '');

    blocks.push({
      kind: tag === 'ul' || tag === 'ol' ? 'list' : 'p',
      html: inner,
      // A heading written with a real Google Docs heading style counts too.
      isHeading: hasInlineRule || /^h[1-4]$/.test(tag),
    });
  }

  return blocks;
}

function collectListItems(listHtml: string): string[] {
  const items: string[] = [];

  for (const match of listHtml.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li\s*>/gi)) {
    if (isBlank(match[1])) continue;
    items.push(`<li>${collapseSpaces(match[1])}</li>`);
  }
  return items;
}

/**
 * In the document a job title and its date are separated by a run of tabs,
 * which export as runs of non-breaking spaces. Those become a two-column row
 * so the date sits right-aligned instead of adrift mid-sentence.
 */
function renderRow(inner: string): string {
  // The tab run often sits inside a bold span, so slicing the string would cut
  // <b>...</b> in half. Both halves get their markup stripped instead -- no
  // text is lost, and the row's own styling supplies the emphasis.
  // Tab stops arrive as runs of &nbsp; entities, so decode them before
  // looking for the gap -- and search the decoded string, since the slice
  // indices below have to refer to it.
  const normalised = inner.replace(/&nbsp;/g, ' ');

  // Work backwards to the last gap that yields a real date. Lines often end in
  // a stray &nbsp;, which forms a trailing gap with nothing after it.
  const gaps = [...normalised.matchAll(new RegExp(`${SPACE}{2,}`, 'g'))];

  for (let i = gaps.length - 1; i >= 0; i--) {
    const gap = gaps[i];
    if (gap.index === undefined) continue;

    const title = collapseSpaces(stripTags(normalised.slice(0, gap.index)));
    const meta = collapseSpaces(stripTags(normalised.slice(gap.index + gap[0].length)));

    // Only a short trailing fragment is a date or a GPA. Anything longer is
    // prose that happened to contain wide spacing.
    if (title && meta && meta.length <= 48) {
      return (
        '<p class="resume-row">' +
        `<span class="resume-row__title">${title}</span>` +
        `<span class="resume-row__meta">${meta}</span>` +
        '</p>'
      );
    }
  }

  return `<p>${collapseSpaces(normalised)}</p>`;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Strips tags, optionally keeping a pipe-separated allowlist. */
function stripTags(html: string, keep = ''): string {
  const allowed = new Set(keep ? keep.split('|') : []);
  return html.replace(/<\/?([A-Za-z][\w-]*)[^>]*>/g, (match, tag: string) =>
    allowed.has(tag.toLowerCase()) ? match : '',
  );
}

function isBlank(html: string): boolean {
  return stripTags(html).replace(/&nbsp;|\s|\u00a0/g, '') === '';
}

function collapseSpaces(html: string): string {
  return html
    .replace(/&nbsp;/g, ' ')
    .replace(/[\s\u00a0]+/g, ' ')
    .replace(/\s+([,.;:)])/g, '$1')
    .trim();
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function tidy(html: string): string {
  return html
    .replace(/<b>\s*<\/b>/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/ {2,}/g, ' ')
    .trim();
}
