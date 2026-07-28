import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { EventItem } from "@/data/site";

export function formatDatum(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="group border border-line bg-card">
      <Link
        to="/programm/$slug"
        params={{ slug: event.slug }}
        className="flex h-full flex-col p-6 transition-colors group-hover:bg-muted"
      >
        <div className="flex items-center justify-between gap-4">
          <time dateTime={event.datum} className="eyebrow">
            {formatDatum(event.datum)}
          </time>
          <span className="rounded-full border border-line px-3 py-1 text-xs">{event.format}</span>
        </div>
        <h3 className="mt-5 font-display text-xl leading-tight transition-colors group-hover:text-[var(--brand-deep)]">
          {event.titel}
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">{event.ort}</p>
        <p className="mt-4 text-sm leading-relaxed">{event.teaser}</p>
        <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium">
          Details <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </Link>
    </article>
  );
}
