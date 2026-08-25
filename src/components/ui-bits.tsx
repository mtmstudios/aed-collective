import { Link } from "@tanstack/react-router";

type LogoItem = string | { name: string; url?: string };

export function LogoGrid({ items }: { items: readonly LogoItem[] }) {
  return (
    <ul className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const name = typeof item === "string" ? item : item.name;
        const url = typeof item === "string" ? undefined : item.url;
        const inner = <span className="font-sans text-xs uppercase tracking-[0.1em]">{name}</span>;
        return (
          <li
            key={name}
            className="flex min-h-24 border-r border-b border-line text-center text-muted-foreground transition-colors hover:text-foreground"
          >
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center px-4 py-6"
              >
                {inner}
              </a>
            ) : (
              <span className="flex w-full items-center justify-center px-4 py-6">{inner}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Ressort-Marke: schwarze Oberlinie, Titel links, optionaler Link rechts. */
export function SectionTitle({
  id,
  titel,
  kicker,
  href,
  linkText,
}: {
  id?: string;
  titel: string;
  kicker?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="section-rule flex-col items-start gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
      <div>
        {kicker && <p className="eyebrow-muted mb-2">{kicker}</p>}
        <h2 id={id} className="display-md">
          {titel}
        </h2>
      </div>
      {href && linkText && (
        <Link to={href} className="eyebrow shrink-0 link-underline">
          {linkText}
        </Link>
      )}
    </div>
  );
}

/** Seitenkopf im Magazinstil: Kicker, große Didone-Zeile, kursiver Vorspann. */
export function PageHeader({
  eyebrow,
  titel,
  subtitle,
  intro,
  size = "lg",
}: {
  eyebrow?: string;
  titel: string;
  subtitle?: string;
  intro?: string;
  /** "xl" für Seiten, die wie ein Magazin-Aufmacher wirken sollen. */
  size?: "lg" | "xl";
}) {
  return (
    <header className="shell pt-12 pb-10 md:pt-20 md:pb-14">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className={`${size === "xl" ? "display-xl" : "display-lg"} mt-4 max-w-4xl`}>{titel}</h1>
      {subtitle && <p className="display-md mt-3 max-w-4xl text-muted-foreground">{subtitle}</p>}
      {intro && <p className="lead mt-6 max-w-2xl text-muted-foreground">{intro}</p>}
    </header>
  );
}
