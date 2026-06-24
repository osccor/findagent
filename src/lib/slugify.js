// Swedish-aware slugify: å/ä→a, ö→o, ü→u, etc. Stable, URL-safe.
const MAP = { å: 'a', ä: 'a', ö: 'o', é: 'e', ü: 'u', ø: 'o', æ: 'a' };

export function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/[åäöéüøæ]/g, (c) => MAP[c] || c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Deterministic 32-bit hash for a string → used to seed pseudo-random stats so
// generated numbers are stable across server render and client hydration.
export function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32 PRNG seeded by hashString(key) → reproducible floats in [0, 1).
export function seededRng(key) {
  let a = hashString(key);
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
