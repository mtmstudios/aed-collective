import { useState, type FormEvent } from "react";

export function Newsletter() {
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
  }

  if (done) {
    return (
      <p role="status" className="mt-6 border border-line bg-card p-4 text-sm">
        Danke! Bitte bestätigen Sie die Anmeldung über den Link in der E-Mail.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label htmlFor="nl-vorname" className="eyebrow">Vorname</label>
        <input
          id="nl-vorname"
          name="vorname"
          autoComplete="given-name"
          required
          maxLength={60}
          className="mt-1 w-full border border-line bg-card px-3 py-2.5 text-sm placeholder:text-muted-foreground"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="nl-nachname" className="eyebrow">Nachname</label>
        <input
          id="nl-nachname"
          name="nachname"
          autoComplete="family-name"
          required
          maxLength={60}
          className="mt-1 w-full border border-line bg-card px-3 py-2.5 text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="nl-email" className="eyebrow">E-Mail</label>
        <input
          id="nl-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={255}
          className="mt-1 w-full border border-line bg-card px-3 py-2.5 text-sm"
        />
      </div>
      <label className="flex items-start gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="neuland" className="mt-1 size-4 accent-[var(--brand)]" />
        <span>Zusätzlich Infos zum Nachwuchswettbewerb neuland erhalten</span>
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-solid w-full sm:w-auto">
          Anmelden
        </button>
      </div>
    </form>
  );
}
