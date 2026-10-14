/**
 * Trockenlauf für scripts/umzug-von-supabase.mjs.
 *
 * Baut die Supabase-Schnittstelle nach, füllt sie mit Prüfdaten und lässt das
 * Umzugsskript dagegen laufen. Geprüft wird, was am Umzugstag schiefgehen
 * könnte: mehr als eine Seite Daten, JSON-Spalten, Verweise zwischen Tabellen,
 * der Nummernkreis und die Bilddateien.
 *
 *   node scripts/umzug-pruefen.mjs
 */
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import pg from "pg";

const PROJEKT = fileURLToPath(new URL("..", import.meta.url));
const DB_PORT = 55433;
const API_PORT = 55434;

let fehler = 0;
const pruefe = (was, bedingung, zusatz = "") => {
  if (bedingung) console.log(`  ok    ${was}`);
  else {
    fehler += 1;
    console.log(`  FEHLT ${was}${zusatz ? ` – ${zusatz}` : ""}`);
  }
};

/* ---------- Prüfdaten, wie sie in Supabase stünden ---------- */

const uuid = (n) => `11111111-1111-4111-8111-${String(n).padStart(12, "0")}`;

// Mehr als eine Seite (1000), damit die seitenweise Abfrage wirklich greift.
const bildrechte = Array.from({ length: 1200 }, (_, i) => ({
  id: uuid(i + 1),
  pfad: `public/bilder/projekt/2023/bild-${i}.webp`,
  dateiname: `bild-${i}.webp`,
  kategorie: "projekt",
  jahrgang: "2023",
  status: i % 3 === 0 ? "geklaert" : "ungeklaert",
  urheber: i % 3 === 0 ? "Foto: Beispiel" : "",
  rechteart: "",
  quelle: "",
  freigabedatum: null,
  notiz: "",
  verwendungen: ["neuland"],
  created_at: "2026-09-08T10:00:00+00:00",
  updated_at: "2026-09-08T10:00:00+00:00",
}));

const einreichungen = [5, 6, 7].map((nr) => ({
  id: uuid(2000 + nr),
  einreichungs_id: `NL27-00${nr}`,
  status: "eingereicht",
  vorname: "Vor",
  nachname: `Nach ${nr}`,
  email: `person${nr}@example.org`,
  telefon: null,
  institution: "HfT",
  kategorie: "Product Design",
  projekttitel: `Projekt ${nr}`,
  kurzbeschreibung: "kurz",
  idee: "idee",
  umsetzung: "umsetzung",
  nutzen: "nutzen",
  nachhaltigkeit: "nachhaltig",
  titelbild: { path: `bild-${nr}.png`, name: "titel.png", size: 70 },
  detailfotos: [{ path: `detail-${nr}.png`, name: "detail.png", size: 70 }],
  video_link: "https://example.org/v",
  rechte_bestaetigt: true,
  eingereicht_am: "2026-10-01T12:00:00+00:00",
  created_at: "2026-09-30T12:00:00+00:00",
  updated_at: "2026-10-01T12:00:00+00:00",
}));

const zugaenge = [
  {
    id: uuid(3001),
    name: "Juror Eins",
    email: "eins@example.org",
    rolle: "jury",
    passwort_hash: "scrypt$aa$bb",
    aktiv: true,
    letzter_login: null,
    created_at: "2026-09-24T09:00:00+00:00",
    updated_at: "2026-09-24T09:00:00+00:00",
  },
];

const wertungen = [
  {
    id: uuid(4001),
    einreichung_id: einreichungen[0].id,
    juror_id: zugaenge[0].id,
    punkte: 7,
    kommentar: "ordentlich",
    created_at: "2026-10-02T09:00:00+00:00",
    updated_at: "2026-10-02T09:00:00+00:00",
  },
];

const artikel = [
  {
    id: uuid(5001),
    title: "Beispielartikel",
    created_at: "2026-09-09T09:00:00+00:00",
    updated_at: "2026-09-09T09:00:00+00:00",
  },
];
const abschnitte = [
  {
    id: uuid(5101),
    article_id: artikel[0].id,
    heading: "Einleitung",
    order: 1,
    created_at: "2026-09-09T09:00:00+00:00",
    updated_at: "2026-09-09T09:00:00+00:00",
  },
];
const bilder = [
  {
    id: uuid(5201),
    article_id: artikel[0].id,
    source_url: "https://aed-neuland.de/gewinner/2023",
    image_url: "/bilder/projekt/2023/bild-0.webp",
    section_id: abschnitte[0].id,
    order_in_section: 1,
    created_at: "2026-09-09T09:00:00+00:00",
    updated_at: "2026-09-09T09:00:00+00:00",
  },
];

const TABELLEN = {
  bildrechte,
  articles: artikel,
  sections: abschnitte,
  images: bilder,
  neuland_einreichungen: einreichungen,
  jury_zugaenge: zugaenge,
  jury_wertungen: wertungen,
};

// Ein 1×1-PNG als Inhalt jeder Datei.
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);
const DATEIEN = einreichungen.flatMap((e) => [e.titelbild.path, e.detailfotos[0].path]);

/* ---------- Nachbau der Schnittstelle ---------- */

let seitenAbrufe = 0;

const api = createServer((anfrage, antwort) => {
  const url = new URL(anfrage.url, `http://127.0.0.1:${API_PORT}`);

  const rest = url.pathname.match(/^\/rest\/v1\/([a-z_]+)$/);
  if (rest) {
    const zeilen = TABELLEN[rest[1]] ?? [];
    const limit = Number(url.searchParams.get("limit") ?? 1000);
    const ab = Number(url.searchParams.get("offset") ?? 0);
    seitenAbrufe += 1;
    antwort.writeHead(200, { "Content-Type": "application/json" });
    antwort.end(JSON.stringify(zeilen.slice(ab, ab + limit)));
    return;
  }

  if (url.pathname.startsWith("/storage/v1/object/list/")) {
    antwort.writeHead(200, { "Content-Type": "application/json" });
    antwort.end(JSON.stringify(DATEIEN.map((name) => ({ name }))));
    return;
  }

  const datei = url.pathname.match(/^\/storage\/v1\/object\/[^/]+\/(.+)$/);
  if (datei && DATEIEN.includes(datei[1])) {
    antwort.writeHead(200, { "Content-Type": "image/png" });
    antwort.end(PNG);
    return;
  }

  antwort.writeHead(404);
  antwort.end("nein");
});

await new Promise((fertig) => api.listen(API_PORT, "127.0.0.1", fertig));

/* ---------- Zieldatenbank ---------- */

const db = await PGlite.create();
await db.exec(await readFile(new URL("../db/schema.sql", import.meta.url), "utf8"));
const dbServer = new PGLiteSocketServer({ db, port: DB_PORT, host: "127.0.0.1" });
await dbServer.start();

const ablage = await mkdtemp(join(tmpdir(), "aed-umzug-"));

/* ---------- Umzug laufen lassen ---------- */

console.log("Umzug läuft\n");
const lauf = spawn("node", ["scripts/umzug-von-supabase.mjs"], {
  cwd: PROJEKT,
  env: {
    ...process.env,
    SUPABASE_URL: `http://127.0.0.1:${API_PORT}`,
    SUPABASE_SERVICE_ROLE_KEY: "pruefschluessel",
    DATABASE_URL: `postgres://postgres:postgres@127.0.0.1:${DB_PORT}/postgres`,
    DATEI_ABLAGE: ablage,
  },
});

let ausgabe = "";
lauf.stdout.on("data", (teil) => (ausgabe += teil));
lauf.stderr.on("data", (teil) => (ausgabe += teil));
const code = await new Promise((fertig) => lauf.on("close", fertig));

console.log(
  ausgabe
    .trimEnd()
    .split("\n")
    .map((zeile) => `  │ ${zeile}`)
    .join("\n"),
);
console.log();

/* ---------- Ergebnis prüfen ---------- */

console.log("Ergebnis");
pruefe("Umzugsskript endet ohne Fehler", code === 0, `Rückgabewert ${code}`);

const client = new pg.Client(`postgres://postgres:postgres@127.0.0.1:${DB_PORT}/postgres`);
await client.connect();

const anzahl = async (tabelle) =>
  Number((await client.query(`SELECT count(*)::int n FROM ${tabelle}`)).rows[0].n);

pruefe(
  "alle 1200 Bildrechte übernommen (mehr als eine Seite)",
  (await anzahl("bildrechte")) === 1200,
);
pruefe(
  "seitenweise abgerufen, nicht alles auf einmal",
  seitenAbrufe > Object.keys(TABELLEN).length,
  `${seitenAbrufe} Abrufe bei ${Object.keys(TABELLEN).length} Tabellen`,
);
pruefe("Einreichungen übernommen", (await anzahl("neuland_einreichungen")) === 3);
pruefe("Jury-Zugänge übernommen", (await anzahl("jury_zugaenge")) === 1);
pruefe("Wertungen übernommen", (await anzahl("jury_wertungen")) === 1);
pruefe("Artikel, Abschnitte und Bilder übernommen", (await anzahl("images")) === 1);

const eine = (
  await client.query(
    `SELECT titelbild, detailfotos, jsonb_typeof(detailfotos) typ, eingereicht_am
     FROM neuland_einreichungen WHERE einreichungs_id = 'NL27-005'`,
  )
).rows[0];
pruefe("Titelbild bleibt ein JSON-Objekt", eine?.titelbild?.path === "bild-5.png");
pruefe(
  "Detailfotos bleiben eine JSON-Liste",
  eine?.typ === "array" && eine.detailfotos.length === 1,
);
// Hier gilt die Voreinstellung des Treibers (Date); die Umrechnung in eine
// ISO-Zeichenkette sitzt in der Anwendung, nicht im Prüfskript.
const eingereicht =
  eine?.eingereicht_am instanceof Date
    ? eine.eingereicht_am.toISOString()
    : String(eine?.eingereicht_am);
pruefe("Zeitstempel übernommen", eingereicht.startsWith("2026-10-01"), eingereicht);

const neu = (
  await client.query(
    `INSERT INTO neuland_einreichungen (email) VALUES ('naechste@example.org')
     RETURNING einreichungs_id`,
  )
).rows[0].einreichungs_id;
pruefe("nächste Nummer folgt auf die höchste übernommene", neu === "NL27-008", neu);

const dateien = await readdir(ablage);
pruefe("alle Bilder heruntergeladen", dateien.length === DATEIEN.length, `${dateien.length}`);

// Zweiter Lauf: nichts darf doppelt entstehen.
const zweiter = spawn("node", ["scripts/umzug-von-supabase.mjs"], {
  cwd: PROJEKT,
  env: {
    ...process.env,
    SUPABASE_URL: `http://127.0.0.1:${API_PORT}`,
    SUPABASE_SERVICE_ROLE_KEY: "pruefschluessel",
    DATABASE_URL: `postgres://postgres:postgres@127.0.0.1:${DB_PORT}/postgres`,
    DATEI_ABLAGE: ablage,
  },
  stdio: "ignore",
});
await client.end();
const code2 = await new Promise((fertig) => zweiter.on("close", fertig));

const nachher = new pg.Client(`postgres://postgres:postgres@127.0.0.1:${DB_PORT}/postgres`);
await nachher.connect();
const zweiteAnzahl = Number(
  (await nachher.query(`SELECT count(*)::int n FROM bildrechte`)).rows[0].n,
);
pruefe("zweiter Lauf bleibt folgenlos", code2 === 0 && zweiteAnzahl === 1200, `${zweiteAnzahl}`);
await nachher.end();

/* ---------- aufräumen ---------- */

await dbServer.stop();
await db.close();
api.close();
await rm(ablage, { recursive: true, force: true });

console.log(fehler === 0 ? "\nAlles durchgelaufen." : `\n${fehler} Prüfung(en) fehlgeschlagen.`);
process.exit(fehler === 0 ? 0 : 1);
