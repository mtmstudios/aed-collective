import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { events } from "@/data/site";
import { eventBilder } from "@/data/bilder";
import { formatDatum } from "@/components/event-card";

function findEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

export const Route = createFileRoute("/programm/$slug")({
  loader: ({ params }) => {
    const event = findEvent(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Veranstaltung nicht gefunden – aed e.V." }, { name: "robots", content: "noindex" }] };
    }
    const { event } = loaderData;
    const bild = eventBilder[event.slug];
    return {
      meta: [
        { title: `${event.titel} – aed e.V.` },
        { name: "description", content: event.teaser },
        { property: "og:title", content: `${event.titel} – aed e.V.` },
        { property: "og:description", content: event.teaser },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/programm/${params.slug}` },
        ...(bild ? [{ property: "og:image", content: bild }] : []),
      ],
      links: [{ rel: "canonical", href: `/programm/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.titel,
            startDate: event.datum,
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: { "@type": "Place", name: event.ort },
            description: event.teaser,
            organizer: { "@type": "Organization", name: "aed e.V." },
            ...(bild ? { image: bild } : {}),
          }),
        },
      ],
    };
  },
  component: EventDetail,
});

function icalHref(slug: string) {
  const event = findEvent(slug);
  if (!event) return "#";
  const d = event.datum.replaceAll("-", "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//aed e.V.//Programm//DE",
    "BEGIN:VEVENT",
    `UID:${slug}@aed-stuttgart.de`,
    `DTSTART;VALUE=DATE:${d}`,
    `SUMMARY:${event.titel}`,
    `LOCATION:${event.ort}`,
    `DESCRIPTION:${event.teaser}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

function EventDetail() {
  const { event } = Route.useLoaderData();
  const bild = eventBilder[event.slug];

  return (
    <article>
      <header className="shell pt-10 pb-8 text-center md:pt-16">
        <p className="eyebrow">{event.format}</p>
        <h1 className="display-lg mx-auto mt-5 max-w-4xl">{event.titel}</h1>
        <p className="meta mt-5">
          <time dateTime={event.datum}>{formatDatum(event.datum)}</time>
          {event.uhrzeit && `, ${event.uhrzeit} Uhr`}
          {" · "}
          {event.ort}
        </p>
      </header>

      {bild && (
        <figure className="bleed">
          <img
            src={bild}
            alt={`${event.titel} – ${event.ort}`}
            className="max-h-[70vh] w-full object-cover"
            fetchPriority="high"
          />
        </figure>
      )}

      <div className="shell-narrow py-14 md:py-20">
        <p className="lead">{event.teaser}</p>
        <div className="prose-editorial mt-8 text-muted-foreground">
          <p>{event.text}</p>
        </div>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-8">
          {event.anmeldung && (
            <a href={event.anmeldung} target="_blank" rel="noreferrer" className="btn-solid">
              Anmelden
            </a>
          )}
          <a href={icalHref(event.slug)} download={`${event.slug}.ics`} className="btn-outline">
            <CalendarPlus className="size-4" aria-hidden="true" /> Termin speichern
          </a>
        </div>
      </div>

      <nav className="shell border-t border-line py-10" aria-label="Zurück zum Programm">
        <Link to="/programm" className="eyebrow inline-flex items-center gap-2 link-underline">
          <ArrowLeft className="size-3.5" aria-hidden="true" /> Alle Termine
        </Link>
      </nav>
    </article>
  );
}
