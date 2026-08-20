import { Link } from "@tanstack/react-router";
import type { EventItem } from "@/data/site";
import { eventBilder } from "@/data/bilder";

export function formatDatum(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function EventCard({
  event,
  gross = false,
}: {
  event: EventItem;
  gross?: boolean;
}) {
  const bild = eventBilder[event.slug];

  return (
    <article className="group">
      <Link to="/programm/$slug" params={{ slug: event.slug }} className="block">
        <div className={`img-zoom bg-muted ${gross ? "aspect-4/3" : "aspect-3/2"}`}>
          {bild ? (
            <img
              src={bild}
              alt={`${event.titel} – ${event.ort}`}
              loading="lazy"
              decoding="async"
              className="grayscale-hover h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted" aria-hidden="true" />
          )}
        </div>

        <p className="eyebrow mt-4">{event.format}</p>
        <h3 className={`mt-2 ${gross ? "display-md" : "display-sm"}`}>{event.titel}</h3>
        <p className="meta mt-2">
          <time dateTime={event.datum}>{formatDatum(event.datum)}</time>
          {" · "}
          {event.ort}
        </p>
        <p className={`mt-3 leading-relaxed ${gross ? "text-lg" : "text-base"}`}>{event.teaser}</p>
      </Link>
    </article>
  );
}
