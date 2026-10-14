/**
 * Holt die Daten aus Supabase in die eigene PostgreSQL-Datenbank.
 *
 * Kopiert werden die sieben Tabellen und die hochgeladenen Bilder der
 * Einreichungen. Das Skript lässt sich mehrfach laufen: vorhandene Zeilen
 * bleiben unangetastet, fehlende kommen dazu.
 *
 *   SUPABASE_URL=https://<projekt>.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=... \
 *   DATABASE_URL=postgres://... \
 *   DATEI_ABLAGE=./dateien \
 *   node scripts/umzug-von-supabase.mjs
 *
 * Vorher muss das Schema stehen: psql "$DATABASE_URL" -f db/schema.sql
 */
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import pg from "pg";

const SUPABASE_URL = process.env["SUPABASE_URL"];
const SCHLUESSEL = process.env["SUPABASE_SERVICE_ROLE_KEY"];
const DATABASE_URL = process.env["DATABASE_URL"];
const ABLAGE = resolve(process.env["DATEI_ABLAGE"] ?? "./dateien");
const BUCKET = "neuland-einreichungen";

if (!SUPABASE_URL || !SCHLUESSEL || !DATABASE_URL) {
  console.error("Es fehlen SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY oder DATABASE_URL.");
  process.exit(1);
}

const kopf = { apikey: SCHLUESSEL, Authorization: `Bearer ${SCHLUESSEL}` };

/** Reihenfolge beachten: Verweise müssen vorhanden sein, bevor sie benutzt werden. */
const TABELLEN = [
  "bildrechte",
  "articles",
  "sections",
  "images",
  "neuland_einreichungen",
  "jury_zugaenge",
  "jury_wertungen",
];

/** Spalten, die JSON enthalten – sie müssen als Text übergeben werden. */
const JSON_SPALTEN = new Set(["titelbild", "detailfotos"]);

async function holeTabelle(name) {
  const zeilen = [];
  const schritt = 1000;
  for (let ab = 0; ; ab += schritt) {
    const antwort = await fetch(
      `${SUPABASE_URL}/rest/v1/${name}?select=*&limit=${schritt}&offset=${ab}`,
      { headers: kopf },
    );
    if (!antwort.ok) throw new Error(`${name}: ${antwort.status} ${await antwort.text()}`);
    const teil = await antwort.json();
    zeilen.push(...teil);
    if (teil.length < schritt) break;
  }
  return zeilen;
}

async function schreibeTabelle(client, name, zeilen) {
  if (zeilen.length === 0) return 0;
  const spalten = Object.keys(zeilen[0]);
  let geschrieben = 0;

  for (const zeile of zeilen) {
    const werte = spalten.map((spalte) => {
      const wert = zeile[spalte];
      if (wert !== null && JSON_SPALTEN.has(spalte)) return JSON.stringify(wert);
      return wert;
    });
    const ergebnis = await client.query(
      `INSERT INTO ${name} (${spalten.map((s) => `"${s}"`).join(", ")})
       VALUES (${spalten.map((_, i) => `$${i + 1}`).join(", ")})
       ON CONFLICT DO NOTHING`,
      werte,
    );
    geschrieben += ergebnis.rowCount ?? 0;
  }
  return geschrieben;
}

async function holeDateien() {
  const antwort = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
    method: "POST",
    headers: { ...kopf, "Content-Type": "application/json" },
    body: JSON.stringify({ limit: 1000, offset: 0, prefix: "" }),
  });
  if (!antwort.ok) throw new Error(`Dateiliste: ${antwort.status} ${await antwort.text()}`);
  const liste = await antwort.json();

  await mkdir(ABLAGE, { recursive: true });
  let geholt = 0;
  for (const eintrag of liste) {
    if (!eintrag?.name) continue;
    const datei = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${eintrag.name}`, {
      headers: kopf,
    });
    if (!datei.ok) {
      console.warn(`  ${eintrag.name}: ${datei.status}, übersprungen`);
      continue;
    }
    await writeFile(resolve(ABLAGE, eintrag.name), Buffer.from(await datei.arrayBuffer()));
    geholt += 1;
  }
  return { gefunden: liste.length, geholt };
}

const client = new pg.Client(DATABASE_URL);
await client.connect();

console.log("Tabellen");
for (const name of TABELLEN) {
  const zeilen = await holeTabelle(name);
  const geschrieben = await schreibeTabelle(client, name, zeilen);
  console.log(`  ${name}: ${zeilen.length} gelesen, ${geschrieben} neu übernommen`);
}

// Die laufende Nummer muss hinter den übernommenen Einreichungen weitergehen,
// sonst vergibt die Datenbank eine Nummer, die es schon gibt.
await client.query(`
  SELECT setval('neuland_einreichung_nr_seq',
    GREATEST(COALESCE((SELECT max(substring(einreichungs_id from 'NL27-([0-9]+)')::int)
                       FROM neuland_einreichungen), 0), 1))`);
const stand = await client.query(`SELECT last_value FROM neuland_einreichung_nr_seq`);
console.log(`  laufende Nummer steht auf ${stand.rows[0].last_value}`);

console.log("\nDateien");
const dateien = await holeDateien();
console.log(`  ${dateien.geholt} von ${dateien.gefunden} nach ${ABLAGE} kopiert`);

await client.end();
console.log("\nFertig.");
