import styled from 'styled-components';
import { SORT_MODES } from '@/lib/ranking';

const Bar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  appearance: none;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.grey20)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : '#fff')};
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.colors.grey70)};
  padding: 9px 16px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme, $active }) => ($active ? '#fff' : theme.colors.primary)};
  }
`;

export default function FilterTabs({ value, onChange }) {
  return (
    <Bar role="group" aria-label="Sortera mäklare">
      {SORT_MODES.map((mode) => (
        <Tab
          key={mode.key}
          type="button"
          $active={value === mode.key}
          aria-pressed={value === mode.key}
          onClick={() => onChange(mode.key)}
        >
          {mode.label}
        </Tab>
      ))}
    </Bar>
  );
}
