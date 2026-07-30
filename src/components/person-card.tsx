import { ArrowRight } from "lucide-react";
import type { Person } from "@/data/site";
import { PersonDialog, initialen } from "@/components/person-dialog";

export function PersonCard({ person }: { person: Person; basePath?: string }) {
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
      <span className="mt-4 inline-flex items-center gap-2 text-sm link-brand">
        Mehr erfahren
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </div>
  );

  return (
    <PersonDialog person={person}>
      <article className="group w-full cursor-pointer border border-line bg-card text-left transition-colors hover:bg-card" role="button" tabIndex={0}>
        {placeholder}
        {cardBody}
      </article>
    </PersonDialog>
  );
}
