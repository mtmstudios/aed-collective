// Erzeugt src/data/bild-manifest.ts aus den Bildordnern des Projekts.
// Aufruf: bun scripts/bild-manifest.mjs
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";

const ROOT = process.cwd();

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const bildTypen = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"]);
const eintraege = [];

const publicOrdner = [
  ["public/bilder/event", "event"],
  ["public/bilder/person", "person"],
  ["public/bilder/presse", "presse"],
  ["public/bilder/projekt/2019", "projekt", "2019"],
  ["public/bilder/projekt/2021", "projekt", "2021"],
  ["public/bilder/projekt/2023", "projekt", "2023"],
  ["public/bilder/projekt/2025", "projekt", "2025"],
];

for (const [ordner, kategorie, jahrgang] of publicOrdner) {
  for (const datei of walk(join(ROOT, ordner))) {
    if (!bildTypen.has(extname(datei).toLowerCase())) continue;
    const rel = datei.slice(ROOT.length + 1);
    eintraege.push({
      pfad: rel,
      dateiname: basename(datei),
      kategorie,
      jahrgang: jahrgang ?? null,
      url: "/" + rel.replace(/^public\//, ""),
    });
  }
}

for (const datei of walk(join(ROOT, "src/assets/cover"))) {
  if (!datei.endsWith(".asset.json")) continue;
  const meta = JSON.parse(readFileSync(datei, "utf8"));
  const rel = datei.slice(ROOT.length + 1).replace(/\.asset\.json$/, "");
  eintraege.push({
    pfad: rel,
    dateiname: basename(rel),
    kategorie: "cover",
    jahrgang: null,
    url: meta.url,
  });
}

eintraege.sort((a, b) => a.pfad.localeCompare(b.pfad));

const out = `// AUTOMATISCH ERZEUGT von scripts/bild-manifest.mjs – nicht manuell bearbeiten.
export type BildManifestEintrag = {
  pfad: string;
  dateiname: string;
  kategorie: "event" | "person" | "projekt" | "presse" | "cover";
  jahrgang: string | null;
  url: string;
};

export const BILD_MANIFEST: BildManifestEintrag[] = ${JSON.stringify(eintraege, null, 2)};
`;

writeFileSync(join(ROOT, "src/data/bild-manifest.ts"), out);
console.log(`${eintraege.length} Bilder erfasst.`);
