/**
 * Der Schlüssel, mit dem diese Anwendung signiert.
 *
 * Damit werden zwei Dinge unterschrieben, die beide Zugang gewähren:
 * die Sitzungen des Jurybereichs und die befristeten Links auf hochgeladene
 * Dateien. Wer den Schlüssel kennt, kann sich beides selbst ausstellen –
 * eine Jury-Sitzung in der Rolle der Geschäftsstelle ebenso wie einen Link
 * auf jede Bewerbungsdatei.
 *
 * Bis hierher war das SITE_PASSWORD. Das ist ein geteiltes Passwort, kurz,
 * zum Vorzeigen gedacht und an alle Beteiligten verteilt – als Schlüssel
 * taugt es deshalb nicht. SITE_PASSWORD bleibt, was es sein soll: ein
 * Passwort, gegen das verglichen wird. Unterschrieben wird mit einem
 * eigenen Zufallswert aus der Umgebung.
 *
 * Erzeugen:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
 *
 * Ändert sich der Schlüssel, werden offene Jury-Sitzungen und noch gültige
 * Dateilinks ungültig. Beides ist kurzlebig (12 Stunden bzw. eine Stunde),
 * ein Wechsel kostet also nur eine erneute Anmeldung.
 */

const MINDESTLAENGE = 32;

let gemeldet = false;

export function signaturSchluessel(): string {
  const eigener = process.env["SIGNATUR_SCHLUESSEL"];
  if (eigener && eigener.length >= MINDESTLAENGE) return eigener;

  if (eigener && !gemeldet) {
    console.warn(
      `[Signatur] SIGNATUR_SCHLUESSEL ist nur ${eigener.length} Zeichen lang, nötig sind ${MINDESTLAENGE}.`,
    );
    gemeldet = true;
  }

  throw new Error(
    "SIGNATUR_SCHLUESSEL fehlt oder ist zu kurz. Ohne ihn werden keine Sitzungen und keine Dateilinks ausgestellt.",
  );
}

/** Sagt, ob der Schlüssel brauchbar gesetzt ist – für die Meldung beim Start. */
export function signaturSchluesselVorhanden(): boolean {
  const eigener = process.env["SIGNATUR_SCHLUESSEL"];
  return typeof eigener === "string" && eigener.length >= MINDESTLAENGE;
}
