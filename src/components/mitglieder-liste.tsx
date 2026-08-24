import { ArrowUpRight } from "lucide-react";
import type { Foerdermitglied } from "@/data/foerdermitglieder";

/** Trennt "Blocher Partners GmbH, Stuttgart | Berlin" in Name und Orte. */
function teile(eintrag: string) {
  const i = eintrag.indexOf(",");
  if (i < 0) return { name: eintrag.trim(), orte: "" };
  return { name: eintrag.slice(0, i).trim(), orte: eintrag.slice(i + 1).trim() };
}

/** Sehr lange Standortlisten auf die ersten Orte kürzen. */
function kuerzeOrte(orte: string) {
  const teileOrte = orte
    .split("|")
    .map((o) => o.trim())
    .filter(Boolean);
  if (teileOrte.length <= 3) return orte;
  return `${teileOrte.slice(0, 3).join(" · ")} +${teileOrte.length - 3}`;
}

function sortSchluessel(name: string) {
  return name.replace(/^[^A-Za-zÄÖÜ0-9]+/, "").toLowerCase();
}

export function MitgliederListe({ items }: { items: readonly Foerdermitglied[] }) {
  const eintraege = items
    .map((m) => ({ ...teile(m.name), url: m.url }))
    .sort((a, b) => sortSchluessel(a.name).localeCompare(sortSchluessel(b.name), "de"));

  return (
    <ul className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
      {eintraege.map((e) => {
        const inhalt = (
          <>
            <span className="display-sm block">{e.name}</span>
            {e.orte && <span className="meta mt-1 block">{kuerzeOrte(e.orte)}</span>}
          </>
        );
        return (
          <li key={`${e.name}-${e.orte}`} className="border-b border-line">
            {e.url ? (
              <a
                href={e.url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full items-start justify-between gap-4 py-5 pr-4 transition-colors hover:text-[var(--brand-deep)]"
              >
                <span>{inhalt}</span>
                <ArrowUpRight
                  className="mt-1 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </a>
            ) : (
              <span className="block py-5 pr-4">{inhalt}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
