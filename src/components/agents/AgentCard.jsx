import Link from 'next/link';
import styled from 'styled-components';
import Avatar from './Avatar';
import AgencyLogo from './AgencyLogo';
import StarRating from './StarRating';
import KpiTile from './KpiTile';
import RankBadge from './RankBadge';
import { nf, tkr, overAsking } from '@/lib/format';

const Card = styled.article`
  position: relative;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: 20px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BadgeWrap = styled.div`
  position: absolute;
  top: -13px;
  right: 16px;
`;

const TopRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 12px;
  }
`;

const RankNum = styled.div`
  flex-shrink: 0;
  width: 34px;
  text-align: center;
  font-weight: 700;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.primary};

  span {
    display: block;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.grey40};
  }
`;

const Info = styled.div`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Name = styled.h3`
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.grey70};
`;

const SubLine = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grey60};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-top: 4px;
`;

const ScoreChip = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  padding: 3px 9px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primaryTint};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 13px;
  font-weight: 500;

  b {
    font-size: 14px;
    font-weight: 700;
  }
`;

const KpiRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: stretch;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 4px;
  border-top: 1px solid ${({ theme }) => theme.colors.grey10};
`;

const FinalPrice = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grey60};

  b {
    color: ${({ theme }) => theme.colors.success};
    font-weight: 700;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const Ghost = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grey70};
  background: #fff;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Primary = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: ${({ theme }) => theme.colors.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export default function AgentCard({ agent, activeSort }) {
  const badge = agent.badges && agent.badges[0];
  return (
    <Card aria-label={`${agent.name}, rankad nummer ${agent.rank}`}>
      {badge ? (
        <BadgeWrap>
          <RankBadge tone={badge.tone}>{badge.label}</RankBadge>
        </BadgeWrap>
      ) : null}

      <TopRow>
        <RankNum>
          <span>Nr</span>
          {agent.rank}
        </RankNum>
        <Avatar name={agent.name} size={72} />
        <Info>
          <Name>{agent.name}</Name>
          <SubLine>
            {agent.title} · {agent.agency.name}
          </SubLine>
          <MetaRow>
            <AgencyLogo agency={agent.agency} />
            <StarRating value={agent.rating} count={agent.reviewCount} />
            <ScoreChip title="Boneo-betyg 0–100, sammanvägt av sålda, pris, tid och betyg">
              Boneo-betyg <b>{Math.round(agent.boneoScore)}</b>
            </ScoreChip>
          </MetaRow>
        </Info>
      </TopRow>

      <KpiRow>
        <KpiTile value={nf(agent.soldCount)} unit="st" label="Antal sålda" active={activeSort === 'sold'} />
        <KpiTile value={tkr(agent.pricePerSqm)} unit="tkr" label="Snittpris kvm" active={activeSort === 'price'} />
        <KpiTile value={nf(agent.daysToSell)} unit="dagar" label="Försäljningstid" active={activeSort === 'time'} />
        <KpiTile value={nf(agent.avgViewings)} unit="pers" label="Snitt deltagare/visning" active={activeSort === 'viewings'} />
      </KpiRow>

      <Footer>
        <FinalPrice>
          Slutpris <b>{overAsking(agent.finalToAsk)}</b> mot utgångspris
        </FinalPrice>
        <Actions>
          <Ghost href={`/maklare/profil/${agent.slug}`}>Visa profil</Ghost>
          <Primary href="#kontakt">Kontakta</Primary>
        </Actions>
      </Footer>
    </Card>
  );
}
