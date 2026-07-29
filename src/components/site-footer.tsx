import { Link } from "@tanstack/react-router";
import { Newsletter } from "./newsletter";
import { kontakt } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="bg-footer-bg text-footer-text">
      <div className="shell grid gap-14 py-16 md:grid-cols-12 md:gap-x-10">
        <div className="md:col-span-5">
          <h2 className="eyebrow text-footer-muted">Newsletter</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-footer-text">
            Veranstaltungen, Wettbewerbstermine und Neuigkeiten aus dem Verein – etwa einmal im Monat.
          </p>
          <Newsletter />
        </div>

        <div className="md:col-span-3 md:border-l md:border-footer-line md:pl-10">
          <h2 className="eyebrow text-footer-muted">Geschäftsstelle</h2>
          <address className="mt-4 not-italic text-sm leading-relaxed text-footer-text">
            {kontakt.name}
            <br />
            {kontakt.strasse}
            <br />
            {kontakt.plz} {kontakt.ort}
          </address>
          <p className="mt-4 text-sm leading-relaxed text-footer-text">
            Geschäftszeiten 09:00 bis 18:00 Uhr
            <br />
            Besuche bitte anmelden.
          </p>
          <div className="mt-4 text-sm leading-relaxed text-footer-text">
            <p className="font-medium">{kontakt.geschaeftsstelle}</p>
            <p className="text-footer-muted">{kontakt.geschaeftsstelleRolle}</p>
          </div>
          <div className="mt-4 grid gap-1 text-sm">
            <a
              href={`tel:${kontakt.telefonHref}`}
              className="w-fit py-1 underline underline-offset-4 transition-colors hover:text-brand"
            >
              {kontakt.telefon}
            </a>
            <a
              href={`mailto:${kontakt.email}`}
              className="w-fit py-1 underline underline-offset-4 transition-colors hover:text-brand"
            >
              {kontakt.email}
            </a>
          </div>
        </div>

        <div className="md:col-span-4 md:border-l md:border-footer-line md:pl-10">
          <h2 className="eyebrow text-footer-muted">Navigation</h2>
          <nav
            aria-label="Footer"
            className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-footer-text"
          >
            {[
              { to: "/programm", label: "Programm" },
              { to: "/neuland", label: "neuland" },
              { to: "/verein", label: "Verein" },
              { to: "/neuland/wettbewerb", label: "Wettbewerb" },
              { to: "/verein/vorstand", label: "Vorstand" },
              { to: "/neuland/gewinner", label: "Gewinner:innen" },
              { to: "/verein/beirat", label: "Beirat" },
              { to: "/neuland/jury", label: "Jury" },
              { to: "/verein/satzung", label: "Satzung" },
              { to: "/neuland/presse", label: "Pressekit neuland" },
              { to: "/mitglieder", label: "Mitglieder" },
              { to: "/referenten", label: "Referent:innen" },
              { to: "/service", label: "Service" },
              { to: "/mitglied-werden", label: "Mitglied werden" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="w-fit py-1 underline underline-offset-4 transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-footer-line">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-6 text-xs text-footer-muted">
          <p className="flex items-center gap-3">
            <img
              src="/aed-logo.png"
              alt=""
              width={500}
              height={276}
              className="h-5 w-auto brightness-0 invert"
            />
            © {new Date().getFullYear()} aed e.V. – Architecture Engineering Design, Stuttgart
          </p>

          <div className="flex gap-6">
            <Link
              to="/impressum"
              className="py-1 underline underline-offset-4 transition-colors hover:text-brand"
            >
              Impressum
            </Link>
            <Link
              to="/datenschutz"
              className="py-1 underline underline-offset-4 transition-colors hover:text-brand"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
