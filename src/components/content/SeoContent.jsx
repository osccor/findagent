import styled from 'styled-components';
import { nf, tkr, overAsking } from '@/lib/format';

// Long-form, area-specific editorial + a local market stats table. Gives the
// page unique, factual content (good for classic SEO) in a structure that AI
// engines can read (question headings, a real <table> of stats).
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Block = styled.div`
  h2 {
    font-size: 22px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.grey90};
    margin-bottom: 12px;
  }
  p {
    font-size: 16px;
    line-height: 27px;
    color: ${({ theme }) => theme.colors.grey70};
    margin-bottom: 12px;
  }
  ul {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  li {
    position: relative;
    padding-left: 26px;
    font-size: 16px;
    line-height: 25px;
    color: ${({ theme }) => theme.colors.grey70};
  }
  li::before {
    content: '✓';
    position: absolute;
    left: 0;
    top: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;

  caption {
    text-align: left;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.grey60};
    padding: 0 0 10px;
  }
  th,
  td {
    text-align: left;
    padding: 14px 18px;
    font-size: 15px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.grey10};
  }
  th {
    color: ${({ theme }) => theme.colors.grey60};
    font-weight: 500;
  }
  td {
    color: ${({ theme }) => theme.colors.grey90};
    font-weight: 700;
    text-align: right;
  }
  tr:last-child th,
  tr:last-child td {
    border-bottom: none;
  }
`;

export default function SeoContent({ place, agentCount }) {
  const { name, market, propertyType } = place;
  return (
    <Section>
      <Block>
        <h2>Att välja mäklare i {name}</h2>
        <p>
          Att sälja sin bostad är för de flesta den största affären i livet, och valet av mäklare påverkar
          både slutpriset och hur smidig försäljningen blir. I {name} finns {agentCount > 0 ? `${agentCount} ` : ''}
          mäklare som varit aktiva det senaste året – men deras resultat skiljer sig åt. På den här sidan
          jämför vi dem sida vid sida utifrån faktiska siffror i stället för marknadsföring.
        </p>
        <p>
          En mäklare som ofta säljer {propertyType} i just {name} känner till köparna, prisnivåerna och vad
          som driver upp budgivningen i området. Lokal erfarenhet är därför en tung faktor i vår ranking,
          tillsammans med vilket pris mäklaren historiskt fått ut och hur nöjda tidigare säljare är.
        </p>
      </Block>

      {market ? (
        <Block>
          <h2>Bostadsmarknaden i {name} just nu</h2>
          <Table>
            <caption>Snittsiffror för {name}, senaste 12 månaderna.</caption>
            <tbody>
              <tr>
                <th scope="row">Medianpris per kvadratmeter</th>
                <td>{tkr(market.medianPricePerSqm)} tkr</td>
              </tr>
              <tr>
                <th scope="row">Snittförsäljningstid</th>
                <td>{nf(market.avgDaysToSell)} dagar</td>
              </tr>
              <tr>
                <th scope="row">Slutpris mot utgångspris</th>
                <td>{overAsking(market.avgFinalToAsk)}</td>
              </tr>
              <tr>
                <th scope="row">Antal sålda bostäder</th>
                <td>{nf(market.salesLast12m)} st</td>
              </tr>
            </tbody>
          </Table>
        </Block>
      ) : null}

      <Block>
        <h2>Vad kännetecknar en bra mäklare i {name}?</h2>
        <ul>
          <li>
            <strong>Många avslut i området</strong> – en mäklare med hög försäljningsvolym i {name} har ett
            etablerat köparnätverk och vet vad bostäderna är värda.
          </li>
          <li>
            <strong>Får ut ett bra slutpris</strong> – titta på hur mycket över utgångspris mäklarens
            objekt brukar säljas för, inte bara på arvodet.
          </li>
          <li>
            <strong>Kort försäljningstid</strong> – snabba affärer tyder på rätt prissättning och en
            effektiv process.
          </li>
          <li>
            <strong>Goda omdömen</strong> – nöjda tidigare säljare är den bästa indikatorn på hur ett
            samarbete kommer att fungera.
          </li>
        </ul>
      </Block>
    </Section>
  );
}
