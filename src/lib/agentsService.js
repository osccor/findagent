import { getEligibleAgents, buildAgentMetrics } from '@/data/agents';
import LAN, { resolvePlace } from '@/data/areas';
import { rankAgents } from '@/lib/ranking';

// Resolve a place → ranked agent view-models ready for the page.
// In production this whole function becomes a fetchApi call returning the same
// shape; the React layer below doesn't change.
export function getRankedAgentsForArea(place) {
  const eligible = getEligibleAgents(place);
  const metrics = eligible.map((agent) => buildAgentMetrics(agent, place));
  return rankAgents(metrics);
}

// For a given agent, find every område they're ranked in and their position
// there. Powers the "Aktiv i dessa områden" chips on the profile page and gives
// the profile rich internal links to the area pages (good for SEO + navigation).
export function getAgentAreaRankings(agent) {
  const out = [];
  LAN.forEach((lan) =>
    lan.kommuner.forEach((kommun) => {
      if (!agent.regions.includes(`${lan.slug}/${kommun.slug}`)) return;
      kommun.omraden.forEach((omrade) => {
        const place = resolvePlace([lan.slug, kommun.slug, omrade.slug]);
        const ranked = getRankedAgentsForArea(place);
        const idx = ranked.findIndex((a) => a.agentId === agent.id);
        if (idx >= 0) {
          out.push({
            name: omrade.name,
            kommun: kommun.name,
            href: `/maklare/${lan.slug}/${kommun.slug}/${omrade.slug}`,
            rank: idx + 1,
            total: ranked.length,
          });
        }
      });
    }),
  );
  out.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name, 'sv'));
  return out;
}
