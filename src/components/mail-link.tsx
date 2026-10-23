import { useEffect, useState } from "react";

/**
 * E-Mail-Adresse, die Sammelprogramme nicht einfach mitnehmen.
 *
 * Im ausgelieferten HTML steht die Adresse nur getrennt und ohne mailto-Link.
 * Erst im Browser wird daraus eine anklickbare Adresse. Wer die Seite ohne
 * JavaScript liest, sieht weiterhin "name [at] domain" und kann sie abtippen.
 *
 * Das hält keinen entschlossenen Angreifer auf, aber die einfachen Crawler,
 * die nach "mailto:" und nach dem @-Zeichen suchen.
 */
export function MailLink({ adresse, className = "" }: { adresse: string; className?: string }) {
  const [benutzer, domain] = adresse.split("@");
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => setSichtbar(true), []);

  if (!domain) return null;

  if (!sichtbar) {
    return (
      <span className={className}>
        {benutzer} [at] {domain}
      </span>
    );
  }

  return (
    <a href={`mailto:${benutzer}@${domain}`} className={className}>
      {benutzer}@{domain}
    </a>
  );
}
