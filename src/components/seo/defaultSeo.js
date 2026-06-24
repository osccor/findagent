import siteConfig from './siteConfig';

// Site-wide defaults; per-page <NextSeo> overrides title/description/canonical.
const defaultSeo = {
  titleTemplate: '%s | Boneo',
  defaultTitle: 'Boneo – hitta och jämför de bästa mäklarna',
  description:
    'Jämför Sveriges bästa mäklare baserat på antal sålda bostäder, slutpris, ' +
    'försäljningstid och kundbetyg. Hitta rätt mäklare i ditt område med Boneo.',
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    site_name: siteConfig.name,
    images: [
      {
        url: `${siteConfig.baseUrl}/og/default.png`,
        width: 1200,
        height: 630,
        alt: 'Boneo – jämför de bästa mäklarna',
      },
    ],
  },
  twitter: {
    handle: siteConfig.twitter,
    site: siteConfig.twitter,
    cardType: 'summary_large_image',
  },
};

export default defaultSeo;
