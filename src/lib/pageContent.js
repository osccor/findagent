// Generates the Swedish, area-specific copy used both on-page and inside the
// JSON-LD. Keeping it here means the visible text and the structured data never
// drift apart — important so AI engines quote the same facts users see.

import siteConfig from '@/components/seo/siteConfig';
import { nf, tkr, longDate, overAsking, rating1 } from '@/lib/format';

const YEAR = 2026;

export function buildTitle(place) {
  switch (place.level) {
    case 'omrade':
      return `Bästa mäklare i ${place.name} ${YEAR} – jämför & välj`;
    case 'kommun':
      return `Bästa mäklare i ${place.name} ${YEAR} – topplista`;
    case 'lan':
      return `Bästa mäklare i ${place.name} ${YEAR}`;
    default:
      return `Bästa mäklarna i Sverige ${YEAR} – jämför per område`;
  }
}

export function buildMetaDescription(place, agents) {
  const n = agents.length;
  if (!n) {
    return `Hitta och jämför de bästa mäklarna i ${place.name} baserat på faktisk försäljningsstatistik. Uppdaterad ${longDate(siteConfig.dataUpdatedAt)}.`;
  }
  return `Jämför de ${n} bäst rankade mäklarna i ${place.name}. Se antal sålda bostäder, snittpris per kvm, försäljningstid och kundbetyg de senaste 12 månaderna. Uppdaterad ${longDate(siteConfig.dataUpdatedAt)}.`;
}

export function buildHeading(place) {
  if (place.level === 'root') return `Bästa mäklarna i Sverige`;
  return `Bästa mäklare i ${place.name}`;
}

export function buildIntro(place) {
  const where = place.level === 'root' ? 'Sverige' : place.name;
  return `Vi rankar mäklare i ${where} efter hur de faktiskt presterar – antal sålda bostäder, vilket pris de får ut, hur snabbt det går och vad tidigare säljare tycker. Ingen reklam, bara resultat.`;
}

// The answer-first paragraph + ordered top-3 — the block AI engines lift cleanly.
export function buildAnswer(place, agents) {
  const top = agents.slice(0, 3);
  if (!top.length) {
    return {
      question: `Vilka är de bästa mäklarna i ${place.name}?`,
      paragraph: `Vi har ännu inte tillräckligt med försäljningsdata för att ranka mäklare i ${place.name}.`,
      list: [],
    };
  }
  const names = top.map((a, i) => `${i + 1}. ${a.name} (${a.agency.name})`).join(', ');
  return {
    question: `Vilka är de bästa mäklarna i ${place.name}?`,
    paragraph: `De bäst rankade mäklarna i ${place.name} just nu är ${names}. Rankningen baseras på antal sålda bostäder, slutpris jämfört med utgångspris, försäljningstid och kundbetyg de senaste ${siteConfig.rankingWindowMonths} månaderna.`,
    list: top.map((a) => ({
      name: a.name,
      agency: a.agency.name,
      reason: `${nf(a.soldCount)} sålda bostäder, snittpris ${tkr(a.pricePerSqm)} tkr/kvm, ${nf(a.daysToSell)} dagars snittförsäljningstid och betyg ${rating1(a.rating)}.`,
    })),
  };
}

// FAQ used by both the on-page accordion and FAQPageJsonLd.
export function buildFaq(place, agents) {
  const market = place.market;
  const top = agents[0];
  const faq = [];

  if (top) {
    faq.push({
      question: `Vilken är den bästa mäklaren i ${place.name}?`,
      answer: `Just nu är ${top.name} på ${top.agency.name} den bäst rankade mäklaren i ${place.name}, med Boneo-betyg ${Math.round(top.boneoScore)} av 100. Mäklaren har sålt ${nf(top.soldCount)} bostäder i området det senaste året med ett snittpris på ${tkr(top.pricePerSqm)} tkr/kvm och en snittförsäljningstid på ${nf(top.daysToSell)} dagar.`,
    });
  }

  faq.push({
    question: `Hur rankar Boneo mäklare i ${place.name}?`,
    answer: `Boneo rankar mäklare i ${place.name} med ett sammanvägt Boneo-betyg (0–100) som bygger på fem faktorer: försäljningsvolym (30 %), prisprestation (25 %), försäljningstid (20 %), kundbetyg (15 %) och relevans/aktualitet (10 %). Varje faktor jämförs mot övriga mäklare i samma område, så betyget speglar lokal prestation. En mäklare måste ha sålt minst tre bostäder i området det senaste året för att rankas.`,
  });

  if (market) {
    faq.push({
      question: `Hur lång tid tar det att sälja en bostad i ${place.name}?`,
      answer: `Det tar i snitt cirka ${nf(market.avgDaysToSell)} dagar att sälja en bostad i ${place.name}, men de bäst rankade mäklarna säljer ofta snabbare. Försäljningstid är en av faktorerna i Boneo-betyget.`,
    });
    faq.push({
      question: `Vad är snittpriset per kvadratmeter i ${place.name}?`,
      answer: `Medianpriset i ${place.name} ligger på cirka ${tkr(market.medianPricePerSqm)} tkr per kvadratmeter. Bostäder säljs i snitt ${overAsking(market.avgFinalToAsk)} jämfört med utgångspris.`,
    });
  }

  faq.push({
    question: `Vad kostar det att anlita en mäklare i ${place.name}?`,
    answer: `Mäklararvodet i ${place.name} sätts individuellt och anges oftast antingen som en fast summa eller som provision (en procentandel av slutpriset). Det kan löna sig att jämföra flera mäklare – en mäklare som tar ut ett något högre arvode men får ut ett högre slutpris kan vara billigare i slutänden.`,
  });

  return faq;
}

export function dataUpdatedLabel() {
  return longDate(siteConfig.dataUpdatedAt);
}
