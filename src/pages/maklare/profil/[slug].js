import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { NextSeo, BreadcrumbJsonLd } from 'next-seo';

import Layout from '@/components/layout/Layout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileBio from '@/components/profile/ProfileBio';
import ProfileStats from '@/components/profile/ProfileStats';
import AreaRankings from '@/components/profile/AreaRankings';
import AgentProfileJsonLd from '@/components/seo/AgentProfileJsonLd';
import siteConfig from '@/components/seo/siteConfig';

import { getAgentBySlug, getAllAgentSlugs, buildAgentProfile, buildDefaultBio, AGENCIES } from '@/data/agents';
import { getAgentAreaRankings } from '@/lib/agentsService';
import { rating1 } from '@/lib/format';

const Hero = styled.section`
  background: linear-gradient(135deg, #8046ff 0%, #5b2fd1 100%);
  padding: 28px 0 120px;
`;

const Wide = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 16px;
  }
`;

const Back = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;

  &:hover {
    opacity: 0.85;
  }
`;

const CardWrap = styled.div`
  max-width: 1024px;
  margin: -88px auto 0;
  padding: 0 24px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 16px;
    margin-top: -96px;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.shadow.raised};
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 24px 20px;
    gap: 24px;
  }
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  border: 0;
  background: ${({ theme }) => theme.colors.grey10};
  margin: 0;
`;

const Cta = styled.section`
  background: ${({ theme }) => theme.colors.grey90};
  color: #fff;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  h2 {
    font-size: 20px;
    font-weight: 700;
  }
  p {
    color: #c9c9c9;
    margin-top: 4px;
    font-size: 15px;
  }
  a {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    padding: 13px 24px;
    border-radius: ${({ theme }) => theme.radius.md};
    font-weight: 600;
    white-space: nowrap;
  }
`;

export default function AgentProfilePage({ agent, bio, areaRankings, canonicalUrl }) {
  const router = useRouter();
  const first = agent.name.split(' ')[0];

  const onBack = (e) => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  const description = `${agent.name} är ${agent.title.toLowerCase()} på ${agent.agency.name} med ${agent.profile.summary.sold} sålda bostäder det senaste året och betyg ${rating1(agent.rating)} av 5. Se statistik per bostadstyp och kontakta ${first} via Boneo.`;

  return (
    <Layout>
      <NextSeo
        title={`${agent.name} – ${agent.agency.name}`}
        description={description}
        canonical={canonicalUrl}
        openGraph={{ title: `${agent.name} – mäklare`, description, url: canonicalUrl, type: 'profile' }}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          { position: 1, name: 'Sverige', item: `${siteConfig.baseUrl}/maklare` },
          { position: 2, name: agent.name, item: canonicalUrl },
        ]}
      />
      <AgentProfileJsonLd agent={agent} bio={bio} areaRankings={areaRankings} canonicalUrl={canonicalUrl} />

      <Hero>
        <Wide>
          <Back href="/maklare" onClick={onBack}>
            <span aria-hidden="true">←</span> Tillbaka
          </Back>
        </Wide>
      </Hero>

      <CardWrap>
        <Card>
          <ProfileHeader agent={agent} />
          <Divider />
          <ProfileBio slug={agent.slug} defaultBio={bio} />
          <Divider />
          <ProfileStats profile={agent.profile} />
          {areaRankings.length ? (
            <>
              <Divider />
              <AreaRankings rankings={areaRankings} />
            </>
          ) : null}
        </Card>

        <Cta id="kontakt">
          <div>
            <h2>Vill du anlita {first}?</h2>
            <p>Skicka en förfrågan så hör {first} av sig för en kostnadsfri värdering av din bostad.</p>
          </div>
          <a href="#">Kontakta {first}</a>
        </Cta>
      </CardWrap>
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: getAllAgentSlugs().map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const a = getAgentBySlug(params.slug);
  if (!a) return { notFound: true };

  const profile = buildAgentProfile(a);
  const bio = buildDefaultBio(a);
  const areaRankings = getAgentAreaRankings(a);

  const agent = {
    slug: a.slug,
    name: a.name,
    title: a.title,
    agency: AGENCIES[a.agencyId],
    rating: a.baseRating,
    reviewCount: a.reviewCount,
    profile,
  };

  return {
    props: {
      agent,
      bio,
      areaRankings,
      canonicalUrl: `${siteConfig.baseUrl}/maklare/profil/${a.slug}`,
    },
    revalidate: 86400,
  };
}
