import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { eventBilder } from "@/data/bilder";
import { CoverSlider } from "@/components/cover-slider";


export const Route = createFileRoute("/mitglied-werden")({
  head: () => ({
    meta: [
      { title: "Mitglied werden – aed e.V. Stuttgart" },
      {
        name: "description",
        content:
          "Mitglied im aed e.V. werden: Beiträge, Vorteile und Online-Beitrittsformular für Personen, Studierende und Fördermitglieder.",
      },
      { property: "og:title", content: "Mitglied werden – aed e.V. Stuttgart" },
      { property: "og:description", content: "Beiträge, Vorteile und Online-Beitritt beim aed e.V." },
      { property: "og:url", content: "/mitglied-werden" },
    ],
    links: [{ rel: "canonical", href: "/mitglied-werden" }],
  }),
  component: MitgliedWerdenPage,
});

const nutzen = [
  "Rund 20 Veranstaltungen im Jahr: Vorträge, Führungen, Studiobesuche, Filme und Feste",
  "Zugang zu Exkursionen und Führungen mit begrenzter Teilnehmerzahl",
  "Netzwerk aus über 400 Personen- und rund 80 Fördermitgliedern",
  "Einladung zum Sommerfest und zur Preisverleihung neuland",
  "Newsletter mit Terminen, Wettbewerben und Ausschreibungen",
  "Unterstützung der Nachwuchsförderung – u.a. über den Wettbewerb neuland",
];

const beitrittsPdf = "https://www.aed-stuttgart.de/app/download/8616515663/aed_Mitglied+werden+%282025%29.pdf";
const heroBilder = Object.values(eventBilder).reverse();

const beitraege = [
  {
    typ: "Personenmitgliedschaft",
    text: "",
  },
];

function MitgliedWerdenPage() {
  const [gesendet, setGesendet] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const daten = new FormData(e.currentTarget);
    const email = String(daten.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 255) {
      setFehler("Bitte geben Sie eine gültige E-Mail-Adresse an.");
      return;
    }
    setFehler(null);
    setGesendet(true);
  }

  return (
    <>
      <section className="bleed relative" aria-labelledby="mitglied-titel-head">
        <div className="relative h-[clamp(420px,62vh,760px)] w-full overflow-hidden bg-muted md:h-[clamp(520px,78vh,860px)]">
          <CoverSlider
            bilder={heroBilder}
            alt="Impressionen von Veranstaltungen und Mitgliedern des aed e.V. in Stuttgart"
            className="h-full w-full"
            itemClassName="w-full"
            zufall={false}
            tempo={0.9}
            hoverFaktor={6}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-black/95 via-black/65 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="shell pb-10 md:pb-16">
              <p className="eyebrow text-white/85">Mitgliedschaft</p>
              <h1 id="mitglied-titel-head" className="display-lg mt-4 max-w-3xl text-white">
                Sei ein Teil des Netzwerks
              </h1>
              <p className="lead mt-5 max-w-2xl text-white/90">
                Eine Mitgliedschaft im aed e.V. bedeutet: ganzjährig Programm, ein belastbares Netzwerk
                und die Förderung des gestalterischen Nachwuchses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell rule-t py-12" aria-labelledby="nutzen">
        <h2 id="nutzen" className="display-md">
          Was Sie davon haben
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {nutzen.map((n) => (
            <li key={n} className="flex items-start gap-3 border-b border-line pb-4">
              <Check className="mt-1 size-4 shrink-0 text-[var(--brand-deep)]" aria-hidden="true" />
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell rule-t py-12" aria-labelledby="beitraege">
        <h2 id="beitraege" className="display-md">
          Mitgliedschaften
        </h2>
        <p className="mt-6 max-w-3xl text-muted-foreground">
          Der aed lebt von seinen Mitgliedern: Förder- und Personenmitglieder ermöglichen Programm,
          Netzwerk und Nachwuchsförderung. Aus Datenschutzgründen nennen wir unsere mehr als 400
          Personenmitglieder nicht öffentlich.
        </p>
        <ul className="mt-8 grid gap-6">
          {beitraege.map((b) => (
            <li key={b.typ} className="border border-line bg-card p-6">
              <h3 className="font-display text-xl">{b.typ}</h3>
              <p className="mt-3 text-muted-foreground">
                Mit einer Personenmitgliedschaft werden Sie Teil des aed-Netzwerks und ermöglichen ein
                vielfältiges Programm aus Vorträgen, Ausstellungen und Exkursionen.
              </p>
              <a href="#formular" className="btn-solid mt-6 inline-flex">
                Eine Personenmitgliedschaft beantragen
              </a>
            </li>
          ))}
          <li className="border border-line bg-card p-6">
            <h3 className="font-display text-xl">Fördermitgliedschaft</h3>
            <p className="mt-3 text-muted-foreground">
              Für Büros, Unternehmen und Institutionen – mit Nennung auf der Mitgliederseite.
              Unterstützen Sie den aed und seine Nachwuchsförderung.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#formular" className="btn-solid inline-flex">
                Eine Fördermitgliedschaft beantragen
              </a>
              <a href="/mitglieder/foerdermitglieder" className="btn-outline inline-flex">
                Alle Fördermitglieder ansehen
              </a>
            </div>
          </li>
        </ul>

        <p className="mt-6 text-muted-foreground">
          Die aktuellen Beiträge finden Sie in der{" "}
          <a href={beitrittsPdf} className="underline link-brand">
            Beitrittserklärung (PDF)
          </a>
          .
        </p>
      </section>


      <section className="shell rule-t py-12" aria-labelledby="formular">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 id="formular" className="display-md">
              Online beitreten
            </h2>
            {gesendet ? (
              <p role="status" className="mt-8 border border-line bg-card p-6">
                Vielen Dank für Ihren Antrag. Die Geschäftsstelle meldet sich innerhalb weniger Tage
                bei Ihnen.
              </p>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="mw-vorname" className="eyebrow">Vorname</label>
                  <input id="mw-vorname" name="vorname" required maxLength={60} autoComplete="given-name"
                    className="mt-1 w-full border border-line bg-card px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label htmlFor="mw-nachname" className="eyebrow">Nachname</label>
                  <input id="mw-nachname" name="nachname" required maxLength={60} autoComplete="family-name"
                    className="mt-1 w-full border border-line bg-card px-3 py-2.5 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="mw-email" className="eyebrow">E-Mail</label>
                  <input id="mw-email" name="email" type="email" required maxLength={255} autoComplete="email"
                    className="mt-1 w-full border border-line bg-card px-3 py-2.5 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="mw-org" className="eyebrow">Büro / Unternehmen (optional)</label>
                  <input id="mw-org" name="organisation" maxLength={120} autoComplete="organization"
                    className="mt-1 w-full border border-line bg-card px-3 py-2.5 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="mw-typ" className="eyebrow">Art der Mitgliedschaft</label>
                <select id="mw-typ" name="typ" className="mt-1 w-full border border-line bg-card px-3 py-2.5 text-sm">
                  <option>Personenmitgliedschaft</option>
                  <option>Fördermitgliedschaft</option>
                </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="mw-nachricht" className="eyebrow">Nachricht (optional)</label>
                  <textarea id="mw-nachricht" name="nachricht" rows={4} maxLength={1000}
                    className="mt-1 w-full border border-line bg-card px-3 py-2.5 text-sm" />
                </div>
                <label className="flex items-start gap-2 text-sm sm:col-span-2">
                  <input type="checkbox" name="datenschutz" required className="mt-1 size-4 accent-[var(--brand)]" />
                  <span>Ich habe die Datenschutzhinweise gelesen und stimme der Verarbeitung meiner Daten zu.</span>
                </label>
                {fehler && (
                  <p role="alert" className="sm:col-span-2 text-sm text-destructive">
                    {fehler}
                  </p>
                )}
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-solid">Antrag senden</button>
                </div>
              </form>
            )}
          </div>
          <aside className="md:col-span-5">
            <div className="border border-line bg-card p-6">
              <h2 className="eyebrow">Lieber auf Papier?</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Das Beitrittsformular gibt es weiterhin als PDF zum Ausdrucken und Zurücksenden an die
                Geschäftsstelle.
              </p>
              <a href={beitrittsPdf} className="btn-outline mt-4 w-full">Beitrittserklärung (PDF)</a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
