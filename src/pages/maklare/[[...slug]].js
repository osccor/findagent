import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { NextSeo, BreadcrumbJsonLd, FAQPageJsonLd, OrganizationJsonLd } from 'next-seo';

import Layout from '@/components/layout/Layout';
import Breadcrumb from '@/components/layout/Breadcrumb';
import AreaSearch from '@/components/search/AreaSearch';
import AnswerBox from '@/components/content/AnswerBox';
import MethodologySection from '@/components/content/MethodologySection';
import SeoContent from '@/components/content/SeoContent';
import Faq from '@/components/content/Faq';
import FilterTabs from '@/components/agents/FilterTabs';
import AgentList from '@/components/agents/AgentList';
import AgentsJsonLd from '@/components/seo/AgentsJsonLd';
import siteConfig from '@/components/seo/siteConfig';

import { resolvePlace, buildBreadcrumb, getAllOmradePaths, getHubPaths } from '@/data/areas';
import { getRankedAgentsForArea } from '@/lib/agentsService';
import { sortAgents, SORT_MODES } from '@/lib/ranking';
import {
  buildTitle,
  buildMetaDescription,
  buildHeading,
  buildIntro,
  buildAnswer,
  buildFaq,
  dataUpdatedLabel,
} from '@/lib/pageContent';
import { nf } from '@/lib/format';

// ---- Styles ----------------------------------------------------------------

const Hero = styled.section`
  background: linear-gradient(135deg, #8046ff 0%, #5b2fd1 100%);
  color: #fff;
  padding: 28px 0 84px;
`;

const Wide = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 16px;
  }
`;

const H1 = styled.h1`
  margin-top: 18px;
  font-size: 40px;
  line-height: 1.12;
  font-weight: 700;
  letter-spacing: -0.5px;
  max-width: 760px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 30px;
  }
`;

const Intro = styled.p`
  margin-top: 14px;
  font-size: 17px;
  line-height: 27px;
  max-width: 640px;
  color: rgba(255, 255, 255, 0.92);
`;

const SearchCard = styled.div`
  max-width: 1024px;
  margin: -60px auto 0;
  padding: 0 24px;
  position: relative;
  z-index: 2;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 16px;
  }
`;

const SearchInner = styled.div`
  background: #fff;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.raised};
  padding: 20px;
`;

const Content = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 40px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 32px 16px 0;
  }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const ResultMeta = styled.div`
  h2 {
    font-size: 22px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.grey90};
  }
  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.grey60};
    margin-top: 2px;
  }
`;

const Cta = styled.section`
  background: ${({ theme }) => theme.colors.grey90};
  color: #fff;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  h2 {
    font-size: 22px;
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
  }
`;

// ---- Page ------------------------------------------------------------------

const SORT_KEYS = SORT_MODES.map((m) => m.key);

export default function AreaAgentsPage({ place, agents, content, canonicalUrl, trail }) {
  const router = useRouter();
  const [sort, setSort] = useState('boneo');

  // Pick up ?sort= from the URL after hydration (server always renders 'boneo'
  // so the first client render matches — no hydration mismatch).
  useEffect(() => {
    const q = router.query.sort;
    if (typeof q === 'string' && SORT_KEYS.includes(q) && q !== sort) setSort(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.sort]);

  const sortedAgents = useMemo(() => sortAgents(agents, sort), [agents, sort]);
  const activeLabel = SORT_MODES.find((m) => m.key === sort)?.label;

  const onSort = (key) => {
    setSort(key);
    router.push({ pathname: router.asPath.split('?')[0], query: key === 'boneo' ? {} : { sort: key } }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  return (
    <Layout>
      <NextSeo
        title={content.title}
        description={content.description}
        canonical={canonicalUrl}
        openGraph={{
          title: content.title,
          description: content.description,
          url: canonicalUrl,
          type: 'website',
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={trail.map((t, i) => ({
          position: i + 1,
          name: t.name,
          item: `${siteConfig.baseUrl}${t.href}`,
        }))}
      />
      {content.faq.length ? (
        <FAQPageJsonLd
          mainEntity={content.faq.map((f) => ({ questionName: f.question, acceptedAnswerText: f.answer }))}
        />
      ) : null}
      <OrganizationJsonLd
        type="Organization"
        id={`${siteConfig.baseUrl}#organization`}
        name={siteConfig.organization.name}
        legalName={siteConfig.organization.legalName}
        url={siteConfig.organization.url}
        logo={siteConfig.organization.logo}
        sameAs={siteConfig.organization.sameAs}
      />
      <AgentsJsonLd place={place} agents={agents} canonicalUrl={canonicalUrl} />

      <Hero>
        <Wide>
          <Breadcrumb trail={trail} />
          <H1>
            {content.heading} <span aria-hidden="true">— rankade {dataUpdatedLabel().split(' ').slice(-1)[0]}</span>
          </H1>
          <Intro>{content.intro}</Intro>
        </Wide>
      </Hero>

      <SearchCard>
        <SearchInner>
          <AreaSearch place={place} />
        </SearchInner>
      </SearchCard>

      <Content>
        <AnswerBox answer={content.answer} updatedLabel={content.updatedLabel} />

        <div>
          <Toolbar>
            <ResultMeta>
              <h2>{nf(agents.length)} mäklare i {place.name}</h2>
              <p>Sorterat efter {activeLabel}</p>
            </ResultMeta>
            <FilterTabs value={sort} onChange={onSort} />
          </Toolbar>
          <div style={{ height: 24 }} />
          <AgentList agents={sortedAgents} activeSort={sort} placeName={place.name} />
        </div>

        <MethodologySection placeName={place.name} />

        <SeoContent place={place} agentCount={agents.length} />

        <Faq faq={content.faq} placeName={place.name} />

        <Cta id="kontakt">
          <div>
            <h2>Osäker på vilken mäklare du ska välja i {place.name}?</h2>
            <p>Berätta om din bostad så matchar vi dig med upp till tre toppmäklare i området – kostnadsfritt.</p>
          </div>
          <a href="#">Matcha mig med mäklare</a>
        </Cta>
      </Content>
    </Layout>
  );
}

// ---- Data ------------------------------------------------------------------

export async function getStaticPaths() {
  // Pre-render the high-value område pages + the län/kommun hubs. Everything
  // else (incl. the /maklare root) is generated on first request via fallback —
  // this is how thousands of long-tail area pages scale without a huge build.
  const paths = [...getAllOmradePaths(), ...getHubPaths()].map((slug) => ({ params: { slug } }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const slug = params?.slug || [];
  const place = resolvePlace(slug);
  if (!place) return { notFound: true };

  const agents = getRankedAgentsForArea(place);
  const trail = buildBreadcrumb(place);
  const canonicalUrl = `${siteConfig.baseUrl}/maklare${slug.length ? `/${slug.join('/')}` : ''}`;

  // Strip the heavy nested `components` debug object before serialising.
  const slimAgents = agents.map(({ components, ...rest }) => rest);

  const content = {
    title: buildTitle(place),
    description: buildMetaDescription(place, agents),
    heading: buildHeading(place),
    intro: buildIntro(place),
    answer: buildAnswer(place, agents),
    faq: buildFaq(place, agents),
    updatedLabel: dataUpdatedLabel(),
  };

  // Only the fields the UI/JSON-LD need (keeps the place object serialisable).
  const slimPlace = {
    level: place.level,
    name: place.name,
    market: place.market || null,
    propertyType: place.propertyType,
  };

  return {
    props: { place: slimPlace, agents: slimAgents, content, canonicalUrl, trail },
    revalidate: 86400,
  };
}
