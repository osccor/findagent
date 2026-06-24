# Boneo — "Bästa mäklare i [område]" (prototyp)

En SEO- och AI-sök-optimerad prototyp för Boneos marknadsplats: en publik sida där
besökare kan **söka och jämföra de bästa mäklarna i ett område** (Län → Kommun →
Område), filtrera på hårda nyckeltal och förstå exakt hur rankingen räknas fram.

Sidan är byggd för att synas både i klassisk Google-sökning och i AI-svarsmotorer
(ChatGPT, Perplexity, Google AI Overviews) på frågor som *"bästa mäklaren i Vasastan"*.

## Snabbstart

```bash
npm install
npm run dev
# öppna:
#   http://localhost:3000/maklare/stockholm/stockholm/vasastan   ← områdessidan
#   http://localhost:3000/maklare/profil/sofia-lindqvist         ← mäklarprofil
#   http://localhost:3000/maklare/vastra-gotaland/goteborg       ← kommun-hub
#   http://localhost:3000/maklare/stockholm                      ← län-hub
#   http://localhost:3000/maklare                                ← Sverige-översikt
#   http://localhost:3000/sitemap.xml                            ← programmatisk sitemap
```

## Teknik (matchar Boneos produktionsstack)

| Område | Val |
| --- | --- |
| Ramverk | Next.js 15, **Pages Router** (`src/pages`) |
| UI | React 18 |
| Styling | **styled-components 5** (tema med Figma-tokens), SSR via `_document.js` |
| SEO | **next-seo 6** (`NextSeo`, `BreadcrumbJsonLd`, `FAQPageJsonLd`, `OrganizationJsonLd`) + egen `ItemList`-JSON-LD |
| Typsnitt | DM Sans via `next/font/google` |
| Data | Mockad (deterministisk). Ingen Redux/Amplify krävs för prototypen. |

> **Produktion:** ersätt `src/lib/agentsService.js` med ett `fetchApi`-anrop
> (`src/services/api.js`) som returnerar samma form. Rankingmatematiken och hela
> React-lagret är oförändrat. Filterläget kan flyttas till en Redux-thunk om man vill
> dela det mellan vyer.

## Sidans uppbyggnad

1. **Navbar** (portad från Figma) + **brödsmulor**
2. **Hero** med `<h1>Bästa mäklare i [Område]</h1>`
3. **AreaSearch** — kaskad Län → Kommun → Område
4. **AnswerBox** — svar-först-block + topp-3 som `<ol>` (för AI-svarsmotorer)
5. **Filterflikar** — Boneo rankad / Flest sålda / Snittpris kvm / Försäljningstid
6. **AgentList** — `<ol>` av **AgentCard** (Figma-komponenten) med rank, nyckeltal och badge
7. **MethodologySection** — "Så rankar vi mäklare" (Boneo-betyget)
8. **SeoContent** — lång lokal text + marknadsstatistik-tabell
9. **FAQ** — `<details>`-dragspel, speglat i FAQ-JSON-LD

### Mäklarprofil (`/maklare/profil/[slug]`)

Sidan man länkas till från "Visa profil" på ett mäklarkort (Figma node 6326-5817):

- **ProfileHeader** — stor avatar, namn, byrå + logga, betyg och tre summerings-KPI:er
- **ProfileBio** — "Om mäklaren": en **profiltext som mäklaren själv kan redigera**
  (Redigera → textarea → Spara). Sparas i `localStorage` i prototypen; i produktion
  ett fält på mäklaren som sparas via `fetchApi` bakom mäklarens egen inloggning.
- **ProfileStats** — "Statistik senaste 12 månader", uppdelad per bostadstyp
  (Lägenheter/Villor/Radhus/Fritidshus): antal sålda, försäljningspris, snittpris kvm
  och försäljningstid
- **AreaRankings** — "Aktiv i dessa områden": chips som länkar tillbaka till varje
  områdessida med mäklarens placering (intern länkning)
- Strukturerad data: `RealEstateAgent` (`AgentProfileJsonLd`) + `BreadcrumbList`

Alla 22 mäklarprofiler förrenderas (SSG) via `getStaticPaths`.

## Dokumentation

- **[METHODOLOGY.md](./METHODOLOGY.md)** — hur Boneo-betyget räknas ut (vikter, normalisering, tröskel)
- **[SEO.md](./SEO.md)** — SEO- och AI-sök-strategin i detalj

## Filstruktur

```
src/
  pages/          _app.js · _document.js · index.js
                  maklare/[[...slug]].js     ← programmatiska områdessidor (SSG + fallback)
                  maklare/profil/[slug].js   ← mäklarprofiler (SSG)
                  sitemap.xml.js
  components/      layout/ · agents/ · search/ · content/ · profile/ · seo/
  data/           areas.js (geografi + marknad) · agents.js (mäklarpool + statistik)
  lib/            ranking.js (Boneo-betyget) · agentsService.js · pageContent.js · format.js · slugify.js
  styles/         theme.js · GlobalStyle.js
```

## Vad som är utanför scope

Riktig data, mäklarprofilsidor, kontaktformulär (React Hook Form + Yup), kartvy
(Maplibre), GTM-events och genererade OG-bilder. Markerat i koden där det hör hemma.
