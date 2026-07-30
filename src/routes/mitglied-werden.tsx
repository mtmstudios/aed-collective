import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/ui-bits";


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
      <PageHeader
        eyebrow="Mitgliedschaft"
        titel="Sei ein Teil des Netzwerks"
        size="xl"
        intro="Eine Mitgliedschaft im aed e.V. bedeutet: ganzjährig Programm, ein belastbares Netzwerk und die Förderung des gestalterischen Nachwuchses."
      />

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
          Der aed wird von vielen Personen getragen, ohne die die zahlreichen Aktivitäten des Vereins
          nicht denkbar wären. Neben dem ehrenamtlichen Vorstand und Beirat wird der aed vor allem
          getragen und finanziert durch Förder- und Personenmitglieder. Das Netzwerk des aed ist
          branchenübergreifend, mit dem Ziel, den Austausch über Disziplinen hinweg zu ermöglichen und
          zu fördern. Aus Datenschutzgründen nennen wir unsere mehr als 400 Personenmitglieder nicht.
          Wir bitten um Verständnis.
        </p>
        <ul className="mt-8 grid gap-6">
          {beitraege.map((b) => (
            <li key={b.typ} className="border border-line bg-card p-6">
              <h3 className="font-display text-xl">{b.typ}</h3>
              <p className="mt-3 text-muted-foreground">
                Der aed lebt von Menschen, die Ideen teilen, Diskussionen anstoßen und Gestaltung
                aktiv mitprägen. Mit einer Mitgliedschaft werden Sie Teil dieses Netzwerks und
                ermöglichen zugleich ein vielseitiges Programm aus Vorträgen, Ausstellungen,
                Exkursionen und Begegnungen.
              </p>
              <p className="mt-3 text-muted-foreground">
                Ihr Beitrag hilft dabei, unsere Geschäftsstelle zu sichern, inspirierende Referenten
                nach Stuttgart einzuladen und neue Formate auf den Weg zu bringen. Kurz: Sie schaffen
                die Grundlage dafür, dass der aed auch in Zukunft ein lebendiger Ort für Architektur,
                Design und kreativen Austausch bleibt.
              </p>
              <p className="mt-3 text-muted-foreground">Werden Sie Teil des aed – wir freuen uns auf Sie!</p>
            </li>
          ))}
        </ul>



        <div className="mt-8 border border-line bg-card p-6 md:p-8">
          <h3 className="font-display text-xl">Fördermitgliedschaft</h3>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground whitespace-pre-line">
            Für Büros, Unternehmen und Institutionen – inklusive Nennung auf der Mitgliederseite.
            {"\n"}Markenunternehmen, Architektur- und Designbüros sowie designrelevante Organisationen sind wichtige Mitglieder im aed und unterstützen unsere Aktivitäten.
            {"\n"}
          </p>
          <Link to="/mitglieder" className="btn-solid mt-6 inline-flex">
            Alle Fördermitglieder anschauen
          </Link>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Die aktuellen Mitgliedsbeiträge finden Sie in der{" "}
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
                    {beitraege.map((b) => (
                      <option key={b.typ}>{b.typ}</option>
                    ))}
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
