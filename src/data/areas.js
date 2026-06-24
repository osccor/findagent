// Geographic hierarchy: Län → Kommun → Område, each with a slug and local
// market stats. In production this comes from Boneo's area/market service
// (src/services/api.js → fetchApi). Numbers here are illustrative but realistic.

const LAN = [
  {
    slug: 'stockholm',
    name: 'Stockholms län',
    kommuner: [
      {
        slug: 'stockholm',
        name: 'Stockholm',
        omraden: [
          {
            slug: 'vasastan',
            name: 'Vasastan',
            propertyType: 'lägenheter',
            market: { medianPricePerSqm: 104500, avgDaysToSell: 18, avgFinalToAsk: 1.05, salesLast12m: 612 },
          },
          {
            slug: 'sodermalm',
            name: 'Södermalm',
            propertyType: 'lägenheter',
            market: { medianPricePerSqm: 99800, avgDaysToSell: 21, avgFinalToAsk: 1.04, salesLast12m: 1180 },
          },
          {
            slug: 'ostermalm',
            name: 'Östermalm',
            propertyType: 'lägenheter',
            market: { medianPricePerSqm: 119000, avgDaysToSell: 26, avgFinalToAsk: 1.02, salesLast12m: 540 },
          },
          {
            slug: 'kungsholmen',
            name: 'Kungsholmen',
            propertyType: 'lägenheter',
            market: { medianPricePerSqm: 97500, avgDaysToSell: 19, avgFinalToAsk: 1.05, salesLast12m: 720 },
          },
        ],
      },
      {
        slug: 'nacka',
        name: 'Nacka',
        omraden: [
          {
            slug: 'saltsjobaden',
            name: 'Saltsjöbaden',
            propertyType: 'villor',
            market: { medianPricePerSqm: 68000, avgDaysToSell: 34, avgFinalToAsk: 1.0, salesLast12m: 210 },
          },
          {
            slug: 'sickla',
            name: 'Sickla',
            propertyType: 'lägenheter',
            market: { medianPricePerSqm: 84000, avgDaysToSell: 22, avgFinalToAsk: 1.03, salesLast12m: 305 },
          },
        ],
      },
      {
        slug: 'solna',
        name: 'Solna',
        omraden: [
          {
            slug: 'hagastaden',
            name: 'Hagastaden',
            propertyType: 'lägenheter',
            market: { medianPricePerSqm: 91000, avgDaysToSell: 24, avgFinalToAsk: 1.02, salesLast12m: 280 },
          },
        ],
      },
    ],
  },
  {
    slug: 'vastra-gotaland',
    name: 'Västra Götalands län',
    kommuner: [
      {
        slug: 'goteborg',
        name: 'Göteborg',
        omraden: [
          {
            slug: 'majorna',
            name: 'Majorna',
            propertyType: 'lägenheter',
            market: { medianPricePerSqm: 62000, avgDaysToSell: 20, avgFinalToAsk: 1.06, salesLast12m: 430 },
          },
          {
            slug: 'linne',
            name: 'Linné',
            propertyType: 'lägenheter',
            market: { medianPricePerSqm: 68500, avgDaysToSell: 18, avgFinalToAsk: 1.07, salesLast12m: 360 },
          },
        ],
      },
    ],
  },
  {
    slug: 'skane',
    name: 'Skåne län',
    kommuner: [
      {
        slug: 'malmo',
        name: 'Malmö',
        omraden: [
          {
            slug: 'vastra-hamnen',
            name: 'Västra Hamnen',
            propertyType: 'lägenheter',
            market: { medianPricePerSqm: 58000, avgDaysToSell: 28, avgFinalToAsk: 1.01, salesLast12m: 240 },
          },
          {
            slug: 'limhamn',
            name: 'Limhamn',
            propertyType: 'villor',
            market: { medianPricePerSqm: 47000, avgDaysToSell: 31, avgFinalToAsk: 1.0, salesLast12m: 190 },
          },
        ],
      },
    ],
  },
];

export default LAN;

// ---- Lookups ---------------------------------------------------------------

export function getAllLan() {
  return LAN.map(({ slug, name }) => ({ slug, name }));
}

export function findLan(lanSlug) {
  return LAN.find((l) => l.slug === lanSlug) || null;
}

export function findKommun(lanSlug, kommunSlug) {
  const lan = findLan(lanSlug);
  return lan ? lan.kommuner.find((k) => k.slug === kommunSlug) || null : null;
}

export function findOmrade(lanSlug, kommunSlug, omradeSlug) {
  const kommun = findKommun(lanSlug, kommunSlug);
  return kommun ? kommun.omraden.find((o) => o.slug === omradeSlug) || null : null;
}

// Resolve a catch-all slug array ([lan, kommun, omrade]) into a normalized
// "place" object describing the level, names, market stats and a region key.
export function resolvePlace(slugArray = []) {
  const [lanSlug, kommunSlug, omradeSlug] = slugArray;

  if (omradeSlug) {
    const lan = findLan(lanSlug);
    const kommun = findKommun(lanSlug, kommunSlug);
    const omrade = findOmrade(lanSlug, kommunSlug, omradeSlug);
    if (!omrade) return null;
    return {
      level: 'omrade',
      name: omrade.name,
      slugPath: [lanSlug, kommunSlug, omradeSlug],
      lan,
      kommun,
      omrade,
      market: omrade.market,
      propertyType: omrade.propertyType,
      regionKey: `${lanSlug}/${kommunSlug}`,
    };
  }

  if (kommunSlug) {
    const lan = findLan(lanSlug);
    const kommun = findKommun(lanSlug, kommunSlug);
    if (!kommun) return null;
    return {
      level: 'kommun',
      name: kommun.name,
      slugPath: [lanSlug, kommunSlug],
      lan,
      kommun,
      market: aggregateMarket(kommun.omraden),
      propertyType: 'bostäder',
      regionKey: `${lanSlug}/${kommunSlug}`,
    };
  }

  if (lanSlug) {
    const lan = findLan(lanSlug);
    if (!lan) return null;
    const omraden = lan.kommuner.flatMap((k) => k.omraden);
    return {
      level: 'lan',
      name: lan.name,
      slugPath: [lanSlug],
      lan,
      market: aggregateMarket(omraden),
      propertyType: 'bostäder',
      regionKey: lanSlug,
    };
  }

  return { level: 'root', name: 'Sverige', slugPath: [], propertyType: 'bostäder', regionKey: 'sverige' };
}

function aggregateMarket(omraden) {
  if (!omraden || !omraden.length) return null;
  const sum = omraden.reduce(
    (acc, o) => ({
      price: acc.price + o.market.medianPricePerSqm,
      days: acc.days + o.market.avgDaysToSell,
      ratio: acc.ratio + o.market.avgFinalToAsk,
      sales: acc.sales + o.market.salesLast12m,
    }),
    { price: 0, days: 0, ratio: 0, sales: 0 },
  );
  const n = omraden.length;
  return {
    medianPricePerSqm: Math.round(sum.price / n),
    avgDaysToSell: Math.round(sum.days / n),
    avgFinalToAsk: +(sum.ratio / n).toFixed(2),
    salesLast12m: sum.sales,
  };
}

// Breadcrumb trail from Sverige down to the current place.
export function buildBreadcrumb(place) {
  const trail = [{ name: 'Sverige', href: '/maklare' }];
  if (place.lan) trail.push({ name: place.lan.name, href: `/maklare/${place.lan.slug}` });
  if (place.kommun)
    trail.push({ name: place.kommun.name, href: `/maklare/${place.lan.slug}/${place.kommun.slug}` });
  if (place.omrade)
    trail.push({
      name: place.omrade.name,
      href: `/maklare/${place.lan.slug}/${place.kommun.slug}/${place.omrade.slug}`,
    });
  return trail;
}

// Every område path — used by getStaticPaths to pre-render the high-value pages.
export function getAllOmradePaths() {
  const paths = [];
  LAN.forEach((lan) =>
    lan.kommuner.forEach((kommun) =>
      kommun.omraden.forEach((omrade) =>
        paths.push([lan.slug, kommun.slug, omrade.slug]),
      ),
    ),
  );
  return paths;
}

// Län + kommun index paths (the broader hub pages).
export function getHubPaths() {
  const paths = [];
  LAN.forEach((lan) => {
    paths.push([lan.slug]);
    lan.kommuner.forEach((kommun) => paths.push([lan.slug, kommun.slug]));
  });
  return paths;
}
