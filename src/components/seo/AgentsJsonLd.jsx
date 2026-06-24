import Head from 'next/head';

// schema.org ItemList of RealEstateAgent, ordered by rank. This is the primary
// machine-readable representation of "the best agents in <area>": AI answer
// engines and Google can read the ranked entities, their ratings and the area
// they serve directly, without parsing the visual layout.
export default function AgentsJsonLd({ place, agents, canonicalUrl }) {
  if (!agents.length) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Bästa mäklare i ${place.name}`,
    description: `Topplista över de bäst rankade fastighetsmäklarna i ${place.name}, sorterade efter Boneo-betyg.`,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: agents.length,
    itemListElement: agents.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'RealEstateAgent',
        '@id': `${canonicalUrl}#maklare-${a.agentId}`,
        name: a.name,
        jobTitle: a.title,
        worksFor: { '@type': 'Organization', name: a.agency.name },
        areaServed: { '@type': 'Place', name: place.name },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: a.rating,
          reviewCount: a.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
        // Surfacing the headline performance stats as additional properties.
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Antal sålda (12 mån)', value: a.soldCount },
          { '@type': 'PropertyValue', name: 'Snittpris per kvm (SEK)', value: a.pricePerSqm },
          { '@type': 'PropertyValue', name: 'Försäljningstid (dagar)', value: a.daysToSell },
          { '@type': 'PropertyValue', name: 'Boneo-betyg', value: Math.round(a.boneoScore), maxValue: 100 },
        ],
      },
    })),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        key="agents-itemlist-jsonld"
      />
    </Head>
  );
}
