import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/programm", label: "Programm", isPill: false },
  { to: "/verein", label: "Verein", isPill: false },
  { to: "/mitglied-werden", label: "Mitglied werden", isPill: false },
  { to: "/neuland", label: "neuland", isPill: true },
  { to: "/kontakt", label: "Kontakt", isPill: false },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur">
      <div className="shell flex h-20 items-center justify-between gap-6 md:h-24">
        <Link to="/" className="inline-flex items-center gap-3">
          <img
            src="/aed-logo.png"
            alt="aed e.V. – Architecture Engineering Design Stuttgart"
            width={500}
            height={276}
            className="h-10 w-auto md:h-11"
          />
          <span className="sr-only">Startseite</span>
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) =>
            item.isPill ? (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full bg-footer-bg px-5 py-2 font-display text-base text-footer-text transition-opacity hover:opacity-85"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className="font-display text-base link-brand"
                activeProps={{ className: "underline decoration-2 underline-offset-8" }}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <button
          type="button"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center lg:hidden"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <nav aria-label="Hauptnavigation mobil" className="border-t border-line lg:hidden">
          <div className="shell flex flex-col py-2">
            {nav.map((item) =>
              item.isPill ? (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="my-4 inline-flex w-fit rounded-full bg-footer-bg px-5 py-2 font-display text-base text-footer-text transition-opacity hover:opacity-85"
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="border-b border-line py-4 font-display text-lg link-brand"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
