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
| `SESSION_SECRET` | – | Sitzungs-Cookies, **mindestens 32 Zeichen** |
| `SITE_URL` | `https://www.aed-stuttgart.de` | Ziel der Umleitungen und Adressen in der Sitemap; nur für Testumgebungen zu ändern |
| `SMTP_HOST`, `SMTP_PORT` | `mail.your-server.de`, `587` | Mailversand |
| `SMTP_USER`, `SMTP_PASS` | – | Postfach des Vereins |
| `MAIL_VON` | `aed neuland <neuland@aed-stuttgart.de>` | Absender |
| `MAIL_AN_VEREIN` | `neuland@aed-stuttgart.de` | Einreichungen und Mitgliedsanträge |
| `MAILCHIMP_API_KEY` | `…-us21` | Newsletter-Anmeldung; der Teil hinter dem letzten Bindestrich ist der Serverstandort |
| `MAILCHIMP_LIST_ID` | – | Zielgruppe („Audience") im Mailchimp-Konto des Vereins |

Fehlen die SMTP-Angaben, verschickt die Seite keine Mails und vermerkt das
einmal im Log; Einreichungen funktionieren weiter. Fehlt `DATABASE_URL`, bleibt
die Seite erreichbar, zeigt aber keine Daten aus der Datenbank.

**`SESSION_SECRET` unter 32 Zeichen legt die Seite lahm.** Die Sitzungsbibliothek
weist kürzere Werte ab, und zwar bei jedem Aufruf – jede Seite antwortet dann
mit Fehler 500. Beim Start schreibt die Anwendung die fehlenden oder zu kurzen
Werte ins Log (`[Start] …`), damit man nicht danach suchen muss.

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

## Formulare

Drei Formulare schicken Daten weg, jedes auf eigenem Weg:

| Formular | Weg | Ohne Zugangsdaten |
|---|---|---|
| neuland-Einreichung | Datenbank, dazu Mail an Verein und einreichende Person | wird gespeichert, es gehen nur keine Mails raus |
| Mitgliedsantrag | Mail an `MAIL_AN_VEREIN`, Bestätigung an die Person | Formular meldet offen, dass es nicht geht |
| Newsletter | Mailchimp-API, Status `pending` (Double-Opt-in) | Formular meldet offen, dass es nicht geht |

**Mailchimp bleibt, wo es ist.** Der Umzug betrifft nur die DNS-Zone; daraus
müssen die DKIM-Einträge `k2`/`k3` und der SPF-Eintrag mitgenommen werden,
damit Mailchimps eigener Versand authentifiziert bleibt. Die Anmeldung über die
API ist davon unabhängig und funktioniert vor wie nach dem Umzug.

Die Anmeldung wird mit Status `pending` eingetragen: Mailchimp verschickt die
Bestätigungsmail, erst der Klick darin macht sie gültig. Wer das Häkchen für
neuland setzt, bekommt in Mailchimp die Marke `neuland`.

Zum Prüfen ohne echte Zugänge gibt es Nachbauten beider Gegenstellen:

```bash
node scripts/formulare-sinken.mjs      # Mailchimp auf 55435, SMTP auf 55436
```

## Umleitungen beim Umzug

Sobald alle drei Namen auf den neuen Server zeigen, beantwortet die Anwendung
die alten Adressen selbst dauerhaft (301, `src/lib/umleitungen.ts`):

- `aed-neuland.de/*` → die entsprechende Seite unter `www.aed-stuttgart.de/neuland/...`,
  Unbekanntes auf `/neuland`
- `aed-stuttgart.de/*` → `www.aed-stuttgart.de/*` mitsamt Pfad und Parametern
- Die alten neuland-Adressen funktionieren auch auf der Hauptdomain

Die Zuordnung stammt aus dem Crawl vom 28.07.2026 und steht als Tabelle
`ALT_PFADE` im selben Modul; neue Fälle gehören dort hinein. In konsoleH muss
für die Domains also keine eigene Weiterleitung eingerichtet werden.

**Vor dem Umschalten prüfen:** Die Seite steht noch hinter der Passwortsperre
(`/unlock`). Ob sie beim Umzug offen sein soll, ist eine Entscheidung des
Vereins.

## Skripte

| Befehl | Wofür |
|---|---|
| `npm run build:node` | Produktionsbuild für Node |
| `./scripts/ausspielen.sh` | bauen, per rsync übertragen, Neustart anstoßen |
| `node scripts/sicherung.mjs` | Datenbank und Dateien sichern |
| `node scripts/sicherung.mjs --einspielen <ordner>` | Sicherung zurückspielen |
| `node scripts/umzug-von-supabase.mjs` | einmaliger Datenumzug |
| `node scripts/umzug-pruefen.mjs` | Trockenlauf des Umzugs gegen eine nachgebaute Schnittstelle |
| `node scripts/mail-pruefen.mjs [adresse]` | SMTP-Zugang prüfen, auf Wunsch Testmail |
| `node scripts/db-pruefen.mjs` | Schema gegen echtes Postgres prüfen |
| `node scripts/db-lokal.mjs` | Entwicklungsdatenbank ohne Installation |

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
