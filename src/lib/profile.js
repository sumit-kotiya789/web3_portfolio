/* Single source of truth for identity, links and SEO.
   Edit values here once — every page, the footer and the command palette read from this. */

export const PROFILE = {
  name: 'Sumit Kotiya',
  role: 'Blockchain Developer',
  tagline: 'Solidity · Go-Ethereum · EVM · Custom L2 Infrastructure',
  location: 'Uttarakhand, India',
  email: 'sumit.kotiya789@gmail.com',

  // Public profiles
  socials: {
    github: 'https://github.com/sumit-kotiya789',
    linkedin: 'https://linkedin.com/in/sumitkotiya',
  },

  // Resume: drop your file at /public/resume.pdf and this just works.
  resumeUrl: '/resume.pdf',

  // Contact form: create a free form at https://formspree.io, then paste its
  // endpoint here (looks like https://formspree.io/f/abcdwxyz). Until you do,
  // the form falls back to opening the visitor's email client.
  formspreeEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT || '',

  // Canonical site URL — used for SEO, Open Graph and the sitemap.
  // Change this if you deploy under a different domain.
  siteUrl: 'https://sumitkotiya.dev',
}

export const ROUTES = ['/', '/about', '/projects', '/skills', '/wallet', '/contact']
