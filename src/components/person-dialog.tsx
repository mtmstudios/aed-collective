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
      <DialogContent className="max-h-[90vh] overflow-y-auto p-8 sm:max-w-3xl sm:p-10">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl leading-tight">{person.name}</DialogTitle>
          <DialogDescription className="text-base">{person.rolle}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-10">
          <div className="flex justify-center p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="flex aspect-4/5 w-full max-w-[300px] items-center justify-center bg-muted font-display text-5xl text-foreground sm:max-w-[360px]"
            >
              {initials ?? initialen(person.name)}
            </div>
          </div>
          <div>

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
