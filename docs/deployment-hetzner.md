# Betrieb auf Hetzner

Stand: 14.10.2026. Die Anwendung läuft vollständig bei Hetzner: Node, PostgreSQL
und die hochgeladenen Dateien. Supabase und Lovable Cloud werden nicht mehr
gebraucht.

## Was gebraucht wird

**Webhosting Level L oder höher.** Erst ab L sind Node.js, SSH und Redis
enthalten, und L bringt 100 GB Speicher sowie 20 Datenbanken mit. PostgreSQL
lässt sich in konsoleH anlegen; die Datenbank liegt auf einem eigenen Server,
der Hostname steht nach dem Anlegen in der Datenbankübersicht – nicht
`localhost`.

Solange kein Paket bestellt ist, geht nichts: konsoleH meldet im Vereinskonto
derzeit „Sie haben noch keine Produkte".

## Was vom alten Aufbau übrig ist

Nichts mehr. Ersetzt wurden:

| früher | jetzt |
|---|---|
| `supabase-js` mit Service-Role-Schlüssel | SQL über `pg`, gebündelt in `src/lib/db.server.ts` |
| Supabase Storage, Browser lud direkt hoch | `POST /api/upload`, Dateien im Dateisystem (`src/lib/dateien.server.ts`) |
| signierte Bucket-URLs für die Jury | `GET /api/datei` mit signiertem, einstündig gültigem Link |
| Supabase Auth (ungenutzt) | entfällt |
| RLS ohne Richtlinien | entfällt – es greift nur Servercode zu |

Das Schema steht in `db/schema.sql`, aus den alten Migrationen abgeleitet und
von den Supabase-Eigenheiten befreit.

## Einrichtung

1. **Datenbank anlegen** in konsoleH unter PostgreSQL. Name, Benutzer und
   Passwort notieren, Hostname aus der Übersicht übernehmen.
2. **Schema einspielen**: `psql "$DATABASE_URL" -f db/schema.sql`
3. **Daten übernehmen**, solange Supabase noch läuft:
   `node scripts/umzug-von-supabase.mjs` (siehe Kopf der Datei). Das Skript
   kopiert die sieben Tabellen samt Bildern und stellt die laufende
   Einreichungsnummer richtig.
4. **Node einrichten** in konsoleH:
   - Node-Version 22
   - Arbeitsverzeichnis: der Ordner, in dem `.output` liegt
   - Skriptpfad: `.output/server/index.mjs`
   - Memory Limit zunächst auf dem Standard lassen
   - Den Port gibt Hetzner über die Umgebung vor, er muss nicht gesetzt werden
5. **Umgebungsvariablen** eintragen (Tabelle unten).
6. **SSL** über Let's Encrypt aktivieren, sobald die Domain auf den Server zeigt.

## Umgebungsvariablen

### Zur Laufzeit

| Variable | Beispiel | Wofür |
|---|---|---|
| `DATABASE_URL` | `postgres://benutzer:passwort@host:5432/datenbank` | Datenbank |
| `DATABASE_SSL` | `1` | nur, wenn die Datenbank Verschlüsselung verlangt |
| `DATEI_ABLAGE` | `/usr/home/.../dateien` | Ordner für hochgeladene Bilder, **außerhalb** von `public/` |
| `SITE_PASSWORD` | – | Zugang zu `/admin/*`, Jury-Einrichtung, Signatur der Dateilinks |
| `SESSION_SECRET` | – | Signatur der Sitzungs-Cookies, lang und zufällig |
| `SMTP_HOST`, `SMTP_PORT` | `mail.your-server.de`, `587` | Mailversand |
| `SMTP_USER`, `SMTP_PASS` | – | Postfach des Vereins |
| `MAIL_VON` | `aed neuland <neuland@aed-stuttgart.de>` | Absender |
| `MAIL_AN_VEREIN` | `neuland@aed-stuttgart.de` | Benachrichtigung über neue Einreichungen |

Fehlen die SMTP-Angaben, verschickt die Seite keine Mails und vermerkt das
einmal im Log; Einreichungen funktionieren weiter. Fehlt `DATABASE_URL`, bleibt
die Seite erreichbar, zeigt aber keine Daten aus der Datenbank.

### Beim Bauen

Keine mehr. Die früheren `VITE_SUPABASE_*` sind entfallen.

## Deployment

```bash
npm run build:node                 # entspricht NITRO_PRESET=node-server vite build
rsync -av --delete .output/ <benutzer>@<host>:<zielpfad>/.output/
```

Danach die Node-Anwendung in konsoleH neu starten. `.output` ist in sich
geschlossen, ein `npm install` auf dem Server entfällt.

Ohne `NITRO_PRESET=node-server` baut das Projekt für Cloudflare – ein solcher
Build startet auf Hetzner nicht.

## Entwickeln ohne Server

Für die Datenbank braucht es lokal keine Installation:

```bash
node scripts/db-lokal.mjs          # PostgreSQL als WebAssembly auf Port 55432
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:55432/postgres npm run dev
```

`node scripts/db-pruefen.mjs` spielt `db/schema.sql` in eine frische Datenbank
ein und prüft die Abläufe, auf die es ankommt: laufende Nummer, Trigger,
Eindeutigkeit der Jury-Zugänge, Punktegrenzen, Kaskaden beim Löschen.

## Datensicherung

Zwei Dinge gehören gesichert, und beide zusammen:

- die Datenbank (Einreichungen, Wertungen, Bildverzeichnis)
- der Ordner aus `DATEI_ABLAGE` (die Bilder der Einreichungen)

Hetzner sichert das Webhosting täglich. Für die Zeit des Wettbewerbs ist ein
zusätzlicher eigener Abzug sinnvoll – die Einreichungen gibt es sonst nirgends.

## Offene Punkte

- Paket bestellen (Yuliy / 2F IT)
- Postfach `neuland@aed-stuttgart.de` anlegen, SMTP-Daten eintragen
- Domainumzug: Auth-Codes von Peter Scheerer, vorher TTL senken
- DNS nach dem Umzug: A/AAAA auf Hetzner, MX und SPF/DKIM/DMARC unverändert
  übernehmen, damit der Mailversand nicht abreißt
- Nach dem Umzug die Supabase-Daten noch eine Weile stehen lassen, bis der
  Betrieb auf Hetzner bestätigt ist
