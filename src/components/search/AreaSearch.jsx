import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import AGENTS, { AGENCIES } from '@/data/agents';
import LAN from '@/data/areas';

// ---- Search index ----------------------------------------------------------

function buildIndex() {
  const items = [];
  LAN.forEach((lan) => {
    items.push({ type: 'lan', name: lan.name, subtitle: 'Län', href: `/maklare/${lan.slug}` });
    lan.kommuner.forEach((kommun) => {
      items.push({
        type: 'kommun',
        name: kommun.name,
        subtitle: lan.name,
        href: `/maklare/${lan.slug}/${kommun.slug}`,
      });
      kommun.omraden.forEach((omrade) => {
        items.push({
          type: 'omrade',
          name: omrade.name,
          subtitle: `${kommun.name} · ${lan.name}`,
          href: `/maklare/${lan.slug}/${kommun.slug}/${omrade.slug}`,
        });
      });
    });
  });
  AGENTS.forEach((agent) => {
    const agency = AGENCIES[agent.agencyId];
    items.push({
      type: 'agent',
      name: agent.name,
      subtitle: `${agent.title} · ${agency.name}`,
      href: `/maklare/profil/${agent.slug}`,
    });
  });
  return items;
}

function norm(s) {
  return s
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/é/g, 'e')
    .replace(/ü/g, 'u');
}

function runSearch(index, q) {
  if (!q || !q.trim()) return [];
  const nq = norm(q.trim());
  const hits = index.filter((item) => norm(item.name).includes(nq));
  const rank = { omrade: 0, kommun: 1, lan: 2, agent: 3 };
  hits.sort((a, b) => {
    if (rank[a.type] !== rank[b.type]) return rank[a.type] - rank[b.type];
    const as = norm(a.name).startsWith(nq);
    const bs = norm(b.name).startsWith(nq);
    if (as !== bs) return as ? -1 : 1;
    return a.name.localeCompare(b.name, 'sv');
  });
  return hits.slice(0, 8);
}

const TYPE_LABEL = { lan: 'Län', kommun: 'Kommun', omrade: 'Område', agent: 'Mäklare' };
const LISTBOX_ID = 'area-search-listbox';
const INDEX = buildIndex();

// ---- Styles ----------------------------------------------------------------

const Wrap = styled.div`
  position: relative;
  width: 100%;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid ${({ $open, theme }) => ($open ? theme.colors.primary : theme.colors.grey20)};
  border-radius: ${({ $open }) => ($open ? '8px 8px 0 0' : '8px')};
  padding: 0 14px;
  height: 52px;
  transition: border-color 0.15s;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ $open }) => ($open ? 'none' : '0 0 0 3px #f1ebff')};
  }
`;

const SearchIcon = styled.span`
  color: ${({ theme }) => theme.colors.grey40};
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 10px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.grey90};
  background: transparent;

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey40};
  }
`;

const ClearBtn = styled.button`
  border: none;
  background: none;
  padding: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grey40};
  display: flex;
  align-items: center;
  border-radius: 50%;

  &:hover {
    color: ${({ theme }) => theme.colors.grey70};
    background: ${({ theme }) => theme.colors.grey10};
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: ${({ theme }) => theme.shadow.raised};
  list-style: none;
  padding: 4px 0 8px;
  margin: 0;
  max-height: 360px;
  overflow-y: auto;
`;

const GroupLabel = styled.li`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.grey40};
  padding: 8px 16px 4px;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  background: ${({ $active, theme }) => ($active ? theme.colors.primaryTint : 'transparent')};

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.primaryTint : theme.colors.surfaceMuted)};
  }
`;

const TypeBadge = styled.span`
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
  background: ${({ $agent, theme }) => ($agent ? theme.colors.coralTint : theme.colors.primaryTint)};
  color: ${({ $agent, theme }) => ($agent ? theme.colors.coral : theme.colors.primary)};
  white-space: nowrap;
`;

const ItemText = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.grey90};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemSub = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.grey60};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyMsg = styled.li`
  padding: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grey40};
  text-align: center;
`;

// ---- Component -------------------------------------------------------------

export default function AreaSearch({ place }) {
  const router = useRouter();
  const [query, setQuery] = useState(place?.level !== 'root' ? (place?.name ?? '') : '');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const results = useMemo(() => runSearch(INDEX, query), [query]);
  const hasQuery = query.trim().length > 0;
  const isOpen = open && hasQuery;

  const areaHits = results.filter((r) => r.type !== 'agent');
  const agentHits = results.filter((r) => r.type === 'agent');

  useEffect(() => {
    function onPointerDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  function navigate(href) {
    setOpen(false);
    router.push(href);
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeIdx >= 0 && results[activeIdx]) navigate(results[activeIdx].href);
      else if (results.length === 1) navigate(results[0].href);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIdx(-1);
    }
  }

  return (
    <Wrap ref={wrapRef} aria-label="Sök mäklare efter område">
      <InputRow $open={isOpen}>
        <SearchIcon aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="2" />
            <path d="M13 13L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </SearchIcon>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Sök område eller mäklare…"
          value={query}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={LISTBOX_ID}
          aria-autocomplete="list"
          aria-label="Sök område eller mäklare"
          aria-activedescendant={activeIdx >= 0 ? `asi-${activeIdx}` : undefined}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIdx(-1);
          }}
          onFocus={() => {
            if (hasQuery) setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        {hasQuery && (
          <ClearBtn
            type="button"
            aria-label="Rensa sökning"
            onPointerDown={(e) => {
              e.preventDefault();
              setQuery('');
              setOpen(false);
              setActiveIdx(-1);
              inputRef.current?.focus();
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M12 2L2 12M2 2l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </ClearBtn>
        )}
      </InputRow>

      {isOpen && (
        <Dropdown id={LISTBOX_ID} role="listbox" aria-label="Sökresultat">
          {results.length === 0 && <EmptyMsg>Inga resultat för &quot;{query}&quot;</EmptyMsg>}

          {areaHits.length > 0 && (
            <>
              <GroupLabel role="presentation">Områden</GroupLabel>
              {areaHits.map((item, i) => (
                <Item
                  key={item.href}
                  id={`asi-${i}`}
                  role="option"
                  aria-selected={activeIdx === i}
                  $active={activeIdx === i}
                  onPointerDown={() => navigate(item.href)}
                >
                  <TypeBadge>{TYPE_LABEL[item.type]}</TypeBadge>
                  <ItemText>
                    <ItemName>{item.name}</ItemName>
                    <ItemSub>{item.subtitle}</ItemSub>
                  </ItemText>
                </Item>
              ))}
            </>
          )}

          {agentHits.length > 0 && (
            <>
              <GroupLabel role="presentation">Mäklare</GroupLabel>
              {agentHits.map((item, i) => {
                const gi = areaHits.length + i;
                return (
                  <Item
                    key={item.href}
                    id={`asi-${gi}`}
                    role="option"
                    aria-selected={activeIdx === gi}
                    $active={activeIdx === gi}
                    onPointerDown={() => navigate(item.href)}
                  >
                    <TypeBadge $agent>{TYPE_LABEL.agent}</TypeBadge>
                    <ItemText>
                      <ItemName>{item.name}</ItemName>
                      <ItemSub>{item.subtitle}</ItemSub>
                    </ItemText>
                  </Item>
                );
              })}
            </>
          )}
        </Dropdown>
      )}
    </Wrap>
  );
}
