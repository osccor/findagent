import Link from 'next/link';
import styled from 'styled-components';
import siteConfig from '@/components/seo/siteConfig';
import { longDate } from '@/lib/format';

const Wrap = styled.footer`
  background: ${({ theme }) => theme.colors.grey90};
  color: #d7d7d7;
  margin-top: 64px;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 40px 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 40px 20px 28px;
  }
`;

const Cols = styled.div`
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Brand = styled.div`
  h2 {
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  p {
    font-size: 14px;
    line-height: 22px;
    color: #aeaeae;
    max-width: 260px;
  }
`;

const Col = styled.div`
  h3 {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  a {
    display: block;
    font-size: 14px;
    color: #c7c7c7;
    padding: 4px 0;
  }
  a:hover {
    color: #fff;
  }
`;

const Bottom = styled.div`
  margin-top: 36px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: #9a9a9a;
`;

export default function Footer() {
  return (
    <Wrap>
      <Inner>
        <Cols>
          <Brand>
            <h2>Boneo</h2>
            <p>Hitta och jämför Sveriges bästa mäklare – baserat på faktisk försäljningsstatistik, inte reklam.</p>
          </Brand>
          <Col>
            <h3>Matcha mäklare</h3>
            <Link href="/maklare">Alla områden</Link>
            <Link href="/maklare/stockholm">Stockholm</Link>
            <Link href="/maklare/vastra-gotaland/goteborg">Göteborg</Link>
            <Link href="/maklare/skane/malmo">Malmö</Link>
          </Col>
          <Col>
            <h3>För säljare</h3>
            <a href="#">Värdera bostad</a>
            <a href="#">Sälja bostad</a>
            <a href="#">Så fungerar Boneo</a>
          </Col>
          <Col>
            <h3>Om</h3>
            <a href="#metodik">Så rankar vi mäklare</a>
            <a href="#">Om Boneo</a>
            <a href="#">Kontakt</a>
          </Col>
        </Cols>
        <Bottom>
          <span>© {new Date().getFullYear()} {siteConfig.organization.legalName}</span>
          <span>Rankingdata uppdaterad {longDate(siteConfig.dataUpdatedAt)}</span>
        </Bottom>
      </Inner>
    </Wrap>
  );
}
