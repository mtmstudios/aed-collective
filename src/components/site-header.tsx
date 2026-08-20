import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/programm", label: "Programm" },
  { to: "/verein", label: "Verein" },
  { to: "/mitglieder", label: "Mitglieder" },
  { to: "/referenten", label: "Referent:innen" },
  { to: "/service", label: "Service" },
  { to: "/kontakt", label: "Kontakt" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background">
      {/* Zeile 1: Menü – Wortmarke mittig – neuland */}
      <div className="shell relative flex h-20 items-center justify-between gap-4 md:h-24">
        <button
          type="button"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center lg:hidden"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <p className="eyebrow-muted hidden lg:block">Stuttgart</p>

        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2"
          aria-label="aed e.V. – zur Startseite"
        >
          <img
            src="/aed-logo.png"
            alt="aed e.V."
            width={500}
            height={276}
            className="h-9 w-auto md:h-12"
          />
        </Link>

        <Link
          to="/neuland"
          className="theme-neuland font-sans text-xs uppercase tracking-[0.14em] link-brand"
        >
          neuland
        </Link>
      </div>

      {/* Zeile 2: Ressort-Navigation, gesperrte Kapitälchen */}
      <nav
        aria-label="Hauptnavigation"
        className="hidden border-t border-line lg:block"
      >
        <ul className="shell flex items-center justify-center gap-10 py-3">
          {nav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="font-sans text-xs font-medium uppercase tracking-[0.14em] link-brand"
                activeProps={{ className: "underline decoration-1 underline-offset-[6px]" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {open && (
        <nav aria-label="Hauptnavigation mobil" className="border-t border-line lg:hidden">
          <div className="shell flex flex-col py-2">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 font-sans text-sm font-medium uppercase tracking-[0.14em] link-brand"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/neuland"
              onClick={() => setOpen(false)}
              className="theme-neuland py-4 font-sans text-sm font-medium uppercase tracking-[0.14em] text-[var(--brand-deep)]"
            >
              neuland
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
