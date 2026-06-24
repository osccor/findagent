import styled from 'styled-components';

// The coral pill badge from the Figma ("Flest sålda"), generalised to tones.
const TONES = {
  coral: { bg: '#FF7269', fg: '#fff' },
  primary: { bg: '#8046FF', fg: '#fff' },
  success: { bg: '#1F9D6B', fg: '#fff' },
  gold: { bg: '#F5A623', fg: '#1b1300' },
};

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  background: ${({ $tone }) => (TONES[$tone] || TONES.coral).bg};
  color: ${({ $tone }) => (TONES[$tone] || TONES.coral).fg};
`;

export default function RankBadge({ tone = 'coral', children }) {
  return <Pill $tone={tone}>{children}</Pill>;
}
