import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

// Ported from the Figma Navbar (node I6316:4577) — DM Sans, purple active
// underline, white bar with a soft bottom shadow.
const NAV_ITEMS = [
  { label: 'Sök bostad', href: '#' },
  { label: 'Värdera bostad', href: '#' },
  { label: 'Matcha din bostad', href: '#' },
  { label: 'Matcha mäklare', href: '/maklare', active: true },
  { label: 'För säljare', href: '#' },
  { label: 'För köpare', href: '#' },
];

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey10};
  box-shadow: ${({ theme }) => theme.shadow.nav};
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 40px;
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 14px 20px;
  }
`;

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 24px;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const Menu = styled.nav`
  display: flex;
  gap: 28px;
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 4px;
    background: #fff;
    padding: 12px 20px 20px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.grey10};
    box-shadow: ${({ theme }) => theme.shadow.nav};
  }
`;

const Item = styled(Link)`
  position: relative;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grey90};
  padding: 6px 2px;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    background: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Burger = styled.button`
  display: none;
  margin-left: auto;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.grey90};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <Bar>
      <Inner>
        <Logo href="/">Boneo</Logo>
        <Menu $open={open}>
          {NAV_ITEMS.map((item) => (
            <Item key={item.label} href={item.href} $active={item.active} aria-current={item.active ? 'page' : undefined}>
              {item.label}
            </Item>
          ))}
        </Menu>
        <Burger type="button" aria-label="Meny" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          ☰
        </Burger>
      </Inner>
    </Bar>
  );
}
