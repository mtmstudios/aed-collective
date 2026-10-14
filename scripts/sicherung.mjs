/**
 * Sichert Datenbank und hochgeladene Dateien – und spielt sie zurück.
 *
 * Während des Wettbewerbs ist das die einzige Kopie der Einreichungen. Die
 * Sicherung braucht keine Postgres-Werkzeuge auf dem Server, nur Node.
 *
 *   node scripts/sicherung.mjs                     # sichern
 *   node scripts/sicherung.mjs --einspielen <ordner>
 *
 * Umgebungsvariablen: DATABASE_URL, DATEI_ABLAGE (wie im Betrieb),
 * optional SICHERUNG_ORDNER (Voreinstellung ./sicherungen).
 */
import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import pg from "pg";

const DATABASE_URL = process.env["DATABASE_URL"];
const ABLAGE = resolve(process.env["DATEI_ABLAGE"] ?? "./dateien");
const ZIEL = resolve(process.env["SICHERUNG_ORDNER"] ?? "./sicherungen");

if (!DATABASE_URL) {
  console.error("DATABASE_URL fehlt.");
  process.exit(1);
}

/** Reihenfolge beachten: Verweise müssen vor ihren Verwendern eingespielt werden. */
const TABELLEN = [
  "bildrechte",
  "articles",
  "sections",
  "images",
  "neuland_einreichungen",
  "jury_zugaenge",
  "jury_wertungen",
];

const JSON_SPALTEN = new Set(["titelbild", "detailfotos"]);

const client = new pg.Client(DATABASE_URL);
await client.connect();

const einspielen = process.argv.indexOf("--einspielen");
if (einspielen !== -1) {
  await zurueck(process.argv[einspielen + 1]);
} else {
  await sichern();
}

await client.end();

async function sichern() {
  const stempel = new Date().toISOString().slice(0, 19).replaceAll(":", "-");
  const ordner = resolve(ZIEL, stempel);
  await mkdir(ordner, { recursive: true });

  const daten = {};
  let zeilen = 0;
  for (const tabelle of TABELLEN) {
    const ergebnis = await client.query(`SELECT * FROM ${tabelle}`);
    daten[tabelle] = ergebnis.rows;
    zeilen += ergebnis.rows.length;
    console.log(`  ${tabelle}: ${ergebnis.rows.length} Zeilen`);
  }

  await writeFile(resolve(ordner, "daten.json"), JSON.stringify(daten, null, 2), "utf8");

  let dateien = 0;
  try {
    const liste = await readdir(ABLAGE);
    if (liste.length > 0) {
      await cp(ABLAGE, resolve(ordner, "dateien"), { recursive: true });
      dateien = liste.length;
    }
  } catch {
    console.log("  (keine Dateiablage gefunden)");
  }

  console.log(`\nGesichert: ${zeilen} Zeilen, ${dateien} Dateien`);
  console.log(`Ordner: ${ordner}`);
}

async function zurueck(ordner) {
  if (!ordner) {
    console.error("Welcher Ordner? node scripts/sicherung.mjs --einspielen <ordner>");
    process.exit(1);
  }
  const quelle = resolve(ordner);
  const daten = JSON.parse(await readFile(resolve(quelle, "daten.json"), "utf8"));

  for (const tabelle of TABELLEN) {
    const zeilen = daten[tabelle] ?? [];
    let geschrieben = 0;
    for (const zeile of zeilen) {
      const spalten = Object.keys(zeile);
      const werte = spalten.map((spalte) => {
        const wert = zeile[spalte];
        return wert !== null && JSON_SPALTEN.has(spalte) ? JSON.stringify(wert) : wert;
      });
      const ergebnis = await client.query(
        `INSERT INTO ${tabelle} (${spalten.map((s) => `"${s}"`).join(", ")})
         VALUES (${spalten.map((_, i) => `$${i + 1}`).join(", ")})
         ON CONFLICT DO NOTHING`,
        werte,
      );
      geschrieben += ergebnis.rowCount ?? 0;
    }
    console.log(`  ${tabelle}: ${geschrieben} von ${zeilen.length} eingespielt`);
  }

  // Nummernkreis hinter den eingespielten Stand setzen.
  await client.query(`
    SELECT setval('neuland_einreichung_nr_seq',
      GREATEST(COALESCE((SELECT max(substring(einreichungs_id from 'NL27-([0-9]+)')::int)
                         FROM neuland_einreichungen), 0), 1))`);

  console.log(`\nDie Dateien liegen in ${resolve(quelle, "dateien")} und gehören nach ${ABLAGE}.`);
}
