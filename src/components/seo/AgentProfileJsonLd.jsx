import Head from 'next/head';

// RealEstateAgent entity for the profile page. Gives search/AI engines a single
// structured record of who the agent is, who they work for, their rating, the
// areas they serve and their headline stats — matching the ItemList entries on
// the area pages (same @id pattern).
export default function AgentProfileJsonLd({ agent, bio, areaRankings, canonicalUrl }) {
  const { profile } = agent;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${canonicalUrl}#agent`,
    name: agent.name,
    jobTitle: agent.title,
    description: bio,
    url: canonicalUrl,
    worksFor: { '@type': 'Organization', name: agent.agency.name },
    areaServed: areaRankings.map((r) => ({ '@type': 'Place', name: r.name })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: agent.rating,
      reviewCount: agent.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Antal sålda (12 mån)', value: profile.summary.sold },
      { '@type': 'PropertyValue', name: 'Snittpris per kvm (SEK)', value: profile.summary.pricePerSqm },
      { '@type': 'PropertyValue', name: 'Försäljningstid median (dagar)', value: profile.summary.daysToSell },
    ],
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        key="agent-profile-jsonld"
      />
    </Head>
  );
}
