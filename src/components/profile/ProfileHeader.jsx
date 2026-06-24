import styled from 'styled-components';
import Avatar from '@/components/agents/Avatar';
import AgencyLogo from '@/components/agents/AgencyLogo';
import StarRating from '@/components/agents/StarRating';
import { nf, tkr } from '@/lib/format';

// Top of the profile card (Figma node 6519:5923): big avatar + name + agency +
// logo on the left, three summary KPI rows on the right.
const Top = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const AgentInfo = styled.div`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const InfoFrame = styled.div`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Name = styled.h1`
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.grey70};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 26px;
    line-height: 32px;
  }
`;

const Agency = styled.p`
  font-size: 18px;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.grey60};
  margin-top: 2px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
`;

const Primary = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 11px 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 600;
  font-size: 15px;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const Ghost = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 11px 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  color: ${({ theme }) => theme.colors.grey70};
  font-weight: 600;
  font-size: 15px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SecondBlock = styled.div`
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const Kpi = styled.div`
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border-radius: ${({ theme }) => theme.radius.lg};
  height: 56px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;

  .label {
    flex: 1 0 0;
    min-width: 0;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
  .value {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.grey70};
    white-space: nowrap;
  }
  .num {
    font-size: 20px;
    line-height: 24px;
  }
  .unit {
    font-size: 14px;
    line-height: 20px;
  }
`;

function KpiRow({ label, value, unit }) {
  return (
    <Kpi>
      <span className="label">{label}</span>
      <span className="value">
        <span className="num">{value}</span>
        <span className="unit">{unit}</span>
      </span>
    </Kpi>
  );
}

export default function ProfileHeader({ agent }) {
  const { summary } = agent.profile;
  return (
    <Top>
      <AgentInfo>
        <Avatar name={agent.name} size={150} />
        <InfoFrame>
          <div>
            <Name>{agent.name}</Name>
            <Agency>
              {agent.title} · {agent.agency.name}
            </Agency>
          </div>
          <AgencyLogo agency={agent.agency} />
          <StarRating value={agent.rating} count={agent.reviewCount} />
          <Actions>
            <Primary href="#kontakt">Kontakta mäklare</Primary>
            <Ghost href="#kontakt">Begär värdering</Ghost>
          </Actions>
        </InfoFrame>
      </AgentInfo>

      <SecondBlock>
        <KpiRow label="Antal sålda" value={nf(summary.sold)} unit="st" />
        <KpiRow label="Snittpris kvm" value={tkr(summary.pricePerSqm)} unit="tkr" />
        <KpiRow label="Försäljningstid" value={nf(summary.daysToSell)} unit="dagar" />
      </SecondBlock>
    </Top>
  );
}
