import styled from 'styled-components';

// The grey KPI tile from the Figma Agent Card (Antal sålda / Snittpris kvm /
// Försäljningstid). Highlights when it is the metric the list is sorted by.
const Tile = styled.div`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryTint : theme.colors.surfaceMuted)};
  box-shadow: ${({ theme, $active }) => ($active ? `inset 0 0 0 1.5px ${theme.colors.primary}` : 'none')};
  transition: background 0.15s ease, box-shadow 0.15s ease;
`;

const Value = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  color: ${({ theme }) => theme.colors.grey70};
  white-space: nowrap;
`;

const Number = styled.span`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
`;

const Unit = styled.span`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
`;

const Label = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export default function KpiTile({ value, unit, label, active = false }) {
  return (
    <Tile $active={active} aria-current={active ? 'true' : undefined}>
      <Value>
        <Number>{value}</Number>
        {unit ? <Unit>{unit}</Unit> : null}
      </Value>
      <Label>{label}</Label>
    </Tile>
  );
}
