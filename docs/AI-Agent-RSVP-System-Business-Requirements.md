# AI Agent RSVP Systém - Biznis požiadavky a Use Cases

**Verzia:** 1.1
**Dátum:** December 2024
**Posledná aktualizácia:** December 2024
**Produkt:** Inteligentný svadobný asistent pre zber RSVP a poskytovanie informácií

---

## 1. Executive Summary

Tento dokument definuje biznis požiadavky pre AI-poháňaný konverzačný systém určený na zber potvrdení účasti (RSVP) od svadobných hostí a poskytovanie personalizovaných informácií o blížiacej sa svadbe. Systém nahradí tradičné statické RSVP formuláre interaktívnym chatbotom, ktorý vedie prirodzený dialóg v slovenskom jazyku a prispôsobuje sa každému hosťovi individuálne.

### Kľúčové hodnoty produktu

- **Personalizovaný zážitok**: Každý hosť dostane individuálny prístup založený na jeho pozvaní a kontexte
- **Efektívny zber dát**: Automatické spracovanie a validácia RSVP odpovedí bez manuálnej práce
- **Zníženie bariér**: Konverzačné rozhranie je prirodzenejšie ako tradičné formuláre
- **Flexible responzívnosť**: Systém odpovedá na otázky hostí v reálnom čase
- **Minimalizácia chýb**: AI validuje a upresňuje odpovede priamo počas dialógu

---

## 2. Biznis ciele

### 2.1 Primárne ciele

1. **Zber kompletných RSVP odpovedí**
   - Získať potvrdenie účasti od všetkých pozvaných hostí
   - Zaznamenať diétne obmedzenia a špeciálne požiadavky
   - Identifikovať potrebu ubytovania a dopravy

2. **Poskytovanie informácií**
   - Ododpovedať na bežné otázky o svadbe (miesto, čas, dress code)
   - Poskytnúť informácie o ubytovaní a doprave
   - Zdieľať praktické detaily (parkovanie, program dňa)

3. **Automatizácia komunikácie**
   - Eliminovať potrebu manuálneho zasielania odpovedí emailom/SMS
   - Znížiť administratívnu záťaž nevesty a ženícha
   - Urýchliť proces zberu potvrdení

### 2.2 Sekundárne ciele

- Vytvoriť pozitívny prvý dojem u hostí
- Ukázať tech-savvy prístup nevesty a ženícha
- Získať spätnú väzbu a špeciálne požiadavky včas pred svadbou
- Redukovať no-show rate (ľudia, ktorí potvrdia ale neprídu)

---

## 3. Aktori systému

### 3.1 Pozvaní hostia (Primary Actors)

**Charakteristika:**

- Osoby, ktoré dostali oficiálnu pozvánku na svadbu
- Môžu byť individuálne pozvané alebo v rámci skupiny (rodina, pár)
- Majú prístup k systému **výhradne** cez personalizovaný QR kód
- Rôzne technické zručnosti a vekové kategórie

**Motivácia:**

- Potvrdiť alebo odmietnuť účasť
- Získať informácie o svadbe
- Komunikovať špeciálne potreby (diétne, ubytovanie)

**Potreby:**

- Jednoduchý a intuitívny spôsob odoslania RSVP
- Rýchle odpovede na otázky
- Možnosť upraviť svoje odpovede

### 3.2 Nevesta a ženích (System Owners)

**Charakteristika:**

- Administrátori systému
- Konečný používatelia zhromaždených dát

**Motivácia:**

- Získať prehľad o účasti hostí
- Plánovať svadbu na základe počtu hostí
- Vedieť o špeciálnych požiadavkách (diéta, ubytovanie)

**Potreby:**

- Kompletné a presné RSVP dáta
- Real-time prehľad o stave odpovedí
- Export dát pre cateringové firmy a organizátorov

---

## 4. Use Cases

### UC-01: Prístup cez QR kód - Individuálna pozvánka

**Aktor:** Pozvaný hosť (jednotlivec)

**Vstupné podmienky:**

- Hosť dostal fyzickú alebo digitálnu pozvánku s QR kódom
- QR kód je unikátny pre tohto hosťa
- Hosť má zariadenie s prístupom na internet a kamerou

**Hlavný tok:**

1. Hosť naskenuje QR kód z pozvánky
2. Systém otvorí chat rozhranie
3. AI agent privíta hosťa po mene: _"Ahoj [Meno]! Vitaj na našej svadobnej stránke!"_
4. Agent okamžite začne zber RSVP (viď UC-05)

**Výstupné podmienky:**

- Hosť je jednoznačne identifikovaný
- RSVP konverzácia je inicializovaná

**Alternatívne toky:**

- A1: QR kód je neplatný → zobrazí sa chybová hláška a redirect na hlavnú stránku

---

### UC-02: Prístup cez QR kód - Skupinová pozvánka

**Aktor:** Pozvaný hosť (člen skupiny/rodiny)

**Vstupné podmienky:**

- QR kód patrí skupine hostí (napr. rodina s 3 členmi)
- Skupina má spoločnú RSVP odpoveď

**Hlavný tok:**

1. Člen skupiny naskenuje QR kód
2. Systém otvorí chat a privíta celú skupinu: _"Ahoj Marek, Katka a Marko! Vitajte na našej svadobnej stránke!"_
3. Agent sa opýta, kto zo skupiny práve komunikuje: _"Teší ma, že ste tu. Kto z vás práve píše?"_
4. Hosť sa identifikuje: _"Som Marek"_
5. Agent potvrdí identitu: _"Super Marek! Teším sa, že si tu."_
6. Agent začne zber RSVP za celú skupinu (viď UC-06)

**Výstupné podmienky:**

- Konkrétny člen skupiny je identifikovaný
- RSVP konverzácia prebieha v mene celej skupiny

**Alternatívne toky:**

- A1: Hosť sa predstaví nejednoznačne → Agent položí spresňujúcu otázku
- A2: Odpoveď zodpovedá viacerým členom → Agent požiada o dodatočnú identifikáciu

---

### UC-03: Zber RSVP - Individuálny hosť

**Aktor:** Identifikovaný individuálny hosť

**Vstupné podmienky:**

- Hosť je úspešne identifikovaný
- Hosť ešte neodovzdal RSVP alebo chce upraviť odpoveď

**Hlavný tok:**

**Krok 1 - Potvrdenie účasti:**

1. Agent: _"Prídeš na našu svadbu 27. marca? To znamená na sobáš o 15:30 aj hostinu."_
2. Hosť: _"Áno, prídem"_ alebo _"Nie, nemôžem"_
3. Systém zaznamená odpoveď (willAttend = true/false, attendCeremony = true ak willAttend = true)

**Krok 2 - Diétne obmedzenia (iba ak áno):** 4. Agent: _"Máš nejaké diétne obmedzenia alebo alergie?"_ 5. Hosť: _"Som vegetarián"_ alebo _"Nie, žiadne"_ 6. Systém zaznamená odpoveď

**Krok 3 - Ubytovanie a doprava (conditional):** 7. Ak hosť NIE JE z Modry: - Agent: _"Potrebuješ informácie o ubytovaní alebo doprave do Modry?"_ - Hosť: _"Áno, ubytovanie"_ alebo _"Nie, ďakujem"_ 8. Ak hosť JE z Modry: - Otázka sa preskočí

**Krok 4 - Potvrdenie a poďakovanie:** 9. Agent: _"Skvelé, mám všetko čo potrebujem! Teším sa na teba 27. marca v Modre!"_ 10. Zobrazí sa RSVP Summary Card s prehľadom odpovedí

**Výstupné podmienky:**

- Všetky povinné RSVP údaje sú zaznamenané v databáze
- Hosť vidí zhrnutie svojich odpovedí
- Conversation state = "completed"

**Alternatívne toky:**

- A1: Hosť potvrdí "Nie" v kroku 1 → Preskočia sa kroky 2-4, pokračuje sa krokom 5 s odlišnou správou: _"Ďakujeme za odpoveď. Budete nám chýbať!"_
- A2: Hosť chce dodatočné informácie → Agent poskytne detaily o ubytovaní/doprave/programe

---

### UC-04: Zber RSVP - Skupinová odpoveď

**Aktor:** Identifikovaný člen skupiny (odpovedá za všetkých)

**Vstupné podmienky:**

- Člen skupiny je identifikovaný
- Skupina ešte neodovzdala RSVP

**Hlavný tok:**

**Krok 1 - Potvrdenie účasti (za skupinu):**

1. Agent: _"Prídu všetci zo skupiny (ty, Katka a Marko) na našu svadbu 27. marca? To znamená na sobáš o 15:30 aj hostinu."_
2. Hosť: _"Áno, prídu všetci"_ alebo _"Katka a ja áno, ale Marko nemôže"_
3. Systém zaznamená odpoveď (willAttend = true pre tých, čo prídu; attendCeremony = true automaticky)

**Krok 2 - Diétne obmedzenia:** 4. Agent: _"Vidím že Katka je vegetariánka. Má ešte niekto nejaké iné diétne obmedzenia alebo alergie?"_

- Agent využíva predvyplnené dáta z databázy (`about` pole)

5. Hosť: _"Nie, len Katka"_
6. Systém zaznamená

**Krok 3 - Ubytovanie a doprava:** 7. Ak skupina NIE JE z Modry: Agent sa opýta na ubytovanie/dopravu 8. Ak JE z Modry: Preskočí sa

**Krok 4 - Potvrdenie:** 9. Agent: _"Skvelé, mám všetko! Teším sa na vás 27. marca!"_ 10. Zobrazí sa RSVP Summary Card pre celú skupinu

**Výstupné podmienky:**

- RSVP odpoveď je zaznamenaná pre celú skupinu
- Jeden záznam v databáze reprezentuje celú skupinu
- Conversation state = "completed"

**Alternatívne toky:**

- A1: Čiastočná účasť (niektorí prídu, iní nie) → Agent spresní kto príde a zaznačí odpoveď
- A2: Rôzne diétne požiadavky → Agent zapíše zoznam s priradením k osobám

---

### UC-05: Poskytovanie informácií o svadbe

**Aktor:** Identifikovaný hosť alebo návštevník

**Vstupné podmienky:**

- Chat je aktívny
- Hosť má otázku

**Hlavný tok:**

1. Hosť sa opýta: _"Kde je presne sobáš?"_ alebo _"O koľkej je hostina?"_
2. AI agent analyzuje otázku
3. Agent poskytne relevantnú odpoveď:
   - Miesto: _"Sobáš je v Novej sobášnej miestnosti mesta Modra, Štúrova 59"_
   - Čas: _"Sobáš začína o 15:30, hostina je po obrade až do polnoci"_
4. Agent ponúkne dodatočné info: _"Potrebuješ ešte niečo vedieť?"_

**Výstupné podmienky:**

- Hosť dostal odpoveď na svoju otázku
- Konverzácia môže pokračovať

**Príklady otázok a odpovedí:**

| Otázka hosťa                 | Odpoveď agenta                                                       |
| ---------------------------- | -------------------------------------------------------------------- |
| "Aký je dress code?"         | "Odporúčame elegantný odev. Nevesta prosí bez veľkých kytíc."        |
| "Kde môžem parkovať?"        | "Parkovanie je dostupné priamo pri reštaurácii Starý Dom."           |
| "Môžem priniesť darček?"     | "Akékoľvek darčeky sú vítané, nevesta prosí len bez veľkých kytíc."  |
| "Môžem zmeniť moju odpoveď?" | "Samozrejme! Čo chceš zmeniť?" → Agent reinicializuje RSVP edit mode |

---

### UC-06: Úprava RSVP odpovede

**Aktor:** Identifikovaný hosť, ktorý už odoslal RSVP

**Vstupné podmienky:**

- Hosť má dokončené RSVP (conversation state = "completed")
- RSVP Summary Card je zobrazená

**Hlavný tok:**

1. Hosť klikne na tlačidlo "✏️ Upraviť" v RSVP Summary Card
   ALEBO napíše správu: _"Chcem zmeniť moju odpoveď"_
2. Agent: _"Samozrejme! Čo chceš zmeniť?"_
3. Hosť špecifikuje: _"Chcem pridať že som bezlepkový"_
4. Agent aktualizuje odpoveď: _"Dobre, poznačil som si že si vegetarián a bezlepkový."_
5. Agent zobrazí aktualizovanú RSVP Summary Card
6. Conversation state zostáva "completed"

**Výstupné podmienky:**

- RSVP dáta sú aktualizované v databáze
- Hosť vidí aktualizované zhrnutie
- Timestamp "updatedAt" je aktualizovaný

**Alternatívne toky:**

- A1: Hosť chce úplne zrušiť účasť → Agent aktualizuje willAttend = false, attendCeremony = null
- A2: Hosť chce potvrdiť účasť po predchádzajúcom odmietnutí → Agent aktualizuje willAttend = true, attendCeremony = true
- A3: Hosť chce upraviť diétne obmedzenia → Agent aktualizuje dietaryRestrictions pole
- A4: Hosť chce upraviť požiadavky na ubytovanie/dopravu → Agent aktualizuje needsAccommodation/needsDirections

**POZNÁMKA:** Hostia nemôžu meniť len účasť na sobáši (attendCeremony) samostatne. Platí pravidlo: ak prídu, prídu na sobáš aj hostinu.

---

## 5. Funkcionálne požiadavky

### 5.1 Identifikácia a autentifikácia

**FR-01: QR kód identifikácia (povinná)**

- Systém MUSÍ podporovať identifikáciu hosťa **výhradne** cez unikátny QR token
- QR token MUSÍ byť unikátny pre každú skupinu hostí
- Systém MUSÍ rozlišovať medzi individuálnymi a skupinovými pozvánkami
- Prístup bez QR kódu NIE JE podporovaný

\*\*FR-02: Skupina vs. Individuál

- Pri skupinovej pozvánke MUSÍ agent privítať všetkých členov skupiny po mene
- Agent MUSÍ požiadať o identifikáciu konkrétneho komunikujúceho člena
- Ak skupina má len 1 člena, MUSÍ sa správať ako individuálna pozvánka

### 5.2 RSVP zber

**FR-03: Povinné polia**
Systém MUSÍ zozbierať nasledujúce povinné informácie:

- Potvrdenie účasti (willAttend: boolean)
- Účasť na obrade (attendCeremony: boolean) - automaticky = true ak willAttend = true (nie je samostatná otázka)
- Diétne obmedzenia (dietaryRestrictions: string | null)

**POZNÁMKA:** Hostia nemôžu prísť len na hostinu bez sobáša. Ak hosť potvrdí účasť, automaticky sa predpokladá účasť na sobáši aj hostine.

**FR-04: Podmienené polia**

- Ubytovanie (needsAccommodation: boolean) - ZNIE sa ZNIE ak hosť NIE je z Modry
- Doprava (needsDirections: boolean) - ZNIE sa ZNIE ak hosť NIE je z Modry

**FR-05: Auto-fill z databázy**

- Systém MUSÍ použiť dostupné informácie z databázy (pole `about`) na predvyplnenie známych údajov
- Príklad: Ak v `about` je "vegetariánka", agent navrhne: _"Vidím že si vegetariánka. Máš ešte nejaké iné diétne obmedzenia?"_

**FR-06: Validácia odpovedí**

- Agent MUSÍ overovať pochopenie odpovede pred uložením
- Pri nejednoznačnej odpovedi MUSÍ agent požiadať o spresnenie
- Systém MUSÍ označiť RSVP ako kompletné (isComplete = true) iba ak sú všetky povinné polia vyplnené

### 5.3 Konverzačná AI

**FR-07: Prirodzený jazyk**

- Agent MUSÍ komunikovať v slovenčine
- Agent MUSÍ používať neformálne oslovenie "ty"
- Agent MUSÍ byť priateľský, teplý a osobný
- Agent MUSÍ byť stručný (max 2-3 vety na odpoveď)

**FR-08: Kontextové odpovede**

- Agent MUSÍ prispôsobiť odpovede na základe conversation state
- Agent MUSÍ pamätať predchádzajúcu históriu konverzácie
- Agent MUSÍ rozlíšiť medzi jednotlivcom a skupinou v odpovediach

**FR-09: Poskytovanie informácií**
Systém MUSÍ vedieť odpovedať na otázky:

- Základné info (dátum, čas, miesto)
- Dress code
- Parkovanie a doprava
- Ubytovanie
- Program dňa
- Darčeky

**FR-10: Emojis**

- Agent MÔŽE používať max 1 emoji na správu
- Odporúčané emojis: 💐, 💕, 🎉, ✨

### 5.4 Session management

**FR-11: Session tracking**

- Každá konverzácia MUSÍ mať unikátny session token (UUID)
- Session token MUSÍ byť uložený v cookie s 1-ročnou expiráciou
- Systém MUSÍ sledovať conversation state: `group_welcome`, `identifying_individual`, `identified`, `collecting_rsvp`, `completed`

**FR-12: Conversation state transitions**

```
group_welcome → identifying_individual → identified → collecting_rsvp → completed
```

**FR-13: Persistence**

- Všetky správy MUSIA byť uložené v databáze
- RSVP odpovede MUSIA byť uložené v samostatnej tabuľke (`guest_group_responses`)
- Systém MUSÍ umožniť obnovenie konverzácie pri návrate hosťa

### 5.5 RSVP Summary Card

**FR-14: Zobrazenie súhrnu**

- Po dokončení RSVP MUSÍ systém zobraziť RSVP Summary Card
- Karta MUSÍ obsahovať: mená hostí, účasť na sobáši, účasť na hostine, diétne obmedzenia, ubytovanie, dopravu
- Karta MUSÍ byť sticky (zobrazená vždy navrchu chatu)
- Karta MUSÍ byť collapsible (rozbaľovacia/zbaliacia)

**FR-15: Edit funkcionalita**

- Summary card MUSÍ mať tlačidlo "Upraviť"
- Kliknutie na "Upraviť" MUSÍ iniciovať edit mode konverzáciu

---

## 6. Konverzačné flow diagramy

### 6.1 QR kód flow - Individuálny hosť

```
[Hosť naskenuje QR]
    ↓
[Agent privíta po mene]
    ↓
[RSVP Krok 1: Účasť na sobáši aj hostine?] → Nie → [Poďakovanie] → [COMPLETED]
    ↓ Áno (willAttend=true, attendCeremony=true)
[RSVP Krok 2: Diéta?]
    ↓
[RSVP Krok 3: Ubyt/Doprava?] (conditional - ak nie z Modry)
    ↓
[Potvrdenie a poďakovanie]
    ↓
[Zobraz RSVP Summary Card]
    ↓
[COMPLETED]
```

### 6.2 QR kód flow - Skupinová pozvánka

```
[Člen skupiny naskenuje QR]
    ↓
[Agent privíta celú skupinu]
    ↓
[Agent: "Kto z vás píše?"]
    ↓
[Hosť: "Som Marek"]
    ↓
[Agent identifikuje člena]
    ↓
[RSVP zber za celú skupinu]
    ↓
[Zobraz RSVP Summary Card]
    ↓
[COMPLETED]
```

---

## 7. RSVP dátový model

### 7.1 Štruktúra RSVP odpovede

```
GuestGroupResponse {
  id: UUID
  groupId: UUID (foreign key)
  respondedBy: UUID (ID hosťa, ktorý odpovedal)

  // Povinné polia
  willAttend: boolean | null
  attendCeremony: boolean | null  // Automaticky = true ak willAttend = true
  dietaryRestrictions: string | null

  // Podmienené polia
  needsAccommodation: boolean | null
  needsDirections: boolean | null

  // Metadata
  isComplete: boolean (default: false)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**POZNÁMKA:** Pole `attendCeremony` je vždy `true` ak `willAttend` je `true`. Hostia nemôžu potvrdiť účasť len na hostine bez sobáša. Pole je v databáze zachované pre budúcu flexibilitu, ale v súčasnej implementácii platí pravidlo: účasť na svadbe = účasť na sobáši aj hostine.

### 7.2 Príklady RSVP odpovedí

**Príklad 1: Individuálny hosť - Potvrdená účasť**

```json
{
  "willAttend": true,
  "attendCeremony": true, // Automaticky true (hosť príde na sobáš aj hostinu)
  "dietaryRestrictions": "Vegetarián",
  "needsAccommodation": false,
  "needsDirections": true,
  "isComplete": true
}
```

**Príklad 2: Skupina - Potvrdená účasť**

```json
{
  "willAttend": true,
  "attendCeremony": true, // Automaticky true (všetci prídu na sobáš aj hostinu)
  "dietaryRestrictions": "Katka - vegetariánka, bezlepková diéta; Marko - detské menu",
  "needsAccommodation": true,
  "needsDirections": false,
  "isComplete": true
}
```

**Príklad 3: Odmietnutie účasti**

```json
{
  "willAttend": false,
  "attendCeremony": null, // null pretože hosť vôbec nepríde
  "dietaryRestrictions": null,
  "needsAccommodation": null,
  "needsDirections": null,
  "isComplete": true
}
```

---

## 8. Personalizačné mechanizmy

### 8.1 Kontextová personalizácia

**Podľa typu pozvánky:**

- Individuálna: Používa singulár (_"Prídeš..."_, _"Potrebuješ..."_)
- Skupinová: Používa plurál (_"Prídu všetci..."_, _"Potrebujete..."_)

**Podľa lokácie:**

- Hostia z Modry: NEKLADÚ sa otázky o ubytovaní a doprave
- Hostia mimo Modry: Otázky sú súčasťou RSVP procesu

**Podľa známych informácií:**

- Ak databáza obsahuje `about` pole (napr. "vegetariánka"), agent to využije:
  - _"Vidím že Katka je vegetariánka. Má ešte niekto iné diétne obmedzenia?"_

### 8.2 Tón a štýl komunikácie

**Základné pravidlá:**

- Priateľský, teplý, osobný tón
- Neformálne oslovenie "ty"
- Stručnosť (2-3 vety)
- 1 emoji max na správu

**Prispôsobenie situácii:**

- Potvrdenie účasti → Nadšenie: _"To je super, teším sa na teba! 🎉"_
- Odmietnutie účasti → Empatia: _"Ďakujeme za odpoveď. Budete nám chýbať! 💕"_
- Zložité diétne obmedzenia → Pozornosť: _"Dobre, poznačil som si. Kuchyňa bude vedieť."_

---

## 9. Kritériá úspešnosti

### 9.1 Kvantitatívne metriky

1. **RSVP completion rate**
   - Cieľ: ≥ 85% pozvaných hostí odovzdá kompletné RSVP
   - Meranie: (počet complete RSVP / počet pozvaných) × 100%

2. **Average time to complete RSVP**
   - Cieľ: ≤ 3 minúty
   - Meranie: Čas od začiatku session po označenie `isComplete = true`

3. **QR code scan success rate**
   - Cieľ: ≥ 99% úspešných skenovaní QR kódov
   - Meranie: (úspešné skeny / všetky pokusy) × 100%

4. **Edit rate**
   - Cieľ: ≤ 10% hostí upraví svoju odpoveď
   - Meranie: (počet upravených RSVP / počet complete RSVP) × 100%

### 9.2 Kvalitatívne metriky

1. **User satisfaction**
   - Späťná väzba hostí na jednoduchosť použitia
   - Absencia sťažností na komplikovanosť

2. **Data quality**
   - Počet chýb v diétnych obmedzeniach (0% tolerancia)
   - Jasnosť a spracovateľnosť textu v `dietaryRestrictions` poli

3. **Agent understanding**
   - Absencia prípadov, kde agent nerozumel hosťovi
   - Minimálny počet spresňovacích otázok

---

## 10. Boundary conditions a Obmedzenia

### 10.1 Technické obmedzenia

- **Maximálna dĺžka správy:** 1000 znakov
- **Prístup:** Výhradne cez QR kód (žiadna manuálna identifikácia)
- **Session expirácia:** 1 rok (cookie)
- **Podpora jazykov:** Slovenčina iba

### 10.2 Funkcionálne obmedzenia

- Systém **NEPOSIELA** notifikácie ani emaily
- Systém **NEUMOŽŇUJE** pridávanie ďalších osôb mimo pozvánky
- Systém **NEUMOŽŇUJE** priame upravovanie RSVP cez UI (len cez konverzáciu)
- Agent **NEODPOVEDÁ** na otázky nesúvisiace so svadbou

### 10.3 Biznis obmedzenia

- Prístup k RSVP funkcionalite majú **iba** potvrdení hostia
- Jedna skupinová RSVP odpoveď reprezentuje **celú skupinu** (nie individuálne odpovede)
- RSVP dáta sú dostupné **iba** neveste a ženíchovi (nie verejne)

---

## 11. Prílohy

### A. Glosár pojmov

- **AI Agent**: Konverzačný asistent poháňaný umelou inteligenciou
- **QR Token**: Unikátny identifikátor zakódovaný v QR kóde
- **Session**: Jedna konverzácia hosťa so systémom
- **Conversation State**: Aktuálny stav konverzačného flow
- **RSVP**: "Répondez s'il vous plaît" - Potvrdenie účasti
- **Guest Group**: Skupina hostí s jednou spoločnou pozvánkou
- **Fuzzy Matching**: Algoritmus na tolerovanie preklepov pri vyhľadávaní

### B. Svadobné informácie (Knowledge Base)

**Základné údaje:**

- Dátum: 27. marec 2026
- Miesto: Modra, Slovensko

**Sobáš (Obrad):**

- Čas: 15:30
- Miesto: Nová sobášna miestnosť mesta Modra, Štúrova 59, 900 01 Modra

**Svadba (Hostina):**

- Čas: Po obrade až do polnoci
- Miesto: Reštaurácia Starý Dom, Dukelská 2, 900 01 Modra

**Darčeky:**

- Nevesta nechce veľké kytice
- Akékoľvek iné darčeky sú vítané

---

## Changelog

### Verzia 1.2 (December 2024)

**Zmena biznis požiadavky: Odstránenie manuálnej identifikácie (no-QR flow)**

Systém bol zjednodušený tak, aby fungoval výhradne s QR kódmi:

- **Pôvodná požiadavka (v1.1):** Systém podporoval QR kód aj manuálnu identifikáciu
- **Nová požiadavka (v1.2):** Systém funguje **výhradne s QR kódmi**. Manuálna identifikácia bola odstránená.

**Dotknuté sekcie:**

- Sekcia 3: Aktori systému
  - Odstránená sekcia 3.2: Návštevníci bez pozvánky
  - Prečíslované sekcie

- Sekcia 4: Use Cases
  - **Odstránené:** UC-03 (Manuálna identifikácia), UC-04 (Neúspešná identifikácia)
  - Prečíslované zvyšné use cases (UC-05 → UC-03, UC-06 → UC-04, UC-07 → UC-05, UC-08 → UC-06)

- Sekcia 5.1: Identifikácia a autentifikácia
  - **Odstránené:** FR-02 (Manuálna identifikácia)
  - FR-01 upravené: Pridané "výhradne cez QR token"
  - Prečíslované zvyšné funkcionálne požiadavky

- Sekcia 6.3: Konverzačné flow diagramy
  - **Odstránený:** No QR flow diagram

- Sekcia 9.1: Kvantitatívne metriky
  - Zmenená metrika z "Identification success rate" na "QR code scan success rate"

- Sekcia 10.1: Technické obmedzenia
  - Odstránený "Maximálny počet pokusov o identifikáciu"
  - Pridané: "Prístup: Výhradne cez QR kód"

**Dôvod zmeny:**
Zjednodušenie systému a zabezpečenie, že len pozvaní hostia s QR kódom majú prístup k RSVP funkcionalite.

### Verzia 1.1 (December 2024)

**Zmena biznis požiadavky: Povinná účasť na sobáši**

Upravená požiadavka týkajúca sa účasti hostí na sobáši a hostine:

- **Pôvodná požiadavka (v1.0):** Hostia mohli potvrdiť účasť len na hostine bez sobáša
- **Nová požiadavka (v1.1):** Hostia musia prísť na sobáš aj hostinu. Nie je možné potvrdiť účasť len na hostine.

**Dotknuté sekcie:**

- UC-05: Zber RSVP - Individuálny hosť
  - Odstránený samostatný krok "Účasť na obrade"
  - Agent teraz v úvodnej otázke vysvetlí: "To znamená na sobáš o 15:30 aj hostinu"

- UC-06: Zber RSVP - Skupinová odpoveď
  - Rovnaká úprava ako UC-05

- UC-08: Úprava RSVP odpovede
  - Pridaná poznámka, že hostia nemôžu meniť attendCeremony samostatne

- FR-04: Povinné polia
  - Pridaná poznámka: attendCeremony je automaticky = true ak willAttend = true

- Sekcia 6: Konverzačné flow diagramy
  - Aktualizované flow diagramy (odstránený krok "Obrad?")

- Sekcia 7: RSVP dátový model
  - Pridané komentáre k poliu attendCeremony
  - Aktualizované príklady RSVP odpovedí

**Dôvod zmeny:**
Zjednodušenie RSVP procesu a vylúčenie možnosti že hostia prídu len na hostinu bez sobáša.

---

**Koniec dokumentu**

_Tento dokument je živý dokument a môže byť aktualizovaný podľa potreby počas vývoja produktu._
