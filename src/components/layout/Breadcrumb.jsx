import Link from 'next/link';
import styled from 'styled-components';

// Visual breadcrumb. The machine-readable version is emitted via next-seo's
// BreadcrumbJsonLd on the page.
const Nav = styled.nav`
  font-size: 14px;
`;

const Trail = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`;

const Crumb = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme, $current }) => ($current ? theme.colors.grey90 : 'rgba(255,255,255,0.8)')};

  a:hover {
    text-decoration: underline;
  }

  &::after {
    content: '${({ $last }) => ($last ? '' : '›')}';
    color: rgba(255, 255, 255, 0.5);
  }
`;

export default function Breadcrumb({ trail, onDark = true }) {
  return (
    <Nav aria-label="Brödsmulor">
      <Trail>
        {trail.map((item, i) => {
          const last = i === trail.length - 1;
          return (
            <Crumb
              key={item.href}
              $last={last}
              $current={last}
              style={!onDark ? { color: last ? '#262626' : '#8046FF' } : undefined}
            >
              {last ? <span aria-current="page">{item.name}</span> : <Link href={item.href}>{item.name}</Link>}
            </Crumb>
          );
        })}
      </Trail>
    </Nav>
  );
}
