// Central place for site-wide constants used across SEO + JSON-LD.
const siteConfig = {
  name: 'Boneo',
  // In production read from env (NEXT_PUBLIC_SITE_URL). Hardcoded for the prototype.
  baseUrl: 'https://www.boneo.se',
  locale: 'sv_SE',
  twitter: '@boneo',
  organization: {
    name: 'Boneo',
    legalName: 'Boneo AB',
    url: 'https://www.boneo.se',
    logo: 'https://www.boneo.se/logo.png',
    sameAs: [
      'https://www.linkedin.com/company/boneo',
      'https://www.instagram.com/boneo',
    ],
  },
  // How fresh the ranking data is. Surfaced on-page and in metadata.
  dataUpdatedAt: '2026-06-01',
  rankingWindowMonths: 12,
};

export default siteConfig;
