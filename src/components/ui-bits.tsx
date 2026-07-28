export function LogoGrid({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-4">
      {items.map((name) => (
        <li
          key={name}
          className="grayscale-hover flex min-h-24 items-center justify-center border-r border-b border-line px-4 py-6 text-center font-display text-sm hover:text-[var(--brand-deep)]"
        >
          {name}
        </li>
      ))}
    </ul>
  );
}

export function PageHeader({
  eyebrow,
  titel,
  intro,
}: {
  eyebrow?: string;
  titel: string;
  intro?: string;
}) {
  return (
    <header className="shell pt-16 pb-12 md:pt-24 md:pb-16">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="display-lg mt-4 max-w-4xl">{titel}</h1>
      {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>}
    </header>
  );
}
