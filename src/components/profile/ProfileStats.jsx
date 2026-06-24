import styled from 'styled-components';
import { nf } from '@/lib/format';

// "Statistik senaste 12 månader" — aggregate stats broken down by property type
// (Figma node 6519:5948).
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 18px;
  line-height: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.grey70};

  span {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.grey40};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 48px;
  align-content: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 8px 0;
  }
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 0;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 6px 0;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.grey70};

  ${({ $head }) =>
    $head
      ? 'font-weight: 700;'
      : ''}

  .muted {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.grey40};
  }
`;

function StatBlock({ title, titleValue, rows }) {
  return (
    <Block>
      <Row $head>
        <span>{title}</span>
        {titleValue ? <span>{titleValue}</span> : null}
      </Row>
      {rows.map((r) => (
        <Row key={r.label}>
          <span>{r.label}</span>
          <span>{r.value}</span>
        </Row>
      ))}
    </Block>
  );
}

const kr = (v) => `${nf(v)} kr`;

export default function ProfileStats({ profile }) {
  const { totalSold, byTypeSold, salePriceMedian, pricePerSqm, daysToSell } = profile;
  return (
    <Section>
      <Title>
        Statistik senaste 12 månader <span>(baserat på försäljningar i alla områden)</span>
      </Title>
      <Grid>
        <StatBlock
          title="Antal sålda bostäder"
          titleValue={`${nf(totalSold)} st`}
          rows={byTypeSold.map((r) => ({ label: r.type, value: `${nf(r.value)} st` }))}
        />
        <StatBlock
          title={
            <>
              Försäljningspris <span className="muted">(median)</span>
            </>
          }
          titleValue={kr(salePriceMedian.total)}
          rows={salePriceMedian.rows.map((r) => ({ label: r.type, value: kr(r.value) }))}
        />
        <StatBlock
          title="Snittpris kvm"
          rows={pricePerSqm.rows.map((r) => ({ label: r.type, value: kr(r.value) }))}
        />
        <StatBlock
          title={
            <>
              Försäljningstid <span className="muted">(median)</span>
            </>
          }
          titleValue={`${nf(daysToSell.median)} dagar`}
          rows={daysToSell.rows.map((r) => ({ label: r.type, value: `${nf(r.value)} dagar` }))}
        />
      </Grid>
    </Section>
  );
}
