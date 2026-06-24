import styled from 'styled-components';

// Text wordmark stand-in for the agency logo (the Figma shows a "Bostada" logo).
const Wordmark = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.4px;
  color: ${({ $color }) => $color};
`;

const Dot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export default function AgencyLogo({ agency }) {
  if (!agency) return null;
  return (
    <Wordmark $color={agency.color}>
      <Dot $color={agency.color} aria-hidden="true" />
      {agency.name}
    </Wordmark>
  );
}
