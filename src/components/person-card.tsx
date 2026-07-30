import { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Person } from "@/data/site";

function initialen(name: string) {
  return name
    .replace(/^(Prof\. Dr\. phil\.|Prof\. Dr\. Dr\. E\.h\. Dr\. h\.c\.|Prof\. Dr\.|Dr\. Dr\.|Prof\.|Dr\.)\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .map((t) => t[0])
    .slice(0, 2)
    .join("");
}

export function PersonCard({ person, basePath = "/verein/beirat" }: { person: Person; basePath?: string }) {
  const [open, setOpen] = useState(false);
  const hasStatement = Boolean(person.statement);
  const detailUrl = person.slug ? `${basePath}/${person.slug}` : undefined;

  const placeholder = (
    <div
      aria-hidden="true"
      className="flex aspect-4/5 items-center justify-center bg-muted font-display text-5xl text-muted-foreground transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground"
    >
      {initialen(person.name)}
    </div>
  );

  const cardBody = (
    <div className="p-5">
      <h3 className="font-display text-lg leading-tight">{person.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{person.rolle}</p>
      {person.link && !detailUrl && (
        <a href={person.link} className="mt-2 inline-block text-sm underline link-brand">
          Website
        </a>
      )}
      <div className="mt-4 flex flex-col items-start gap-3">
        {hasStatement && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            className="inline-flex items-center gap-2 text-sm link-brand"
          >
            {open ? <Minus className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
            Statement
          </button>
        )}
        {detailUrl && (
          <span className="inline-flex items-center gap-2 text-sm link-brand">
            Mehr erfahren
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        )}
      </div>
      {open && <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed">{person.statement}</p>}
    </div>
  );

  if (detailUrl) {
    return (
      <article className="group border border-line bg-card transition-colors hover:bg-card">
        <Link to={detailUrl} className="block">
          {placeholder}
          {cardBody}
        </Link>
      </article>
    );
  }

  return (
    <article className="group border border-line bg-card">
      {placeholder}
      {cardBody}
    </article>
  );
}
