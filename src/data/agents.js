// Mock agent pool + agencies + deterministic per-area stat generation.
//
// In production: replace getEligibleAgents/buildAgentMetrics with a call to
// src/services/api.js (fetchApi) that returns each agent's real, audited sales
// stats for the requested area. The ranking math (src/lib/ranking.js) stays.

import { seededRng, slugify } from '@/lib/slugify';
import { findKommun } from '@/data/areas';

export const AGENCIES = {
  bostada: { name: 'Bostada', color: '#8046FF' },
  nordhem: { name: 'Nordhem Mäkleri', color: '#0E8A7A' },
  lagerlof: { name: 'Lagerlöf & Partner', color: '#1C2B4A' },
  vy: { name: 'Vy Fastighetsförmedling', color: '#FF7269' },
  hemvik: { name: 'Hemvik Mäkleri', color: '#1F9D6B' },
  stadsnara: { name: 'Stadsnära Mäklarbyrå', color: '#E8852B' },
};

// skill (≈0.8–1.25) biases generated stats so rankings feel earned, not random.
const AGENTS = [
  { id: 'a01', name: 'Sofia Lindqvist', title: 'Fastighetsmäklare', agencyId: 'bostada', skill: 1.22, baseRating: 4.9, reviewCount: 184, regions: ['stockholm/stockholm', 'stockholm/solna'] },
  { id: 'a02', name: 'Johan Berg', title: 'Reg. fastighetsmäklare', agencyId: 'nordhem', skill: 1.18, baseRating: 4.8, reviewCount: 142, regions: ['stockholm/stockholm', 'stockholm/nacka'] },
  { id: 'a03', name: 'Amira Hassan', title: 'Fastighetsmäklare', agencyId: 'lagerlof', skill: 1.12, baseRating: 4.85, reviewCount: 98, regions: ['stockholm/stockholm'] },
  { id: 'a04', name: 'Erik Nyström', title: 'Mäklare & delägare', agencyId: 'vy', skill: 1.05, baseRating: 4.6, reviewCount: 211, regions: ['stockholm/stockholm', 'stockholm/solna'] },
  { id: 'a05', name: 'Linnéa Karlsson', title: 'Fastighetsmäklare', agencyId: 'hemvik', skill: 0.98, baseRating: 4.5, reviewCount: 67, regions: ['stockholm/stockholm', 'stockholm/nacka'] },
  { id: 'a06', name: 'Daniel Pettersson', title: 'Reg. fastighetsmäklare', agencyId: 'stadsnara', skill: 0.92, baseRating: 4.3, reviewCount: 54, regions: ['stockholm/stockholm'] },
  { id: 'a07', name: 'Klara Sjödin', title: 'Fastighetsmäklare', agencyId: 'bostada', skill: 1.15, baseRating: 4.75, reviewCount: 121, regions: ['stockholm/stockholm', 'stockholm/solna'] },
  { id: 'a08', name: 'Markus Holm', title: 'Mäklare', agencyId: 'nordhem', skill: 1.02, baseRating: 4.55, reviewCount: 89, regions: ['stockholm/stockholm', 'stockholm/nacka'] },
  { id: 'a09', name: 'Petra Åkesson', title: 'Fastighetsmäklare', agencyId: 'lagerlof', skill: 0.88, baseRating: 4.2, reviewCount: 41, regions: ['stockholm/stockholm'] },
  { id: 'a10', name: 'Oscar Wennberg', title: 'Reg. fastighetsmäklare', agencyId: 'vy', skill: 1.08, baseRating: 4.65, reviewCount: 133, regions: ['stockholm/stockholm', 'stockholm/nacka', 'stockholm/solna'] },
  { id: 'a11', name: 'Hanna Lund', title: 'Fastighetsmäklare', agencyId: 'hemvik', skill: 1.2, baseRating: 4.85, reviewCount: 156, regions: ['vastra-gotaland/goteborg'] },
  { id: 'a12', name: 'Gustav Friberg', title: 'Mäklare & delägare', agencyId: 'nordhem', skill: 1.1, baseRating: 4.7, reviewCount: 102, regions: ['vastra-gotaland/goteborg'] },
  { id: 'a13', name: 'Maja Ekström', title: 'Fastighetsmäklare', agencyId: 'bostada', skill: 1.0, baseRating: 4.5, reviewCount: 73, regions: ['vastra-gotaland/goteborg'] },
  { id: 'a14', name: 'Anton Sandberg', title: 'Reg. fastighetsmäklare', agencyId: 'stadsnara', skill: 0.95, baseRating: 4.35, reviewCount: 60, regions: ['vastra-gotaland/goteborg'] },
  { id: 'a15', name: 'Elin Månsson', title: 'Fastighetsmäklare', agencyId: 'vy', skill: 0.9, baseRating: 4.25, reviewCount: 48, regions: ['vastra-gotaland/goteborg'] },
  { id: 'a16', name: 'Rasmus Holmberg', title: 'Mäklare', agencyId: 'lagerlof', skill: 1.06, baseRating: 4.6, reviewCount: 91, regions: ['vastra-gotaland/goteborg'] },
  { id: 'a17', name: 'Nora Björk', title: 'Fastighetsmäklare', agencyId: 'hemvik', skill: 1.16, baseRating: 4.8, reviewCount: 128, regions: ['skane/malmo'] },
  { id: 'a18', name: 'Viktor Ahlberg', title: 'Reg. fastighetsmäklare', agencyId: 'bostada', skill: 1.04, baseRating: 4.6, reviewCount: 84, regions: ['skane/malmo'] },
  { id: 'a19', name: 'Saga Forsberg', title: 'Fastighetsmäklare', agencyId: 'nordhem', skill: 0.97, baseRating: 4.45, reviewCount: 55, regions: ['skane/malmo'] },
  { id: 'a20', name: 'Felix Dahl', title: 'Mäklare', agencyId: 'vy', skill: 0.93, baseRating: 4.3, reviewCount: 62, regions: ['skane/malmo'] },
  { id: 'a21', name: 'Ida Ström', title: 'Fastighetsmäklare', agencyId: 'stadsnara', skill: 1.09, baseRating: 4.7, reviewCount: 97, regions: ['skane/malmo'] },
  { id: 'a22', name: 'Lukas Engdahl', title: 'Reg. fastighetsmäklare', agencyId: 'lagerlof', skill: 0.86, baseRating: 4.15, reviewCount: 38, regions: ['skane/malmo'] },
];

// Derive a URL slug from each agent's name (e.g. "sofia-lindqvist"). Stable id
// for the profile route /maklare/profil/[slug].
AGENTS.forEach((a) => {
  a.slug = slugify(a.name);
});

export function getAgentBySlug(slug) {
  return AGENTS.find((a) => a.slug === slug) || null;
}

export function getAllAgentSlugs() {
  return AGENTS.map((a) => a.slug);
}

// Agents whose coverage includes the resolved place.
export function getEligibleAgents(place) {
  if (!place || place.level === 'root') return AGENTS;
  if (place.level === 'lan') {
    return AGENTS.filter((a) => a.regions.some((r) => r.startsWith(`${place.lan.slug}/`)));
  }
  // kommun + omrade both filter on the kommun-level region key
  return AGENTS.filter((a) => a.regions.includes(place.regionKey));
}

// Deterministic, skill-correlated stats for one agent in one place.
// Same inputs always produce the same numbers (stable SSG + hydration).
export function buildAgentMetrics(agent, place) {
  const market = place.market || { medianPricePerSqm: 60000, avgDaysToSell: 25, avgFinalToAsk: 1.02 };
  const rng = seededRng(`${agent.id}:${place.regionKey}:${place.omrade ? place.omrade.slug : place.level}`);
  const r1 = rng();
  const r2 = rng();
  const r3 = rng();
  const r4 = rng();

  const soldCount = Math.max(3, Math.round(3 + agent.skill * 16 + r1 * 13));
  const pricePerSqm = Math.round(market.medianPricePerSqm * (0.95 + (agent.skill - 1) * 0.06 + r2 * 0.06));
  const daysToSell = Math.max(5, Math.round(market.avgDaysToSell * (1.35 - agent.skill * 0.45 + r3 * 0.3)));
  const finalToAsk = +(market.avgFinalToAsk + (agent.skill - 1) * 0.025 + r4 * 0.01).toFixed(3);
  const recencyDays = Math.round(3 + r2 * 55); // days since last closed sale
  const typeMatchShare = +(0.55 + agent.skill * 0.25 + r3 * 0.15).toFixed(2);

  return {
    agentId: agent.id,
    slug: agent.slug,
    name: agent.name,
    title: agent.title,
    agency: AGENCIES[agent.agencyId],
    rating: agent.baseRating,
    reviewCount: agent.reviewCount,
    soldCount,
    pricePerSqm,
    daysToSell,
    finalToAsk,
    recencyDays,
    typeMatchShare: Math.min(0.99, typeMatchShare),
  };
}

// Rough regional price scaling so a Stockholm profile shows higher numbers than
// a Malmö one.
function regionFactor(regionKey = '') {
  if (regionKey.startsWith('stockholm/')) return 1.6;
  if (regionKey.startsWith('vastra-gotaland/')) return 1.05;
  if (regionKey.startsWith('skane/')) return 0.9;
  return 1;
}

function primaryCityName(agent) {
  const [lan, kommun] = (agent.regions[0] || '').split('/');
  return findKommun(lan, kommun)?.name || 'Sverige';
}

// Aggregate 12-month statistics across ALL areas, broken down by property type —
// this is what the profile page (Figma node 6326-5817) shows. Deterministic.
export function buildAgentProfile(agent) {
  const rng = seededRng(`${agent.id}:profile`);
  const f = regionFactor(agent.regions[0]);
  const { skill } = agent;

  const total = Math.round(22 + skill * 38 + rng() * 18);
  const lgh = Math.round(total * (0.55 + rng() * 0.18));
  const villa = Math.round(total * (0.14 + rng() * 0.1));
  const rad = Math.round(total * (0.08 + rng() * 0.07));
  const fri = Math.max(0, total - lgh - villa - rad);
  const byTypeSold = [
    { type: 'Lägenheter', value: lgh },
    { type: 'Villor', value: villa },
    { type: 'Radhus', value: rad },
    { type: 'Fritidshus', value: fri },
  ];

  const pricePerSqm = Math.round(78000 * f * (0.92 + (skill - 1) * 0.06 + rng() * 0.08));
  const villaPrice = Math.round(7200000 * f * (0.9 + rng() * 0.25));
  const radPrice = Math.round(5200000 * f * (0.9 + rng() * 0.2));
  const friPrice = Math.round(2600000 * f * (0.9 + rng() * 0.3));
  const lghPrice = Math.round(pricePerSqm * (58 + rng() * 20));
  const salePriceTotal = Math.round(
    (lgh * lghPrice + villa * villaPrice + rad * radPrice + fri * friPrice) / Math.max(1, total),
  );

  const base = 20;
  const dLgh = Math.max(6, Math.round(base * (1.2 - skill * 0.4) + rng() * 8));
  const dVilla = Math.max(8, Math.round((base + 12) * (1.2 - skill * 0.4) + rng() * 10));
  const dRad = Math.max(7, Math.round((base + 6) * (1.2 - skill * 0.4) + rng() * 9));
  const dFri = Math.max(10, Math.round((base + 20) * (1.2 - skill * 0.4) + rng() * 14));
  const daysMedian = Math.round((dLgh + dVilla + dRad + dFri) / 4);

  return {
    summary: { sold: total, pricePerSqm, daysToSell: daysMedian },
    totalSold: total,
    byTypeSold,
    salePriceMedian: {
      total: salePriceTotal,
      rows: [
        { type: 'Villor', value: villaPrice },
        { type: 'Radhus', value: radPrice },
        { type: 'Fritidshus', value: friPrice },
      ],
    },
    pricePerSqm: { rows: [{ type: 'Lägenheter', value: pricePerSqm }] },
    daysToSell: {
      median: daysMedian,
      rows: [
        { type: 'Lägenheter', value: dLgh },
        { type: 'Villor', value: dVilla },
        { type: 'Radhus', value: dRad },
        { type: 'Fritidshus', value: dFri },
      ],
    },
  };
}

// Default, editable bio. On the profile page the agent can rewrite this — in the
// prototype it's persisted to localStorage; in production it's a field on the
// agent record (PUT via fetchApi).
export function buildDefaultBio(agent) {
  const first = agent.name.split(' ')[0];
  const city = primaryCityName(agent);
  const agency = AGENCIES[agent.agencyId].name;
  return (
    `Jag heter ${first} och är ${agent.title.toLowerCase()} på ${agency} i ${city}. ` +
    `De senaste åren har jag hjälpt hundratals familjer att sälja sin bostad – tryggt och med bästa möjliga resultat. ` +
    `Jag tror på personligt engagemang, tydlig kommunikation och en genomtänkt strategi för varje bostad, från värdering och styling till visning och avslut. ` +
    `Hör gärna av dig så tar vi en förutsättningslös pratstund om just din bostad.`
  );
}

export default AGENTS;
