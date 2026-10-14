import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { anmeldenNewsletter } from "@/lib/newsletter.functions";

export function Newsletter() {
  const anmelden = useServerFn(anmeldenNewsletter);
  const [erledigt, setErledigt] = useState<string | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [laeuft, setLaeuft] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const felder = new FormData(e.currentTarget);
    setFehler(null);
    setLaeuft(true);
    try {
      const antwort = await anmelden({
        data: {
          vorname: String(felder.get("vorname") ?? ""),
          nachname: String(felder.get("nachname") ?? ""),
          email: String(felder.get("email") ?? ""),
          neuland: felder.get("neuland") === "on",
        },
      });
      if (antwort.ok) setErledigt(antwort.hinweis);
      else setFehler(antwort.fehler);
    } catch {
      setFehler("Die Anmeldung hat nicht geklappt. Bitte später noch einmal versuchen.");
    } finally {
      setLaeuft(false);
    }
  }

  if (erledigt) {
    return (
      <p
        role="status"
        className="mt-6 border border-footer-line bg-footer-input-bg p-4 text-sm text-footer-text"
      >
        {erledigt}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label htmlFor="nl-vorname" className="eyebrow text-footer-muted">
          Vorname
        </label>
        <input
          id="nl-vorname"
          name="vorname"
          autoComplete="given-name"
          required
          maxLength={60}
          className="mt-1 w-full border border-footer-input-border bg-footer-input-bg px-3 py-2.5 text-sm text-footer-text placeholder:text-footer-muted"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="nl-nachname" className="eyebrow text-footer-muted">
          Nachname
        </label>
        <input
          id="nl-nachname"
          name="nachname"
          autoComplete="family-name"
          required
          maxLength={60}
          className="mt-1 w-full border border-footer-input-border bg-footer-input-bg px-3 py-2.5 text-sm text-footer-text"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="nl-email" className="eyebrow text-footer-muted">
          E-Mail
        </label>
        <input
          id="nl-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={255}
          className="mt-1 w-full border border-footer-input-border bg-footer-input-bg px-3 py-2.5 text-sm text-footer-text"
        />
      </div>
      <label className="flex items-start gap-2 text-sm text-footer-text sm:col-span-2">
        <input type="checkbox" name="neuland" className="mt-1 size-4 accent-brand" />
        <span>Zusätzlich Infos zum Nachwuchswettbewerb neuland erhalten</span>
      </label>
      {fehler && (
        <p role="alert" className="text-sm text-footer-text sm:col-span-2">
          {fehler}
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={laeuft}
          className="inline-flex items-center justify-center gap-2 min-h-[2.75rem] rounded-full border border-brand bg-brand px-7 font-display text-[0.9375rem] font-medium text-brand-foreground transition-colors hover:bg-[var(--aed-hover)] hover:text-[var(--aed-hover-foreground)] disabled:opacity-60 w-full sm:w-auto"
        >
          {laeuft ? "WIRD GESENDET …" : "JETZT ANMELDEN"}
        </button>
      </div>
    </form>
  );
}
