import styled from 'styled-components';
import { hashString } from '@/lib/slugify';

// Initials avatar — no external image dependency, deterministic colour per name.
// In production swap for the agent's real photo (the Figma uses round 100px photos).
const PALETTE = ['#8046FF', '#0E8A7A', '#1C2B4A', '#FF7269', '#1F9D6B', '#E8852B', '#3B6FE0', '#B5429A'];

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

const Circle = styled.div`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ $color }) => $color};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: ${({ $size }) => Math.round($size * 0.36)}px;
  letter-spacing: -0.5px;
  flex-shrink: 0;
  user-select: none;
`;

export default function Avatar({ name, size = 100 }) {
  const color = PALETTE[hashString(name) % PALETTE.length];
  return (
    <Circle $size={size} $color={color} aria-hidden="true">
      {initials(name)}
    </Circle>
  );
}
