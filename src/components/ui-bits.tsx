type LogoItem = string | { name: string; url?: string };

export function LogoGrid({ items }: { items: readonly LogoItem[] }) {
  return (
    <ul className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const name = typeof item === "string" ? item : item.name;
        const url = typeof item === "string" ? undefined : item.url;
        const inner = (
          <span className="font-display text-sm">{name}</span>
        );
        return (
          <li
            key={name}
            className="grayscale-hover flex min-h-24 border-r border-b border-line text-center hover:text-[var(--brand-deep)]"
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
  size?: "lg" | "xl";
}) {
  return (
    <header className="shell pt-16 pb-12 md:pt-24 md:pb-16">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className={`${size === "xl" ? "display-xl" : "display-lg"} mt-4 max-w-4xl`}>{titel}</h1>
      {subtitle && <p className="display-md mt-3 max-w-4xl">{subtitle}</p>}
      {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>}
    </header>
  );
}
