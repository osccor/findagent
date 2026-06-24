import Link from 'next/link';
import styled from 'styled-components';

// "Aktiv i dessa områden" — chips linking to each area page where the agent is
// ranked, showing their position. Internal links that help users and crawlers.
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  h2 {
    font-size: 18px;
    line-height: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.grey70};
  }
`;

const Chips = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Chip = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grey70};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  b {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`;

export default function AreaRankings({ rankings }) {
  if (!rankings?.length) return null;
  return (
    <Section>
      <h2>Aktiv i dessa områden</h2>
      <Chips>
        {rankings.map((r) => (
          <li key={r.href}>
            <Chip href={r.href}>
              {r.name} <b>#{r.rank}</b>
            </Chip>
          </li>
        ))}
      </Chips>
    </Section>
  );
}
