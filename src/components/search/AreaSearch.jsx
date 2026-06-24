import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import LAN from '@/data/areas';

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
  gap: 12px;
  align-items: end;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.grey60};
`;

const Select = styled.select`
  appearance: none;
  width: 100%;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  background: #fff;
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grey90};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Submit = styled.button`
  padding: 12px 22px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  height: 46px;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-column: 1 / -1;
  }
`;

export default function AreaSearch({ place }) {
  const router = useRouter();
  const [lanSlug, setLanSlug] = useState(place?.lan?.slug || '');
  const [kommunSlug, setKommunSlug] = useState(place?.kommun?.slug || '');
  const [omradeSlug, setOmradeSlug] = useState(place?.omrade?.slug || '');

  const lan = LAN.find((l) => l.slug === lanSlug);
  const kommun = lan?.kommuner.find((k) => k.slug === kommunSlug);

  const onSubmit = (e) => {
    e.preventDefault();
    const path = [lanSlug, kommunSlug, omradeSlug].filter(Boolean);
    router.push(path.length ? `/maklare/${path.join('/')}` : '/maklare');
  };

  return (
    <Form onSubmit={onSubmit} aria-label="Sök mäklare efter område">
      <Field>
        Län
        <Select
          value={lanSlug}
          onChange={(e) => {
            setLanSlug(e.target.value);
            setKommunSlug('');
            setOmradeSlug('');
          }}
        >
          <option value="">Välj län</option>
          {LAN.map((l) => (
            <option key={l.slug} value={l.slug}>
              {l.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field>
        Kommun
        <Select
          value={kommunSlug}
          disabled={!lan}
          onChange={(e) => {
            setKommunSlug(e.target.value);
            setOmradeSlug('');
          }}
        >
          <option value="">Välj kommun</option>
          {lan?.kommuner.map((k) => (
            <option key={k.slug} value={k.slug}>
              {k.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field>
        Område
        <Select value={omradeSlug} disabled={!kommun} onChange={(e) => setOmradeSlug(e.target.value)}>
          <option value="">Alla områden</option>
          {kommun?.omraden.map((o) => (
            <option key={o.slug} value={o.slug}>
              {o.name}
            </option>
          ))}
        </Select>
      </Field>

      <Submit type="submit">Visa mäklare</Submit>
    </Form>
  );
}
