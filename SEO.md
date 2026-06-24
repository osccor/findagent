# SEO- & AI-sök-strategi

Målet: dyka upp både i **klassisk Google-sökning** och i **AI-svarsmotorer**
(ChatGPT/OpenAI, Perplexity, Google AI Overviews, Claude) när någon frågar
*"bästa mäklaren i [område]"*. Nedan vad prototypen gör och varför.

## 1. Programmatisk täckning av long-tail

Sökvolymen för "bästa mäklare i X" är utspridd över tusentals orter/områden. En enda
mall + per-områdesrutter ger en unik, indexerbar sida per fråga.

- Catch-all-rutt: [`src/pages/maklare/[[...slug]].js`](./src/pages/maklare/[[...slug]].js)
  hanterar fyra nivåer: `/maklare`, `/maklare/[lan]`, `/maklare/[lan]/[kommun]`,
  `/maklare/[lan]/[kommun]/[omrade]`.
- `getStaticPaths` + `fallback: 'blocking'` → höga-värde-sidorna förrenderas, resten
  genereras on-demand och cachas (ISR, `revalidate: 86400`). Skalar till tusentals
  sidor utan att bygget exploderar.
- [`sitemap.xml`](./src/pages/sitemap.xml.js) listar alla områdes-URL:er; `robots.txt`
  släpper in alla crawlers (inkl. AI-bottar – se punkt 5).

## 2. Strukturerad data (JSON-LD) — den viktigaste hävstången för AI

Maskinläsbar data låter sökmotorer och LLM:er förstå sidan utan att tolka layouten.

| Schema | Syfte | Var |
|--------|-------|-----|
| **`ItemList` av `RealEstateAgent`** | Själva rankingen: ordnad lista av mäklare med betyg, område och nyckeltal | [`AgentsJsonLd.jsx`](./src/components/seo/AgentsJsonLd.jsx) |
| `BreadcrumbList` | Geografisk hierarki Sverige › Län › Kommun › Område | `next-seo` på sidan |
| `FAQPage` | Frågor/svar → rich results + direkta AI-svar | `next-seo`, speglar `Faq`-komponenten |
| `Organization` | Varumärkesentitet (E-E-A-T) | `next-seo` på sidan |

`ItemList` använder `itemListOrder: ItemListOrderDescending` så ordningen tolkas som
en rangordning, och varje mäklare bär `aggregateRating` + `additionalProperty`
(sålda, pris/kvm, försäljningstid, Boneo-betyg).

## 3. Svar-först-innehåll (Answer Engine Optimization)

AI-motorer citerar helst korta, faktatäta stycken med tydlig struktur.

- **AnswerBox** högst upp svarar direkt på frågan ("De bäst rankade mäklarna i X är
  1… 2… 3…") som ett riktigt `<ol>` — lätt att extrahera.
- **Frågeformulerade `<h2>`** ("Vad kännetecknar en bra mäklare i X?", "Hur lång tid
  tar det att sälja…") matchar hur folk och LLM:er ställer frågor.
- **Marknadsstatistik-tabell** ger strukturerade fakta (median pris/kvm, snitttid).
- **Transparent metodik** på sidan = citérbar förklaring av *varför* rankingen ser ut
  som den gör, vilket AI-motorer gärna återger.
- **"Senast uppdaterad"-datum** signalerar färskhet.

## 4. Klassisk teknisk SEO

- **`next-seo`**: per-områdes `title`/`description`/`canonical`/OpenGraph. Titlar med
  årtal ("2026") och intent-ord ("jämför & välj").
- **Semantisk HTML**: ett `<h1>`, logisk rubrikhierarki, `<main>/<nav>/<article>`,
  rankinglistan som `<ol>`.
- **SSR av styled-components** (`_document.js`) → fullt renderad, stilad HTML i
  första svaret (ingen FOUC, allt syns för crawlers som inte kör JS).
- **Core Web Vitals**: SSG/ISR (snabb TTFB), `next/font` (inget render-blocking
  typsnitt), lätt CSS.
- **Canonical + `hreflang`** (sv) hanteras via `lang="sv"` i `_document.js`.

## 5. AI-crawler-policy

`robots.txt` tillåter uttryckligen GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot
och Google-Extended. Att blockera dem (vanligt misstag) gör att man försvinner ur
AI-svar – och AI-svar är exakt där frågan "bästa mäklaren i X" landar allt oftare.

## 6. Checklista vid lansering (utanför prototypen)

- [ ] Riktiga, reviderade försäljningsdata via `fetchApi`
- [ ] Genererade OG-bilder per område (t.ex. `@vercel/og`)
- [ ] Mäklarprofilsidor som `ItemList`-objekten länkar till (`@id`)
- [ ] Interna länkar mellan närliggande områden (länk-equity + crawl-djup)
- [ ] Splitta sitemap per län vid många URL:er; skicka in i Search Console
- [ ] `Review`/`Person`-schema på profilsidorna
- [ ] Mät AI-citeringar (omnämnanden i ChatGPT/Perplexity) som egen KPI
