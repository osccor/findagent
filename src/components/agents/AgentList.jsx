import { useState } from 'react';
import styled from 'styled-components';
import AgentCard from './AgentCard';

const List = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 24px;
  counter-reset: agent;
`;

const Item = styled.li`
  list-style: none;
`;

const MoreWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
`;

const MoreButton = styled.button`
  appearance: none;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: #fff;
  color: ${({ theme }) => theme.colors.primary};
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 15px;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryTint};
  }
`;

const Empty = styled.p`
  padding: 32px;
  text-align: center;
  color: ${({ theme }) => theme.colors.grey60};
  background: #fff;
  border: 1px dashed ${({ theme }) => theme.colors.grey20};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export default function AgentList({ agents, activeSort, placeName, initialCount = 6 }) {
  const [showAll, setShowAll] = useState(false);

  if (!agents.length) {
    return (
      <Empty>
        Vi har ännu inte tillräckligt med försäljningsdata för att ranka mäklare i {placeName}. Prova ett
        närliggande område.
      </Empty>
    );
  }

  const visible = showAll ? agents : agents.slice(0, initialCount);
  const hiddenCount = agents.length - visible.length;

  return (
    <>
      {/* Ordered list = an explicit ranking signal for crawlers and AI engines. */}
      <List>
        {visible.map((agent) => (
          <Item key={agent.agentId}>
            <AgentCard agent={agent} activeSort={activeSort} placeName={placeName} />
          </Item>
        ))}
      </List>

      {hiddenCount > 0 ? (
        <MoreWrap>
          <MoreButton type="button" onClick={() => setShowAll(true)}>
            Visa fler mäklare ({hiddenCount})
          </MoreButton>
        </MoreWrap>
      ) : null}
    </>
  );
}
