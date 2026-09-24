/* ==========================================================================
   SITE CONFIG
   --------------------------------------------------------------------------
   This is the ONE file to edit for your personal details. Everything here
   flows out to the header, footer, home page, contact page and page titles.

   Only change the text between the quotes. Keep the quotes and the commas.
   ========================================================================== */

export const site = {
  /* ---- Identity ------------------------------------------------------- */
  name: 'Jack Friesen',
  role: 'Mechanical Engineering',
  school: 'Colorado State University',

  /* One line under your name on the home page. Keep it short. */
  tagline:
    'I design, build, and instrument physical systems — from PID-controlled research equipment to passive solar stills.',

  /* The paragraph under the tagline on the home page. */
  intro:
    "I'm a mechanical engineering student at Colorado State University and a Walter Scott, Jr. Scholar. My work sits where hardware meets instrumentation: designing PCBs and control loops for research equipment, prototyping thermal systems, and testing them until the data holds up. Before engineering school I was a crew chief at a tire shop and rebuilt a cylinder head in my garage — I like problems that end with something physical that works.",

  /* ---- Contact -------------------------------------------------------- */
  email: 'jackfriesen07@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jack-m-friesen',

  /* Leave github as an empty string ('') to hide it everywhere.
     When you have one, paste the full URL: 'https://github.com/yourname' */
  github: '',

  /* Shown on the contact page. Set to '' to hide. */
  location: '',

  /* ---- Resume ---------------------------------------------------------
     The resume is pulled straight from your Google Doc — both the text on
     the page and the PDF download. Edit the doc, and the site follows a few
     minutes later. Nothing to rebuild, re-upload, or re-deploy.

     The doc must be shared as "Anyone with the link can view".

     To point at a different document, copy the long id out of its address:
     docs.google.com/document/d/THIS-PART-HERE/edit                       */
  resumeDocId: '1HkGkmdoUi80LOQhGJcyKhKJCz7MwMlj1UZtp53juLa8',

  /* Phone numbers are stripped from the page text so bots can't harvest
     them. The PDF download is your untouched document and still has it.
     Set to false if you'd rather show it.                                */
  hidePhoneOnPage: true,

  /* ---- Certifications -------------------------------------------------
     One entry per certificate, newest first. Delete the block to hide the
     section entirely.

     Each `driveFileId` comes from a Google Drive file shared as "Anyone
     with the link can view":
     drive.google.com/file/d/THIS-PART-HERE/view

     `slug` just decides the web address, e.g. /certifications/cswa.pdf    */
  certifications: [
    {
      slug: 'cswa',
      name: 'SOLIDWORKS Design Associate',
      abbr: 'CSWA',
      issuer: 'Dassault Systèmes',
      earned: 'May 2026',
      /* Shown as small print under the name. Set to '' to hide. */
      note: 'Academic exam at Colorado State University',
      credentialId: 'C-UYG8SQLPBR',
      driveFileId: '18y64vhOyYjHFU9oSi9A_OTW7dlIeoEVt',
      /* Certificates are landscape; this keeps the viewer the right shape. */
      aspectRatio: '3 / 2',
    },
  ],

  /* ---- Contact form ---------------------------------------------------
     Free, no account needed. Go to https://web3forms.com, enter your
     email, and they send you an access key. Paste it between the quotes.

     Until you do, the contact page just shows your email and LinkedIn —
     the form hides itself automatically, so nothing looks broken.        */
  web3formsKey: '',
} as const;

export type Site = typeof site;
