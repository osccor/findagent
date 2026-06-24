// "Boneo Score" — the composite ranking behind the "Boneo rankad" filter.
//
// Each agent gets a 0–100 score per area, computed from five components that are
// min–max normalised against the other agents active in the SAME area. That makes
// the score locally fair: being #1 in Vasastan means beating Vasastan's peers, not
// the whole country. The weights and method are shown to users (MethodologySection)
// and emitted in JSON-LD so search/AI engines can cite the methodology.

export const RANKING_FACTORS = [
  {
    key: 'volume',
    label: 'Försäljningsvolym',
    weight: 0.3,
    description:
      'Antal bostäder mäklaren sålt i området de senaste 12 månaderna. Mäter bevisad, lokal erfarenhet.',
  },
  {
    key: 'price',
    label: 'Prisprestation',
    weight: 0.25,
    description:
      'Hur väl mäklaren får betalt: slutpris jämfört med utgångspris, samt snittpris per kvm mot områdets median.',
  },
  {
    key: 'time',
    label: 'Försäljningstid',
    weight: 0.2,
    description: 'Antal dagar från publicering till såld bostad. Kortare tid ger högre poäng.',
  },
  {
    key: 'rating',
    label: 'Kundbetyg',
    weight: 0.15,
    description: 'Snittbetyg från säljare, viktat mot antal recensioner så enstaka omdömen inte slår igenom.',
  },
  {
    key: 'relevance',
    label: 'Relevans & aktualitet',
    weight: 0.1,
    description: 'Hur stor andel av försäljningarna som matchar områdets bostadstyp, och hur nyligen mäklaren var aktiv.',
  },
];

export const WEIGHTS = RANKING_FACTORS.reduce((acc, f) => ({ ...acc, [f.key]: f.weight }), {});

// Agents must have closed at least this many sales in the area to be ranked,
// so a single lucky deal can't top the list.
export const MIN_SALES_TO_RANK = 3;

function normalize(value, min, max, direction = 1) {
  if (max === min) return 0.5; // everyone equal on this metric
  const t = (value - min) / (max - min);
  return direction === 1 ? t : 1 - t;
}

function rangeOf(items, pick) {
  const vals = items.map(pick);
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

// Rating confidence: blends the score with how many reviews back it up.
function ratingConfidence(m) {
  const confidence = Math.min(1, m.reviewCount / 100);
  return m.rating * (0.85 + 0.15 * confidence);
}

// Takes raw per-area metrics for the eligible agents, returns them scored,
// sorted by Boneo Score (desc), with rank, percentile and badges attached.
export function rankAgents(metrics) {
  const eligible = metrics.filter((m) => m.soldCount >= MIN_SALES_TO_RANK);
  if (!eligible.length) return [];

  const ranges = {
    sold: rangeOf(eligible, (m) => m.soldCount),
    finalToAsk: rangeOf(eligible, (m) => m.finalToAsk),
    pricePerSqm: rangeOf(eligible, (m) => m.pricePerSqm),
    days: rangeOf(eligible, (m) => m.daysToSell),
    rating: rangeOf(eligible, ratingConfidence),
    typeMatch: rangeOf(eligible, (m) => m.typeMatchShare),
    recency: rangeOf(eligible, (m) => m.recencyDays),
  };

  const scored = eligible.map((m) => {
    const nSold = normalize(m.soldCount, ranges.sold.min, ranges.sold.max, 1);
    const nFinal = normalize(m.finalToAsk, ranges.finalToAsk.min, ranges.finalToAsk.max, 1);
    const nPrice = normalize(m.pricePerSqm, ranges.pricePerSqm.min, ranges.pricePerSqm.max, 1);
    const nDays = normalize(m.daysToSell, ranges.days.min, ranges.days.max, -1);
    const nRating = normalize(ratingConfidence(m), ranges.rating.min, ranges.rating.max, 1);
    const nType = normalize(m.typeMatchShare, ranges.typeMatch.min, ranges.typeMatch.max, 1);
    const nRecency = normalize(m.recencyDays, ranges.recency.min, ranges.recency.max, -1);

    const components = {
      volume: nSold,
      price: 0.6 * nFinal + 0.4 * nPrice,
      time: nDays,
      rating: nRating,
      relevance: 0.6 * nType + 0.4 * nRecency,
    };

    const boneoScore =
      100 *
      (WEIGHTS.volume * components.volume +
        WEIGHTS.price * components.price +
        WEIGHTS.time * components.time +
        WEIGHTS.rating * components.rating +
        WEIGHTS.relevance * components.relevance);

    return { ...m, components, boneoScore: Math.round(boneoScore * 10) / 10 };
  });

  // Canonical order = Boneo Score. Deterministic tie-breakers.
  scored.sort((a, b) => b.boneoScore - a.boneoScore || b.soldCount - a.soldCount || a.name.localeCompare(b.name, 'sv'));

  const topSoldId = [...scored].sort((a, b) => b.soldCount - a.soldCount)[0]?.agentId;
  const fastestId = [...scored].sort((a, b) => a.daysToSell - b.daysToSell)[0]?.agentId;
  const bestPaidId = [...scored].sort((a, b) => b.finalToAsk - a.finalToAsk)[0]?.agentId;

  const n = scored.length;
  return scored.map((m, i) => {
    const rank = i + 1;
    const badges = [];
    if (rank === 1) badges.push({ label: 'Högst Boneo-betyg', tone: 'primary' });
    if (m.agentId === topSoldId) badges.push({ label: 'Flest sålda', tone: 'coral' });
    if (m.agentId === fastestId) badges.push({ label: 'Snabbast sålt', tone: 'success' });
    if (m.agentId === bestPaidId) badges.push({ label: 'Bäst betalt', tone: 'gold' });
    return {
      ...m,
      rank,
      percentile: Math.round((1 - i / Math.max(1, n)) * 100),
      badges,
    };
  });
}

export const SORT_MODES = [
  { key: 'boneo', label: 'Boneo rankad' },
  { key: 'sold', label: 'Flest sålda' },
  { key: 'price', label: 'Snittpris kvm' },
  { key: 'time', label: 'Försäljningstid' },
];

// Re-orders an already-ranked list for the active filter tab. Pure + stable —
// no regeneration, so client sorting never causes hydration drift.
export function sortAgents(agents, mode) {
  const copy = [...agents];
  switch (mode) {
    case 'sold':
      copy.sort((a, b) => b.soldCount - a.soldCount || b.boneoScore - a.boneoScore);
      break;
    case 'price':
      copy.sort((a, b) => b.pricePerSqm - a.pricePerSqm || b.boneoScore - a.boneoScore);
      break;
    case 'time':
      copy.sort((a, b) => a.daysToSell - b.daysToSell || b.boneoScore - a.boneoScore);
      break;
    case 'boneo':
    default:
      copy.sort((a, b) => a.rank - b.rank);
      break;
  }
  return copy;
}
