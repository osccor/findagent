import styled from 'styled-components';
import { rating1, nf } from '@/lib/format';

const Wrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grey70};
`;

const Star = styled.span`
  color: ${({ theme }) => theme.colors.gold};
  font-size: 15px;
  line-height: 1;
`;

const Count = styled.span`
  color: ${({ theme }) => theme.colors.grey60};
`;

export default function StarRating({ value, count }) {
  return (
    <Wrap aria-label={`Betyg ${rating1(value)} av 5 baserat på ${count} omdömen`}>
      <Star aria-hidden="true">★</Star>
      <strong>{rating1(value)}</strong>
      <Count>({nf(count)})</Count>
    </Wrap>
  );
}
