# Boneo-betyget — så rankar vi mäklare

Boneo-betyget är ett **sammanvägt mått från 0 till 100** som räknas ut för **varje
mäklare i ett specifikt område**. Poängen speglar lokal prestation: att vara nr 1 i
Vasastan betyder att man slår de andra mäklarna som faktiskt är aktiva i Vasastan –
inte hela landet, och inte hur stor mäklarkedjan är.

Koden finns i [`src/lib/ranking.js`](./src/lib/ranking.js).

## De fem faktorerna

| # | Faktor | Vikt | Vad den mäter |
|---|--------|------|----------------|
| 1 | **Försäljningsvolym** | **30 %** | Antal sålda bostäder i området senaste 12 mån. Bevisad lokal erfarenhet. |
| 2 | **Prisprestation** | **25 %** | Slutpris/utgångspris (60 %) + snittpris per kvm mot områdets median (40 %). |
| 3 | **Försäljningstid** | **20 %** | Antal dagar till såld. Kortare = bättre. |
| 4 | **Kundbetyg** | **15 %** | Snittbetyg viktat mot antal recensioner. |
| 5 | **Relevans & aktualitet** | **10 %** | Andel försäljningar i rätt bostadstyp (60 %) + hur nyligen mäklaren var aktiv (40 %). |

## Hur uträkningen går till

1. **Samla peers.** Hämta alla mäklare som varit aktiva i området de senaste 12 mån.
2. **Tröskel.** En mäklare måste ha **minst 3 sålda bostäder** i området för att rankas,
   så att enstaka turaffärer inte hamnar i toppen (`MIN_SALES_TO_RANK`).
3. **Normalisera.** Varje delmått min–max-normaliseras till `[0, 1]` mot peers i
   samma område. Mått där lägre är bättre (försäljningstid, dagar sedan senaste affär)
   inverteras. Är alla lika på ett mått får alla 0,5.
4. **Vikta.** Komponenterna vägs ihop enligt tabellen ovan och multipliceras med 100.

```
Boneo-betyg =
  100 × ( 0,30·volym
        + 0,25·(0,6·slutpris/utgång + 0,4·pris/kvm)
        + 0,20·tid
        + 0,15·betyg
        + 0,10·(0,6·typmatchning + 0,4·aktualitet) )
```

5. **Sortera & rangordna.** Listan sorteras fallande på betyget. Vid lika betyg
   avgör antal sålda, därefter namn (deterministiskt – samma resultat varje gång).

## Filtren på sidan

Filterflikarna sorterar **samma lista**, de filtrerar inte bort någon:

| Flik | Sortering |
|------|-----------|
| **Boneo rankad** (standard) | Boneo-betyget (sammanvägt) |
| **Flest sålda** | Antal sålda, fallande |
| **Snittpris kvm** | Snittpris per kvm, fallande |
| **Försäljningstid** | Dagar till såld, stigande |

## Badges

Utöver rangordningen lyfter vi fram ledare per kategori direkt på korten:

- **Högst Boneo-betyg** – nr 1 totalt
- **Flest sålda** – högst försäljningsvolym
- **Snabbast sålt** – kortast försäljningstid
- **Bäst betalt** – högst slutpris mot utgångspris

## Varför den här metoden?

- **Lokal rättvisa.** Normalisering per område gör att en skicklig mäklare i en liten
  förort kan ranka högt utan att konkurrera med Östermalms volymer.
- **Resultat, inte reklam.** Inget i betyget går att köpa – det bygger på utfall.
- **Transparens (E-E-A-T).** Vikterna visas öppet på sidan och i strukturerad data,
  vilket bygger förtroende hos både användare och sök-/AI-motorer.
- **Manipuleringsskydd.** Tröskeln + flera oberoende faktorer gör listan svår att gaming:a.

## Produktionsnoteringar

- Mock-statistiken genereras deterministiskt (seedad PRNG i `slugify.js`) så att
  siffrorna är stabila mellan server-render och klient-hydrering. Byt ut
  `buildAgentMetrics` mot riktig, reviderad försäljningsdata.
- Vikterna ligger i `RANKING_FACTORS` – ett enda ställe att justera, och UI:t följer
  automatiskt med eftersom MethodologySection läser samma källa.
