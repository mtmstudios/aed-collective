import { Link } from "@tanstack/react-router";
import { Newsletter } from "./newsletter";
import { kontakt } from "@/data/site";

const spalten = [
  {
    titel: "Verein",
    links: [
      { to: "/verein", label: "Über den aed" },
      { to: "/verein/vorstand", label: "Vorstand" },
      { to: "/verein/beirat", label: "Beirat" },
      { to: "/verein/satzung", label: "Satzung" },
    ],
  },
  {
    titel: "Programm",
    links: [
      { to: "/programm", label: "Veranstaltungen" },
      { to: "/referenten", label: "Referent:innen" },
      { to: "/service", label: "Downloads" },
    ],
  },
  {
    titel: "neuland",
    links: [
      { to: "/neuland", label: "Wettbewerb" },
      { to: "/neuland/gewinner", label: "Gewinner:innen" },
      { to: "/neuland/jury", label: "Jury" },
      { to: "/neuland/presse", label: "Presse" },
    ],
  },
  {
    titel: "Mitglieder",
    links: [
      { to: "/mitglied-werden", label: "Mitglied werden" },
      { to: "/mitglieder", label: "Fördermitglieder" },
      { to: "/kontakt", label: "Kontakt" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      {/* Newsletter als Magazin-Abobalken */}
      <div className="border-b border-line bg-[oklch(0.968_0_0)]">
        <div className="shell grid gap-8 py-14 md:grid-cols-12 md:py-16">
          <div className="md:col-span-5">
            <p className="eyebrow-muted">Newsletter</p>
            <h2 className="display-md mt-3">Nichts verpassen</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Veranstaltungen, Wettbewerbstermine und Neuigkeiten aus dem Verein – etwa einmal im
              Monat.
            </p>
          </div>
          <div className="md:col-span-7">
            <Newsletter />
          </div>
        </div>
      </div>

      {/* Sitemap-Spalten */}
      <div className="shell grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <img src="/aed-logo.png" alt="" width={500} height={276} className="h-8 w-auto" />
          <address className="mt-6 not-italic leading-relaxed text-muted-foreground">
            {kontakt.name}
            <br />
            {kontakt.strasse}
            <br />
            {kontakt.plz} {kontakt.ort}
          </address>
          <p className="mt-4">
            <a href={`tel:${kontakt.telefonHref}`} className="link-underline">
              {kontakt.telefon}
            </a>
            <br />
            <a href={`mailto:${kontakt.email}`} className="link-underline">
              {kontakt.email}
            </a>
          </p>
        </div>

        <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 md:col-span-8 lg:grid-cols-4">
          {spalten.map((s) => (
            <div key={s.titel}>
              <p className="eyebrow-muted">{s.titel}</p>
              <ul className="mt-4 space-y-2">
                {s.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="link-brand">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-6">
          <p className="meta">
            © {new Date().getFullYear()} aed e.V. – Architecture Engineering Design, Stuttgart
          </p>
          <div className="flex gap-6">
            <Link to="/impressum" className="meta link-underline">
              Impressum
            </Link>
            <Link to="/datenschutz" className="meta link-underline">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
