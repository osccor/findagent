// Deterministic Swedish number formatting (manual, not toLocaleString) so server
// and client render byte-identical output — avoids React hydration mismatches.

const NBSP = ' ';

// Integer with non-breaking-space thousands separator: 1234567 → "1 234 567".
export function nf(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

// SEK → "tkr" string with one decimal and comma: 104500 → "104,5".
export function tkr(valueSek) {
  const v = valueSek / 1000;
  const [int, dec] = v.toFixed(1).split('.');
  return `${nf(Number(int))},${dec}`;
}

// 1.05 → "+5 %", 0.98 → "−2 %" (over/under asking price).
export function overAsking(ratio) {
  const pct = Math.round((ratio - 1) * 100);
  if (pct === 0) return '±0 %';
  const sign = pct > 0 ? '+' : '−';
  return `${sign}${Math.abs(pct)}${NBSP}%`;
}

// 4.85 → "4,9"
export function rating1(n) {
  return n.toFixed(1).replace('.', ',');
}

// ISO date → "1 juni 2026"
const MONTHS = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
export function longDate(iso) {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
