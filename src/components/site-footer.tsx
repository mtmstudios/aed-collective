import { Link } from "@tanstack/react-router";
import { Newsletter } from "./newsletter";
import { kontakt } from "@/data/site";

const navLinksLinks = [
  { to: "/programm", label: "Programm" },
  { to: "/verein", label: "Verein" },
  { to: "/verein/vorstand", label: "Vorstand" },
  { to: "/verein/beirat", label: "Beirat" },
  { to: "/verein/satzung", label: "Satzung" },
  { to: "/mitglieder", label: "Mitglieder" },
  { to: "/service", label: "Downloads" },
] as const;

const navLinksRechts = [
  { to: "/neuland", label: "neuland" },
  { to: "/neuland/wettbewerb", label: "Wettbewerb" },
  { to: "/neuland/gewinner", label: "Gewinner:innen" },
  { to: "/neuland/jury", label: "Jury" },
  { to: "/neuland/presse", label: "Pressekit neuland" },
  { to: "/referenten", label: "Referent:innen" },
  { to: "/mitglied-werden", label: "Mitglied werden" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-footer-bg text-footer-text">
      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
        {/* Newsletter */}
        <div className="md:col-span-5">
          <p className="eyebrow text-footer-muted">Newsletter</p>
          <p className="mt-4 max-w-md text-footer-text">
            Veranstaltungen, Wettbewerbstermine und Neuigkeiten aus dem Verein – etwa einmal im
            Monat.
          </p>
          <Newsletter />
        </div>

        {/* Geschäftsstelle */}
        <div className="md:col-span-3 md:border-l md:border-footer-line md:pl-8">
          <p className="eyebrow text-footer-muted">Geschäftsstelle</p>
          <address className="mt-4 not-italic leading-relaxed text-footer-text">
            {kontakt.name}
            <br />
            {kontakt.strasse}
            <br />
            {kontakt.plz} {kontakt.ort}
          </address>
          <p className="mt-4 leading-relaxed text-footer-text">
            Geschäftszeiten 09:00 bis 18:00 Uhr
            <br />
            Besuche bitte anmelden.
          </p>
          <p className="mt-4 leading-relaxed">
            {kontakt.geschaeftsstelle}
            <br />
            <span className="text-footer-muted">{kontakt.geschaeftsstelleRolle}</span>
          </p>
          <p className="mt-4 leading-relaxed">
            <a href={`tel:${kontakt.telefonHref}`} className="underline underline-offset-4 hover:text-footer-muted">
              {kontakt.telefon}
            </a>
            <br />
            <br />
            <a href={`mailto:${kontakt.email}`} className="underline underline-offset-4 hover:text-footer-muted">
              {kontakt.email}
            </a>
          </p>
        </div>

        {/* Navigation */}
        <div className="md:col-span-4 md:border-l md:border-footer-line md:pl-8">
          <p className="eyebrow text-footer-muted">Navigation</p>
          <nav aria-label="Footer" className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3">
            <ul className="space-y-3">
              {navLinksLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="underline underline-offset-4 hover:text-footer-muted">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-3">
              {navLinksRechts.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="underline underline-offset-4 hover:text-footer-muted">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-footer-line">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-4">
            <img src="/aed-logo-white.png" alt="aed e.V." width={500} height={276} className="h-5 w-auto" />
            <p className="text-sm text-footer-muted">
              © {new Date().getFullYear()} aed e.V. – Architecture Engineering Design, Stuttgart
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/impressum" className="underline underline-offset-4 hover:text-footer-text text-footer-muted">
              Impressum
            </Link>
            <Link to="/datenschutz" className="underline underline-offset-4 hover:text-footer-text text-footer-muted">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
