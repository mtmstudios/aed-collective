import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { Person } from "@/data/site";

function initialen(name: string) {
  return name
    .replace(/^(Dr\.|Prof\.)\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .map((t) => t[0])
    .slice(0, 2)
    .join("");
}

export function PersonCard({ person }: { person: Person }) {
  const [open, setOpen] = useState(false);
  const hasStatement = Boolean(person.statement);

  return (
    <article className="group border border-line bg-card">
      <div
        aria-hidden="true"
        className="flex aspect-4/5 items-center justify-center bg-muted font-display text-5xl text-muted-foreground transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground"
      >
        {initialen(person.name)}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg leading-tight">{person.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{person.rolle}</p>
        {person.link && (
          <a href={person.link} className="mt-2 inline-block text-sm underline link-brand">
            Website
          </a>
        )}
        {hasStatement && (
          <>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="mt-4 inline-flex items-center gap-2 text-sm link-brand"
            >
              {open ? <Minus className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
              Statement
            </button>
            {open && <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed">{person.statement}</p>}
          </>
        )}
      </div>
    </article>
  );
}
