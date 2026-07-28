import { Link } from "@tanstack/react-router";
import { Newsletter } from "./newsletter";
import { kontakt } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-line">
      <div className="shell grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="display-md">Newsletter</h2>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Veranstaltungen, Wettbewerbstermine und Neuigkeiten aus dem Verein – etwa einmal im Monat.
          </p>
          <Newsletter />
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow">Kontakt</h2>
          <address className="mt-4 not-italic text-sm leading-relaxed">
            {kontakt.name}
            <br />
            {kontakt.strasse}
            <br />
            {kontakt.plz} {kontakt.ort}
            <br />
            <a href={`tel:${kontakt.telefonHref}`} className="link-brand underline">
              {kontakt.telefon}
            </a>
            <br />
            <a href={`mailto:${kontakt.email}`} className="link-brand underline">
              {kontakt.email}
            </a>
          </address>
        </div>

        <nav aria-label="Footer" className="md:col-span-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <Link to="/programm" className="link-brand">Programm</Link>
          <Link to="/neuland" className="link-brand">neuland</Link>
          <Link to="/verein" className="link-brand">Verein</Link>
          <Link to="/neuland/wettbewerb" className="link-brand">Wettbewerb</Link>
          <Link to="/verein/vorstand" className="link-brand">Vorstand</Link>
          <Link to="/neuland/gewinner" className="link-brand">Gewinner:innen</Link>
          <Link to="/verein/beirat" className="link-brand">Beirat</Link>
          <Link to="/neuland/jury" className="link-brand">Jury</Link>
          <Link to="/verein/satzung" className="link-brand">Satzung</Link>
          <Link to="/neuland/presse" className="link-brand">Pressekit neuland</Link>
          <Link to="/mitglieder" className="link-brand">Mitglieder</Link>
          <Link to="/referenten" className="link-brand">Referent:innen</Link>
          <Link to="/service" className="link-brand">Service</Link>
          <Link to="/mitglied-werden" className="link-brand">Mitglied werden</Link>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} aed e.V. – Architecture Engineering Design, Stuttgart</p>
          <div className="flex gap-6">
            <Link to="/impressum" className="link-brand">Impressum</Link>
            <Link to="/datenschutz" className="link-brand">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
