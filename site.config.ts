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
     To update your resume: drop the new PDF into  public/resume/
     then change the filename below to match it exactly.
     Keep the leading slash.                                              */
  resumeFile: '/resume/Jack-Friesen-Resume.pdf',
  resumeUpdated: 'August 2026',

  /* ---- Contact form ---------------------------------------------------
     Free, no account needed. Go to https://web3forms.com, enter your
     email, and they send you an access key. Paste it between the quotes.

     Until you do, the contact page just shows your email and LinkedIn —
     the form hides itself automatically, so nothing looks broken.        */
  web3formsKey: '',
} as const;

export type Site = typeof site;
