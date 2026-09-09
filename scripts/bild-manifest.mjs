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

/* ---------- Verwendungsorte im Quellcode ermitteln ---------- */

const quellDateien = walk(join(ROOT, "src")).filter(
  (f) => /\.(ts|tsx|js|jsx)$/.test(f) && !f.endsWith("src/data/bild-manifest.ts"),
);
const inhalt = new Map();
for (const f of quellDateien) inhalt.set(f, readFileSync(f, "utf8"));

function aufloesen(spez, vonDatei) {
  let basis;
  if (spez.startsWith("@/")) basis = join(ROOT, "src", spez.slice(2));
  else if (spez.startsWith(".")) basis = join(vonDatei, "..", spez);
  else return null;
  const kandidaten = [
    basis,
    basis + ".ts",
    basis + ".tsx",
    join(basis, "index.ts"),
    join(basis, "index.tsx"),
  ];
  return kandidaten.find((k) => inhalt.has(k)) ?? null;
}

// Wer importiert welche Datei?
const importeure = new Map();
for (const [datei, text] of inhalt) {
  for (const m of text.matchAll(/from\s+["']([^"']+)["']/g)) {
    const ziel = aufloesen(m[1], datei);
    if (!ziel) continue;
    if (!importeure.has(ziel)) importeure.set(ziel, new Set());
    importeure.get(ziel).add(datei);
  }
}

function routePfad(rel) {
  const name = rel.slice("src/routes/".length).replace(/\.(tsx|ts)$/, "");
  if (name === "index") return "/";
  if (name === "__root") return "Layout (alle Seiten)";
  return (
    "/" +
    name
      .replace(/\[\.\]/g, ".")
      .split(".")
      .filter((t) => t !== "index")
      .join("/")
  );
}

function label(datei) {
  const rel = datei.slice(ROOT.length + 1);
  if (rel.startsWith("src/routes/")) return `Seite ${routePfad(rel)}`;
  if (rel.startsWith("src/components/"))
    return `Komponente ${basename(rel).replace(/\.(tsx|ts)$/, "")}`;
  if (rel.startsWith("src/data/")) return `Daten ${basename(rel).replace(/\.(tsx|ts)$/, "")}`;
  return rel;
}

for (const eintrag of eintraege) {
  const treffer = new Set();
  const suchbegriffe = [eintrag.url, eintrag.pfad, eintrag.dateiname].filter(Boolean);
  for (const [datei, text] of inhalt) {
    if (suchbegriffe.some((s) => text.includes(s))) treffer.add(datei);
  }

  // Über Importketten bis zu Seiten/Komponenten hochlaufen (max. 4 Ebenen)
  const alle = new Set(treffer);
  let welle = new Set(treffer);
  for (let tiefe = 0; tiefe < 4 && welle.size; tiefe++) {
    const naechste = new Set();
    for (const d of welle) {
      for (const imp of importeure.get(d) ?? []) {
        if (!alle.has(imp)) {
          alle.add(imp);
          naechste.add(imp);
        }
      }
    }
    welle = naechste;
  }

  const seiten = [...alle].filter((d) => d.includes("/src/routes/"));
  const basisliste = seiten.length ? [...treffer, ...seiten] : [...treffer];
  eintrag.verwendungen = [...new Set(basisliste.map(label))].sort();
}

const out = `// AUTOMATISCH ERZEUGT von scripts/bild-manifest.mjs – nicht manuell bearbeiten.
export type BildManifestEintrag = {
  pfad: string;
  dateiname: string;
  kategorie: "event" | "person" | "projekt" | "presse" | "cover";
  jahrgang: string | null;
  url: string;
  verwendungen: string[];
};

export const BILD_MANIFEST: BildManifestEintrag[] = ${JSON.stringify(eintraege, null, 2)};
`;

writeFileSync(join(ROOT, "src/data/bild-manifest.ts"), out);
console.log(`${eintraege.length} Bilder erfasst.`);
