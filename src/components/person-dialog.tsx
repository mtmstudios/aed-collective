import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Person } from "@/data/site";

export function initialen(name: string) {
  return name
    .replace(/^(Prof\. Dr\. phil\.|Prof\. Dr\. Dr\. E\.h\. Dr\. h\.c\.|Prof\. Dr\.|Dr\. Dr\.|Prof\.|Dr\.)\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .map((t) => t[0])
    .slice(0, 2)
    .join("");
}

export function PersonDialog({
  person,
  children,
  initials,
}: {
  person: Person;
  children: ReactNode;
  initials?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 max-w-[375px] sm:max-w-[450px]">
        <DialogHeader className="sr-only">
          <DialogTitle>{person.name}</DialogTitle>
          <DialogDescription>{person.rolle}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <div className="relative w-full">
            <div
              aria-hidden="true"
              className="flex aspect-4/5 w-full items-center justify-center bg-muted font-display text-5xl text-foreground"
            >
              {initials ?? initialen(person.name)}
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6">
              <h2 className="font-display text-xl text-white sm:text-2xl">{person.name}</h2>
              <p className="text-sm text-white/90 sm:text-base">{person.rolle}</p>
            </div>
          </div>
          <div className="w-full p-6 sm:p-8">
            {person.statement ? (
              <div className="space-y-4 text-sm leading-relaxed">
                {person.statement
                  .split("\n")
                  .filter(Boolean)
                  .map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Für diese Person liegt noch kein Statement vor.</p>
            )}
            {person.email && (
              <a href={`mailto:${person.email}`} className="mt-6 inline-flex text-sm underline link-brand">
                {person.email}
              </a>
            )}
            {person.link && (
              <a
                href={person.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 block text-sm underline link-brand"
              >
                Website besuchen
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
