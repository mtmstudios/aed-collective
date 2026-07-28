import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarPlus, MapPin } from "lucide-react";
import { events } from "@/data/site";
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
    return {
      meta: [
        { title: `${event.titel} – aed e.V.` },
        { name: "description", content: event.teaser },
        { property: "og:title", content: `${event.titel} – aed e.V.` },
        { property: "og:description", content: event.teaser },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/programm/${params.slug}` },
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

  return (
    <article className="shell py-16 md:py-24">
      <Link to="/programm" className="inline-flex items-center gap-2 text-sm link-brand">
        <ArrowLeft className="size-4" aria-hidden="true" /> Programm
      </Link>
      <p className="eyebrow mt-8">{event.format}</p>
      <h1 className="display-lg mt-4 max-w-4xl">{event.titel}</h1>

      <dl className="mt-10 grid gap-6 border-y border-line py-6 sm:grid-cols-3">
        <div>
          <dt className="eyebrow">Datum</dt>
          <dd className="mt-1">
            <time dateTime={event.datum}>{formatDatum(event.datum)}</time>
            {event.uhrzeit && `, ${event.uhrzeit} Uhr`}
          </dd>
        </div>
        <div>
          <dt className="eyebrow">Ort</dt>
          <dd className="mt-1 flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {event.ort}
          </dd>
        </div>
        <div>
          <dt className="eyebrow">Veranstalter</dt>
          <dd className="mt-1">aed e.V.{event.anmeldung ? " · Anmeldung erforderlich" : ""}</dd>
        </div>
      </dl>

      <div className="mt-10 max-w-2xl text-lg leading-relaxed">
        <p>{event.teaser}</p>
        <p className="mt-6 text-base text-muted-foreground">{event.text}</p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {event.anmeldung && (
          <a href={event.anmeldung} className="btn-solid">
            Anmelden
          </a>
        )}
        <a href={icalHref(event.slug)} download={`${event.slug}.ics`} className="btn-outline">
          <CalendarPlus className="size-4" aria-hidden="true" /> Termin speichern (iCal)
        </a>
      </div>
    </article>
  );
}
