import { createFileRoute, Link } from "@tanstack/react-router";
import { kategorien, karlSchlechtText, kriterien, preise, sponsoren, termine } from "@/data/neuland";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/neuland/wettbewerb")({
  head: () => ({
    meta: [
      { title: "Der Wettbewerb – neuland | aed e.V." },
      {
        name: "description",
        content:
          "Konzept, Kategorien, Auswahlkriterien, Termine, Preise und Förderer des Nachwuchswettbewerbs neuland.",
      },
      { property: "og:title", content: "Der Wettbewerb – neuland | aed e.V." },
      { property: "og:description", content: "Alles zu Kategorien, Kriterien, Terminen und Preisen." },
      { property: "og:url", content: "/neuland/wettbewerb" },
    ],
    links: [{ rel: "canonical", href: "/neuland/wettbewerb" }],
  }),
  component: WettbewerbPage,
});

function WettbewerbPage() {
  return (
    <>
      <PageHeader
        eyebrow="neuland"
        titel="Der Wettbewerb"
        intro="Alle zwei Jahre zeichnet der aed die stärksten Arbeiten junger Gestalter:innen aus – disziplinübergreifend, bundesweit offen und ausschließlich dem Gemeinnutz verpflichtet."
      />

      <section className="shell rule-t py-12" aria-labelledby="konzept">
        <div className="grid gap-8 md:grid-cols-12">
          <h2 id="konzept" className="eyebrow md:col-span-3">
            Konzept
          </h2>
          <div className="md:col-span-9 max-w-3xl space-y-5 text-lg leading-relaxed">
            <p>
              Ziel ist es, innovative und nachhaltige Gestaltung zu fördern, die sich durch
              größtmögliche ökonomische wie ökologische Qualität auszeichnet, funktional und
              nutzerfreundlich ist und höchsten ästhetischen Anforderungen entspricht. Im
              Mittelpunkt stehen immer der Mensch und der gesellschaftliche Nutzen des Entwurfs.
            </p>
            <p className="text-base text-muted-foreground">
              Eine unabhängige Jury aus rund 20 Fachleuten entscheidet über die Vergabe. Jede
              prämierte Arbeit wird mit Jurystatement auf einer eigenen, dauerhaft erreichbaren
              Projektseite vorgestellt – Studierende können ihre Auszeichnung so direkt in
              Bewerbungen und Portfolios verlinken.
            </p>
          </div>
        </div>
      </section>

      <section className="shell rule-t py-12" aria-labelledby="kategorien">
        <h2 id="kategorien" className="display-md">
          Fünf Kategorien
        </h2>
        <ul className="mt-8 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {kategorien.map((k) => (
            <li
              key={k.key}
              className="flex min-h-24 flex-col justify-center border-r border-b border-line bg-[var(--aed-pink)]/50 p-6 text-[var(--aed-pink-foreground)] transition-colors hover:bg-[var(--aed-hover)] hover:text-[var(--aed-hover-foreground)]"
            >
              <h3 className="font-display text-xl">{k.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-foreground/80">{k.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell rule-t py-12" aria-labelledby="kriterien">
        <h2 id="kriterien" className="display-md">
          Auswahlkriterien
        </h2>
        <ol className="mt-8 grid gap-x-10 gap-y-3 md:grid-cols-2">
          {kriterien.map((k, i) => (
            <li key={k} className="flex gap-4 border-b border-line py-3">
              <span className="font-display text-sm" style={{ color: "var(--brand-deep)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{k}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell rule-t py-12" aria-labelledby="termine">
        <h2 id="termine" className="display-md">
          Termine des Jahrgangs 2025
        </h2>
        <ul className="mt-8 rule-t">
          {termine.map((t) => (
            <li key={t.datum} className="flex flex-wrap gap-x-8 gap-y-1 border-b border-line py-4">
              <span className="w-48 font-display" style={{ color: "var(--brand-deep)" }}>
                {t.datum}
              </span>
              <span>{t.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell rule-t py-12" aria-labelledby="preise">
        <h2 id="preise" className="display-md">
          Preise
        </h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {preise.map((p) => (
            <li key={p.platz} className="border border-line bg-card p-6">
              <h3 className="font-display text-lg">{p.platz}</h3>
              <p className="mt-2 font-display text-3xl" style={{ color: "var(--brand-deep)" }}>
                {p.dotierung}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{p.info}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell rule-t py-12 pb-24" aria-labelledby="foerderer">
        <h2 id="foerderer" className="display-md">
          Förderer
        </h2>
        <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">{karlSchlechtText}</p>
        <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {sponsoren.map((s) => (
            <li key={s.name} className="bg-background p-6">
              <span className="block font-display text-lg">{s.name}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{s.rolle}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Link to="/neuland/teilnahme" className="btn-solid">
            Teilnahmebedingungen lesen
          </Link>
        </div>
      </section>
    </>
  );
}
