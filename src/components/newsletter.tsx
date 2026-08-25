import { useState, type FormEvent } from "react";

export function Newsletter() {
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
  }

  if (done) {
    return (
      <p role="status" className="mt-6 border border-footer-line bg-footer-input-bg p-4 text-sm text-footer-text">
        Danke! Bitte bestätigen Sie die Anmeldung über den Link in der E-Mail.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label htmlFor="nl-vorname" className="eyebrow text-footer-muted">Vorname</label>
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
        <label htmlFor="nl-nachname" className="eyebrow text-footer-muted">Nachname</label>
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
        <label htmlFor="nl-email" className="eyebrow text-footer-muted">E-Mail</label>
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
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 min-h-[2.75rem] rounded-full border border-brand bg-brand px-7 font-display text-[0.9375rem] font-medium text-brand-foreground transition-colors hover:bg-transparent hover:text-brand w-full sm:w-auto"
        >
          JETZT ANMELDEN
        </button>
      </div>
    </form>
  );
}
