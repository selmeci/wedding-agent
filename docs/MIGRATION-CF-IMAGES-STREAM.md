# Migrácia na Cloudflare Images + Stream

Podrobný návod na nasadenie migrácie media pipeline z R2 na Cloudflare Images (obrázky) a Cloudflare Stream (videá).

## Prehľad zmien

| Pred | Po |
|---|---|
| Obrázky v R2 buckete | Cloudflare Images (automatická konverzia HEIC→WebP, varianty) |
| Videá v R2 buckete | Cloudflare Stream (transcoding, adaptívny streaming, thumbnaily) |
| Client-side thumbnail generovanie | Server-side cez CF |
| Client-side HEIC konverzia | CF Images natívna podpora |
| S3 SDK + presigned URLs | CF Direct Creator Upload |
| Audio v R2 | Audio v R2 (bez zmeny) |

---

## Krok 1: Nastavenie Cloudflare Images

### 1.1 Vytvorenie Image Variants

1. Otvorte [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Choďte na **Images** → **Variants**
3. Vytvorte dva varianty:

**Variant `thumbnail`:**
- Name: `thumbnail`
- Fit: **Cover**
- Width: `400`
- Height: `400`
- Metadata: **Strip all**

**Variant `public`:**
- Name: `public`
- Fit: **Scale down**
- Width: (nechajte prázdne — zachová originál)
- Height: (nechajte prázdne)
- Metadata: **Strip all**

### 1.2 Overenie Account Hash

1. V Dashboard → **Images** → **Overview**
2. V sekcii **Developer Resources** nájdite **Account Hash**
3. Overte, že sa zhoduje s hodnotou v `wrangler.jsonc`:
   ```
   CF_IMAGES_ACCOUNT_HASH: "RGjy3nJORK4YV7rkav2-Zg"
   ```

---

## Krok 2: Nastavenie Cloudflare Stream

### 2.1 Overenie Customer Code

1. V Dashboard → **Stream** → **Overview**
2. Nájdite **Customer subdomain** alebo code
3. Overte, že sa zhoduje s hodnotou v `wrangler.jsonc`:
   ```
   CF_STREAM_CUSTOMER_CODE: "fb0866add4b7bc5813b01a16ce090bfc"
   ```

### 2.2 Registrácia Webhook

Stream webhook je potrebný na to, aby sa video po spracovaní označilo ako pripravené na prehrávanie.

1. V Dashboard → **Stream** → **Settings** → **Webhooks**
2. Pridajte webhook URL:
   ```
   https://ivonka-roman-forever.love/api/webhooks/stream
   ```
3. Uložte

Webhook sa zavolá automaticky keď Stream dokončí transcoding videa.

---

## Krok 3: API Token

### 3.1 Vytvorenie tokenu (ak ešte nemáte)

1. Dashboard → **My Profile** → **API Tokens** → **Create Token**
2. Použite **Custom token** s oprávneniami:
   - **Cloudflare Images** — Edit
   - **Cloudflare Stream** — Edit
3. Zone: **All zones** alebo špecifická doména
4. Skopírujte vygenerovaný token

### 3.2 Nastavenie tokenu ako Worker secret

Spustite v termináli:

```bash
wrangler secret put CF_IMAGE_TOKEN
```

Vložte token keď sa vás spýta. Toto nastaví secret na produkcii.

Pre lokálny vývoj pridajte do `.dev.vars`:
```
CF_IMAGE_TOKEN=váš-api-token
```

---

## Krok 4: Databázová migrácia

Migrácia pridá nové stĺpce do `photo_uploads` tabuľky:
- `cloudflare_image_id` — UUID obrázka v CF Images
- `stream_video_uid` — UID videa v CF Stream
- `stream_ready` — boolean, či Stream dokončil spracovanie

### 4.1 Lokálna migrácia (pre testovanie)

```bash
npm run db:migrate
```

### 4.2 Produkčná migrácia

```bash
npm run db:migrate:remote
```

Overte výstup — mala by sa objaviť migrácia `0006_thankful_hellfire_club.sql`.

---

## Krok 5: Deploy

```bash
npm run deploy
```

Po deployi overte, že Worker beží:
```bash
curl https://ivonka-roman-forever.love/version
```

---

## Krok 6: Migrácia existujúcich médií z R2

Tento krok prenesie všetky existujúce obrázky a videá z R2 do CF Images/Stream.

### 6.1 Spustenie migrácie

Migrácia beží v dávkach po 5 položkách (kvôli CPU limitu Workeru). Opakujte volanie kým `remaining` nebude 0.

```bash
# Nahraďte <SECRET> hodnotou vášho SECRET env variable
curl -X POST https://ivonka-roman-forever.love/api/admin/migrate-media \
  -H "x-api-key: <SECRET>"
```

### 6.2 Sledovanie priebehu

Odpoveď vyzerá takto:
```json
{
  "migrated": 5,
  "migratedImages": 3,
  "migratedVideos": 2,
  "remaining": 15,
  "remainingImages": 10,
  "remainingVideos": 5,
  "errors": []
}
```

### 6.3 Opakovanie až do dokončenia

Opakujte curl príkaz, kým `remaining` nebude `0`:

```bash
# Jednoduchý loop v bash (čaká 5 sekúnd medzi volaniami)
while true; do
  RESULT=$(curl -s -X POST https://ivonka-roman-forever.love/api/admin/migrate-media \
    -H "x-api-key: <SECRET>")
  echo "$RESULT" | jq .
  REMAINING=$(echo "$RESULT" | jq .remaining)
  if [ "$REMAINING" = "0" ]; then
    echo "Migrácia dokončená!"
    break
  fi
  echo "Zostáva: $REMAINING. Pokračujem za 5 sekúnd..."
  sleep 5
done
```

### 6.4 Chyby pri migrácii

Ak pole `errors` obsahuje položky, skontrolujte:
- **Obrázky > 10MB** — CF Images má limit 10MB. Tieto treba manuálne zmenšiť a znovu nahrať.
- **Videá > 200MB** — CF Stream API limit pre priamy upload. Tieto treba nahrať cez Dashboard manuálne.
- **R2 objekt neexistuje** — Orphan záznam v DB. Môžete ho zmazať manuálne.

---

## Krok 7: Overenie

Po dokončení migrácie overte:

### 7.1 Galéria

Otvorte galériu:
```
https://ivonka-roman-forever.love/gallery?token=<SECRET_REPORT_TOKEN>
```

Skontrolujte:
- [ ] Všetky obrázky sa zobrazujú (aj HEIC)
- [ ] Thumbnaily sa načítajú rýchlo (nie full-res)
- [ ] Videá majú automatický thumbnail
- [ ] Video prehrávanie funguje v lightboxe (adaptívne)
- [ ] Videá so stavom "Spracúva sa..." sa po chvíli zmenia na prehrávateľné

### 7.2 Upload nových médií

1. Otvorte stránku s QR tokenom (tab "Fotky")
2. Nahrajte testovacie súbory:
   - [ ] JPEG obrázok — zobrazí sa okamžite
   - [ ] HEIC obrázok z iPhone — CF Images skonvertuje automaticky
   - [ ] MP4 video — Stream spracuje, po chvíli prehrávateľné
   - [ ] MOV/HEVC video z iPhone — Stream transcóduje

### 7.3 Audio (bez zmeny)

- [ ] Nahrávanie audio stále funguje
- [ ] Prehrávanie existujúcich nahrávok funguje

### 7.4 Zmazanie

- [ ] Zmazanie obrázka z fotiek — zmizne z CF Images
- [ ] Zmazanie videa — zmizne z CF Stream

---

## Krok 8: Upratanie R2 bucketu (voliteľné)

Po úspešnej migrácii by R2 bucket mal obsahovať iba audio nahrávky (`groups/*/audio/*`). Photo a video objekty boli zmazané migračným skriptom.

Na overenie:
```bash
# Výpis objektov v buckete (cez wrangler)
wrangler r2 object list wedding-photos --prefix "groups/" | head -20
```

Ak tam zostali orphan photo/video objekty, môžete ich zmazať manuálne cez Dashboard → R2 → wedding-photos.

---

## Rollback plán

Ak niečo nefunguje:

1. **Revertujte PR** — R2 dáta existujú až kým ich migračný skript explicitne nezmaže
2. **Ak migrácia už prebehla** — obrázky a videá sú v CF Images/Stream, ale R2 objekty boli zmazané. V tomto prípade:
   - Nechajte CF Images/Stream ako zdroj
   - Opravte bug v kóde a re-deploynite
3. **Ak migrácia ešte neprebehla** — jednoduchý revert, žiadne dáta sa nestratili

---

## Cenník (odhad pre svadobnú appku)

| Služba | Metrika | Odhad |
|---|---|---|
| CF Images | ~500 obrázkov | ~$0.03/mesiac |
| CF Stream | ~50 minút videa | ~$0.25/mesiac |
| R2 (audio) | ~100 nahrávok | ~$0.01/mesiac |
| **Celkom** | | **~$0.30/mesiac** |

---

## Env premenné — kompletný zoznam

### V `wrangler.jsonc` (vars — verejné):
```
CF_ACCOUNT_ID: "fb0866add4b7bc5813b01a16ce090bfc"
CF_IMAGES_ACCOUNT_HASH: "RGjy3nJORK4YV7rkav2-Zg"
CF_STREAM_CUSTOMER_CODE: "fb0866add4b7bc5813b01a16ce090bfc"
```

### Secrets (cez `wrangler secret put`):
```
CF_IMAGE_TOKEN — API token s Images + Stream oprávneniami
SECRET — existujúci admin secret (použitý aj pre migráciu)
SECRET_REPORT_TOKEN — token pre galériu
```

### Už nepotrebné (po migrácii):
```
R2_ACCESS_KEY_ID — bol používaný pre presigned URLs (S3 SDK odstránený)
R2_SECRET_ACCESS_KEY — rovnako
R2_ENDPOINT — rovnako
```

Tieto staré secrets môžete odstrániť:
```bash
wrangler secret delete R2_ACCESS_KEY_ID
wrangler secret delete R2_SECRET_ACCESS_KEY
wrangler secret delete R2_ENDPOINT
```
