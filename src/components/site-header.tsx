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
      <div className="shell flex h-20 items-center justify-between gap-4 md:h-24">
        {/* Mobile Menü */}
        <button
          type="button"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center lg:hidden"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        {/* Logo links */}
        <Link
          to="/"
          className="flex-shrink-0"
          aria-label="aed e.V. – zur Startseite"
        >
          <img
            src="/aed-logo.png"
            alt="aed e.V."
            width={500}
            height={276}
            className="h-10 w-auto md:h-12"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Hauptnavigation"
          className="hidden items-center lg:flex"
        >
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="font-sans text-base font-medium uppercase tracking-[0.14em] link-brand"
                  activeProps={{
                    className: "underline decoration-1 underline-offset-[6px]",
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* neuland-Button schwarz */}
        <Link
          to="/neuland"
          className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-foreground/90"
        >
          neuland
        </Link>
      </div>

      {open && (
        <nav
          aria-label="Hauptnavigation mobil"
          className="border-t border-line lg:hidden"
        >
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
              className="py-4 font-sans text-sm font-medium uppercase tracking-[0.14em] text-[var(--brand-deep)]"
            >
              neuland
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
