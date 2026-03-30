# Migrácia na Cloudflare Images + Stream

Podrobný návod na nasadenie migrácie media pipeline z R2 na Cloudflare Images (obrázky) a Cloudflare Stream (videá).

> **Všetky kroky sú cez `curl` — žiadny Dashboard nie je potrebný.**

## Prehľad zmien

| Pred | Po |
|---|---|
| Obrázky v R2 buckete | Cloudflare Images (automatická konverzia HEIC→WebP, varianty) |
| Videá v R2 buckete | Cloudflare Stream (transcoding, adaptívny streaming, thumbnaily) |
| Client-side thumbnail generovanie | Server-side cez CF |
| Client-side HEIC konverzia | CF Images natívna podpora |
| S3 SDK + presigned URLs | CF Direct Creator Upload |
| Audio v R2 | Audio v R2 (bez zmeny) |

## Premenné použité v tomto návode

Nastavte si tieto premenné v termináli pred začatím:

```bash
export CF_ACCOUNT_ID="fb0866add4b7bc5813b01a16ce090bfc"
export CF_TOKEN="<váš CF_IMAGE_TOKEN>"
export WEDDING_SECRET="<váš SECRET>"
```

---

## Krok 1: Vytvorenie Image Variants

CF Images potrebuje dva varianty — `thumbnail` (400x400 cover pre grid) a `public` (plná veľkosť pre lightbox).

### 1.1 Vytvoriť variant `thumbnail`

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/variants" \
  -H "Authorization: Bearer ${CF_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "thumbnail",
    "options": {
      "fit": "cover",
      "width": 400,
      "height": 400,
      "metadata": "none"
    },
    "neverRequireSignedURLs": true
  }'
```

Očakávaná odpoveď:
```json
{
  "success": true,
  "result": {
    "variant": {
      "id": "thumbnail",
      "options": { "fit": "cover", "width": 400, "height": 400, "metadata": "none" }
    }
  }
}
```

### 1.2 Vytvoriť variant `public`

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/variants" \
  -H "Authorization: Bearer ${CF_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "public",
    "options": {
      "fit": "scale-down",
      "width": 4096,
      "height": 4096,
      "metadata": "none"
    },
    "neverRequireSignedURLs": true
  }'
```

### 1.3 Overiť že varianty existujú

```bash
curl -s "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/variants" \
  -H "Authorization: Bearer ${CF_TOKEN}" | jq '.result.variants | keys'
```

Očakávaný výstup: `["public", "thumbnail"]`

---

## Krok 2: Registrácia Stream Webhook

Stream webhook je potrebný na to, aby sa video po spracovaní (transcoding) označilo ako pripravené na prehrávanie. Bez webhoooku by videá zostali v stave "Spracúva sa..." navždy.

### 2.1 Registrovať webhook

```bash
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/webhook" \
  -H "Authorization: Bearer ${CF_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{ "notificationUrl": "https://ivonka-roman-forever.love/api/webhooks/stream" }'
```

Očakávaná odpoveď:
```json
{
  "success": true,
  "result": {
    "notificationUrl": "https://ivonka-roman-forever.love/api/webhooks/stream",
    "secret": "..."
  }
}
```

> Poznámka: Stream podporuje iba jeden webhook URL na účet. PUT nahradí existujúci.

### 2.2 Overiť webhook

```bash
curl -s "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/webhook" \
  -H "Authorization: Bearer ${CF_TOKEN}" | jq '.result'
```

---

## Krok 3: API Token ako Worker Secret

Ak ste ešte nenastavili secret:

```bash
wrangler secret put CF_IMAGE_TOKEN
# Vložte token keď sa vás spýta
```

Pre lokálny vývoj pridajte do `.dev.vars`:
```
CF_IMAGE_TOKEN=váš-api-token
```

### Overenie že secret je nastavený

```bash
wrangler secret list | grep CF_IMAGE_TOKEN
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

Overenie:
```bash
curl -s https://ivonka-roman-forever.love/version | jq .
```

---

## Krok 6: Migrácia existujúcich médií z R2

Tento krok prenesie všetky existujúce obrázky a videá z R2 do CF Images/Stream.

### 6.1 Spustenie migrácie

Migrácia beží v dávkach po 5 položkách (kvôli CPU limitu Workeru). Opakujte volanie kým `remaining` nebude 0.

```bash
curl -s -X POST https://ivonka-roman-forever.love/api/admin/migrate-media \
  -H "x-api-key: ${WEDDING_SECRET}" | jq .
```

### 6.2 Odpoveď

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

### 6.3 Automatická migrácia (loop)

```bash
while true; do
  RESULT=$(curl -s -X POST https://ivonka-roman-forever.love/api/admin/migrate-media \
    -H "x-api-key: ${WEDDING_SECRET}")
  echo "$RESULT" | jq .
  REMAINING=$(echo "$RESULT" | jq .remaining)
  if [ "$REMAINING" = "0" ]; then
    echo "✅ Migrácia dokončená!"
    break
  fi
  echo "⏳ Zostáva: $REMAINING. Pokračujem za 5 sekúnd..."
  sleep 5
done
```

### 6.4 Chyby pri migrácii

| Chyba | Príčina | Riešenie |
|---|---|---|
| Obrázok > 10MB | CF Images limit | Manuálne zmenšiť a znovu nahrať |
| Video > 200MB | CF Stream API limit | Nahrať cez Stream Direct Creator Upload manuálne |
| R2 objekt neexistuje | Orphan záznam v DB | Zmazať záznam z D1 |

---

## Krok 7: Overenie

### 7.1 Galéria

```bash
# Otvorte v prehliadači:
echo "https://ivonka-roman-forever.love/gallery?token=<SECRET_REPORT_TOKEN>"
```

Skontrolujte:
- [ ] Všetky obrázky sa zobrazujú (aj HEIC)
- [ ] Thumbnaily sa načítajú rýchlo (nie full-res)
- [ ] Videá majú automatický thumbnail
- [ ] Video prehrávanie funguje v lightboxe (adaptívne)
- [ ] Videá so stavom "Spracúva sa..." sa po chvíli zmenia na prehrávateľné

### 7.2 Upload nových médií

Otvorte stránku s QR tokenom (tab "Fotky") a nahrajte:
- [ ] JPEG obrázok — zobrazí sa okamžite
- [ ] HEIC obrázok z iPhone — CF Images skonvertuje automaticky
- [ ] MP4 video — Stream spracuje, po chvíli prehrávateľné
- [ ] MOV/HEVC video z iPhone — Stream transcóduje

### 7.3 Audio (bez zmeny)

- [ ] Nahrávanie audio stále funguje
- [ ] Prehrávanie existujúcich nahrávok funguje

### 7.4 Overenie cez API

```bash
# Počet obrázkov v CF Images
curl -s "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/stats" \
  -H "Authorization: Bearer ${CF_TOKEN}" | jq '.result.count'

# Počet videí v CF Stream
curl -s "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream?limit=1" \
  -H "Authorization: Bearer ${CF_TOKEN}" | jq '.result_info.total_count'
```

---

## Krok 8: Upratanie starých secrets

Po úspešnej migrácii odstráňte nepotrebné R2 secrets:

```bash
wrangler secret delete R2_ACCESS_KEY_ID
wrangler secret delete R2_SECRET_ACCESS_KEY
wrangler secret delete R2_ENDPOINT
```

### Overenie R2 bucketu

R2 bucket by mal obsahovať iba audio nahrávky:

```bash
# Výpis photo/video objektov (mali by byť prázdne)
wrangler r2 object list wedding-photos --prefix "groups/" 2>&1 | grep -c "/photos/"

# Výpis audio objektov (tieto zostávajú)
wrangler r2 object list wedding-photos --prefix "groups/" 2>&1 | grep -c "/audio/"
```

---

## Rollback plán

| Situácia | Postup |
|---|---|
| Migrácia ešte neprebehla | Revertujte PR, žiadne dáta sa nestratili |
| Migrácia čiastočne prebehla | Nemigrované položky stále v R2 (fungujú cez fallback). Migrované sú v CF. Opravte bug a re-deploynite |
| Migrácia dokončená | R2 foto/video objekty boli zmazané. Dáta sú v CF Images/Stream. Opravte bug v kóde, nie v dátach |

---

## Cenník (odhad pre svadobnú appku)

| Služba | Metrika | Odhad |
|---|---|---|
| CF Images | ~500 obrázkov | ~$0.03/mesiac |
| CF Stream | ~50 minút videa | ~$0.25/mesiac |
| R2 (audio) | ~100 nahrávok | ~$0.01/mesiac |
| **Celkom** | | **~$0.30/mesiac** |

---

## Env premenné — kompletný prehľad

### V `wrangler.jsonc` (vars — verejné):

| Premenná | Hodnota | Účel |
|---|---|---|
| `CF_ACCOUNT_ID` | `fb0866add4b7bc5813b01a16ce090bfc` | Cloudflare Account ID |
| `CF_IMAGES_ACCOUNT_HASH` | `RGjy3nJORK4YV7rkav2-Zg` | Hash pre imagedelivery.net URL |
| `CF_STREAM_CUSTOMER_CODE` | `fb0866add4b7bc5813b01a16ce090bfc` | Code pre cloudflarestream.com URL |

### Secrets (cez `wrangler secret put`):

| Secret | Účel |
|---|---|
| `CF_IMAGE_TOKEN` | API token s Images + Stream oprávneniami |
| `SECRET` | Admin secret (seed, migrácia) |
| `SECRET_REPORT_TOKEN` | Token pre galériu |

### Odstránené po migrácii:

| Secret | Dôvod odstránenia |
|---|---|
| `R2_ACCESS_KEY_ID` | S3 SDK odstránený |
| `R2_SECRET_ACCESS_KEY` | S3 SDK odstránený |
| `R2_ENDPOINT` | S3 SDK odstránený |

---

## Rýchly prehľad — všetky príkazy v poradí

```bash
# 0. Nastaviť premenné
export CF_ACCOUNT_ID="fb0866add4b7bc5813b01a16ce090bfc"
export CF_TOKEN="<váš-token>"
export WEDDING_SECRET="<váš-secret>"

# 1. Vytvoriť Image varianty
curl -X POST "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/variants" \
  -H "Authorization: Bearer ${CF_TOKEN}" -H "Content-Type: application/json" \
  -d '{"id":"thumbnail","options":{"fit":"cover","width":400,"height":400,"metadata":"none"},"neverRequireSignedURLs":true}'

curl -X POST "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/variants" \
  -H "Authorization: Bearer ${CF_TOKEN}" -H "Content-Type: application/json" \
  -d '{"id":"public","options":{"fit":"scale-down","width":4096,"height":4096,"metadata":"none"},"neverRequireSignedURLs":true}'

# 2. Registrovať Stream webhook
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/webhook" \
  -H "Authorization: Bearer ${CF_TOKEN}" -H "Content-Type: application/json" \
  -d '{"notificationUrl":"https://ivonka-roman-forever.love/api/webhooks/stream"}'

# 3. Nastaviť secret (interaktívne)
wrangler secret put CF_IMAGE_TOKEN

# 4. DB migrácia
npm run db:migrate:remote

# 5. Deploy
npm run deploy

# 6. Migrovať existujúce médiá z R2
while true; do
  RESULT=$(curl -s -X POST https://ivonka-roman-forever.love/api/admin/migrate-media \
    -H "x-api-key: ${WEDDING_SECRET}")
  echo "$RESULT" | jq .
  [ "$(echo "$RESULT" | jq .remaining)" = "0" ] && echo "✅ Hotovo!" && break
  sleep 5
done

# 7. Overiť
curl -s "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/stats" \
  -H "Authorization: Bearer ${CF_TOKEN}" | jq '.result.count'

# 8. Upratať staré secrets
wrangler secret delete R2_ACCESS_KEY_ID
wrangler secret delete R2_SECRET_ACCESS_KEY
wrangler secret delete R2_ENDPOINT
```
