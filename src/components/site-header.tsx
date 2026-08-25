import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

/** Reduzierte Hauptnavigation – alles Weitere steht im Footer. */
const nav = [
  { to: "/programm", label: "Programm" },
  { to: "/verein", label: "Verein" },
  { to: "/mitglied-werden", label: "Mitglied werden" },
] as const;

const navDanach = [{ to: "/kontakt", label: "Kontakt" }] as const;

const linkKlasse = "font-sans text-base text-brand-foreground transition-colors hover:text-background";
const aktiv = { className: "underline decoration-1 underline-offset-[6px]" };

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand bg-brand">
      <div className="shell flex h-20 items-center justify-between gap-4 md:h-24">
        {/* Mobile Menü */}
        <button
          type="button"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center text-brand-foreground transition-colors hover:text-background lg:hidden"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        {/* Logo links */}
        <Link to="/" className="flex-shrink-0" aria-label="aed e.V. – zur Startseite">
          <img
            src="/aed-logo.png"
            alt="aed e.V."
            width={500}
            height={276}
            className="h-10 w-auto md:h-12"
          />
        </Link>

        {/* Desktop-Navigation: neuland als Pill zwischen den Punkten */}
        <nav aria-label="Hauptnavigation" className="hidden items-center lg:flex">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkKlasse} activeProps={aktiv}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/neuland"
                className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 font-sans text-base text-background transition-opacity hover:opacity-90"
              >
                neuland
              </Link>
            </li>
            {navDanach.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkKlasse} activeProps={aktiv}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Platzhalter, damit das Logo auf kleinen Schirmen mittig bleibt */}
        <span className="w-11 lg:hidden" aria-hidden="true" />
      </div>

      {open && (
        <nav aria-label="Hauptnavigation mobil" className="border-t border-ink lg:hidden">
          <div className="shell flex flex-col py-2">
            {[...nav, ...navDanach].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-ink py-4 font-sans text-base text-brand-foreground transition-colors hover:text-background"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/neuland"
              onClick={() => setOpen(false)}
              className="mt-4 mb-2 inline-flex w-fit items-center justify-center rounded-full bg-ink px-5 py-2.5 font-sans text-base text-background"
            >
              neuland
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
