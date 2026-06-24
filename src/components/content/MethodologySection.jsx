import styled from 'styled-components';
import { RANKING_FACTORS, MIN_SALES_TO_RANK } from '@/lib/ranking';

// "Så rankar vi mäklare" — transparency block. Doubles as an E-E-A-T / trust
// signal and gives AI engines an explicit, citable methodology.
const Section = styled.section`
  background: ${({ theme }) => theme.colors.primaryTint};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 24px 20px;
  }
`;

const Heading = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.grey90};
  margin-bottom: 8px;
`;

const Lead = styled.p`
  font-size: 15px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.grey70};
  max-width: 720px;
  margin-bottom: 24px;
`;

const Factors = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const Factor = styled.li`
  background: #fff;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px 18px;

  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 6px;
  }
  h3 {
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.grey90};
  }
  .weight {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }
  p {
    font-size: 14px;
    line-height: 21px;
    color: ${({ theme }) => theme.colors.grey60};
  }
`;

const Bar = styled.div`
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.grey10};
  margin: 8px 0 10px;
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    width: ${({ $pct }) => $pct}%;
    background: ${({ theme }) => theme.colors.primary};
  }
`;

const Note = styled.p`
  margin-top: 20px;
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.grey70};
`;

export default function MethodologySection({ placeName }) {
  return (
    <Section id="metodik">
      <Heading>Så rankar vi mäklare{placeName ? ` i ${placeName}` : ''}</Heading>
      <Lead>
        Boneo-betyget är ett sammanvägt mått från 0 till 100 som räknas ut för varje mäklare i ett specifikt
        område. Varje faktor jämförs mot övriga mäklare i samma område, så betyget mäter lokal prestation –
        inte hur stor mäklarkedjan är eller hur mycket de annonserar.
      </Lead>
      <Factors>
        {RANKING_FACTORS.map((f) => (
          <Factor key={f.key}>
            <div className="head">
              <h3>{f.label}</h3>
              <span className="weight">{Math.round(f.weight * 100)} %</span>
            </div>
            <Bar $pct={Math.round(f.weight * 100)}>
              <span />
            </Bar>
            <p>{f.description}</p>
          </Factor>
        ))}
      </Factors>
      <Note>
        <strong>Tröskel:</strong> en mäklare måste ha sålt minst {MIN_SALES_TO_RANK} bostäder i området de
        senaste 12 månaderna för att rankas – så att enstaka affärer inte snedvrider listan. Vid lika betyg
        avgör antal sålda bostäder. Statistiken bygger på offentliga försäljningsdata och uppdateras varje
        månad.
      </Note>
    </Section>
  );
}
