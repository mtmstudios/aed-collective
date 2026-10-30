/**
 * Holt die über Lovable hochgeladenen Bilder in den Build.
 *
 * Bilder, die jemand in Lovable hochlädt, landen nicht im Repository, sondern
 * auf deren CDN. Im Code steht dann eine Datei wie
 *
 *     src/assets/cover/2005_01_aed.webp.asset.json
 *
 * mit einer Adresse wie "/__l5e/assets-v1/<id>/2005_01_aed.webp". In Lovables
 * eigener Vorschau liefert ein Proxy diese Adresse aus – auf unserem Server
 * gibt es sie nicht, die Bilder blieben dort leer.
 *
 * Dieses Skript lädt die Dateien herunter und legt sie unter demselben Pfad in
 * public/ ab. Damit funktionieren die Bilder auf Hetzner, ohne dass im Code
 * etwas geändert werden muss – wer in Lovable weiterarbeitet, merkt nichts
 * davon.
 *
 *   node scripts/cdn-assets-holen.mjs
 *
 * Wichtig: vor dem Bauen aufrufen. Nitro übernimmt nur, was beim Bauen in
 * public/ liegt; später abgelegte Dateien liefert der Server nicht aus.
 *
 * Die Quelle lässt sich über LOVABLE_ASSET_BASIS umstellen, falls das Projekt
 * einmal unter einer anderen Adresse liegt.
 */
import { readdir, mkdir, writeFile, access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const BASIS = process.env["LOVABLE_ASSET_BASIS"] ?? "https://aed-neuland-unison.lovable.app";
const WURZEL = resolve(import.meta.dirname, "..");
const QUELLE = join(WURZEL, "src", "assets");
const ZIEL = join(WURZEL, "public");

/** Alle .asset.json unterhalb eines Verzeichnisses, auch in Unterordnern. */
async function sammle(verzeichnis) {
  const gefunden = [];
  for (const eintrag of await readdir(verzeichnis, { withFileTypes: true })) {
    const pfad = join(verzeichnis, eintrag.name);
    if (eintrag.isDirectory()) gefunden.push(...(await sammle(pfad)));
    else if (eintrag.name.endsWith(".asset.json")) gefunden.push(pfad);
  }
  return gefunden;
}

async function existiert(pfad) {
  try {
    await access(pfad);
    return true;
  } catch {
    return false;
  }
}

const dateien = await sammle(QUELLE).catch(() => []);
if (dateien.length === 0) {
  console.log("Keine CDN-Bilder gefunden – nichts zu tun.");
  process.exit(0);
}

let geholt = 0;
let vorhanden = 0;
const fehler = [];

for (const datei of dateien) {
  let angabe;
  try {
    angabe = JSON.parse(await readFile(datei, "utf8"));
  } catch (grund) {
    fehler.push(`${datei}: unlesbar (${grund.message})`);
    continue;
  }

  if (!angabe.url) {
    fehler.push(`${datei}: keine Adresse hinterlegt`);
    continue;
  }

  const ziel = join(ZIEL, angabe.url);
  if (await existiert(ziel)) {
    vorhanden++;
    continue;
  }

  try {
    const antwort = await fetch(BASIS + angabe.url);
    if (!antwort.ok) throw new Error(`Antwort ${antwort.status}`);

    const inhalt = Buffer.from(await antwort.arrayBuffer());
    // Eine Fehlerseite statt des Bildes fällt sonst erst im Browser auf.
    if (angabe.size && Math.abs(inhalt.length - angabe.size) > angabe.size * 0.1) {
      throw new Error(`${inhalt.length} statt ${angabe.size} Bytes`);
    }

    await mkdir(dirname(ziel), { recursive: true });
    await writeFile(ziel, inhalt);
    geholt++;
  } catch (grund) {
    fehler.push(`${angabe.original_filename ?? angabe.url}: ${grund.message}`);
  }
}

console.log(`${geholt} geholt, ${vorhanden} schon vorhanden, ${dateien.length} insgesamt.`);

if (fehler.length > 0) {
  console.error(`\n${fehler.length} nicht geholt:`);
  for (const zeile of fehler) console.error(`  ${zeile}`);
  console.error(`\nOhne diese Dateien bleiben die Bilder auf der Seite leer. Quelle war ${BASIS}.`);
  process.exit(1);
}
