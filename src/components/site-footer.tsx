import { Link } from "@tanstack/react-router";
import { Newsletter } from "./newsletter";
import { kontakt } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="mt-32 bg-footer-bg text-footer-text">
      <div className="shell grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="display-md text-footer-text">Newsletter</h2>
          <p className="mt-3 max-w-md text-sm text-footer-muted">
            Veranstaltungen, Wettbewerbstermine und Neuigkeiten aus dem Verein – etwa einmal im Monat.
          </p>
          <Newsletter />
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-footer-muted">Kontakt</h2>
          <address className="mt-4 not-italic text-sm leading-relaxed text-footer-text">
            {kontakt.name}
            <br />
            {kontakt.strasse}
            <br />
            {kontakt.plz} {kontakt.ort}
            <br />
            <a href={`tel:${kontakt.telefonHref}`} className="underline hover:text-brand transition-colors">
              {kontakt.telefon}
            </a>
            <br />
            <a href={`mailto:${kontakt.email}`} className="underline hover:text-brand transition-colors">
              {kontakt.email}
            </a>
          </address>
        </div>

        <nav aria-label="Footer" className="md:col-span-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-footer-text">
          <Link to="/programm" className="hover:text-brand transition-colors">Programm</Link>
          <Link to="/neuland" className="hover:text-brand transition-colors">neuland</Link>
          <Link to="/verein" className="hover:text-brand transition-colors">Verein</Link>
          <Link to="/neuland/wettbewerb" className="hover:text-brand transition-colors">Wettbewerb</Link>
          <Link to="/verein/vorstand" className="hover:text-brand transition-colors">Vorstand</Link>
          <Link to="/neuland/gewinner" className="hover:text-brand transition-colors">Gewinner:innen</Link>
          <Link to="/verein/beirat" className="hover:text-brand transition-colors">Beirat</Link>
          <Link to="/neuland/jury" className="hover:text-brand transition-colors">Jury</Link>
          <Link to="/verein/satzung" className="hover:text-brand transition-colors">Satzung</Link>
          <Link to="/neuland/presse" className="hover:text-brand transition-colors">Pressekit neuland</Link>
          <Link to="/mitglieder" className="hover:text-brand transition-colors">Mitglieder</Link>
          <Link to="/referenten" className="hover:text-brand transition-colors">Referent:innen</Link>
          <Link to="/service" className="hover:text-brand transition-colors">Service</Link>
          <Link to="/mitglied-werden" className="hover:text-brand transition-colors">Mitglied werden</Link>
        </nav>
      </div>

      <div className="border-t border-footer-line">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-6 text-xs text-footer-muted">
          <p className="flex items-center gap-3">
            <img src="/aed-logo.png" alt="" width={500} height={276} className="h-5 w-auto brightness-0 invert" />
            © {new Date().getFullYear()} aed e.V. – Architecture Engineering Design, Stuttgart
          </p>

          <div className="flex gap-6">
            <Link to="/impressum" className="hover:text-brand transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-brand transition-colors">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
