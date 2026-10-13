import { createContext, createElement, useContext, type ReactNode } from "react";

/**
 * Bildangaben der Website, gepflegt im Bildverzeichnis unter
 * /admin/bildverzeichnis:
 *
 * - Wer dort als Urheber:in eingetragen ist, erscheint unter dem Bild.
 * - Bilder, deren Rechte dort auf "ungeklärt" oder "nicht verwendbar" stehen,
 *   werden auf der Seite durch das aed-Logo ersetzt, bis die Freigabe vorliegt.
 *
 * Die Werte kommen über den Root-Loader herein, damit sie auch serverseitig
 * gerendert werden.
 */

/** Rückfall für Bilder, die bewusst fest verdrahtet sind – normalerweise leer. */
export const bildnachweise: Record<string, string> = {};

type Freigaben = { nachweise: Record<string, string>; gesperrt: Set<string> };

const Kontext = createContext<Freigaben>({ nachweise: {}, gesperrt: new Set() });

export function BildnachweisProvider({
  werte,
  gesperrt,
  children,
}: {
  werte: Record<string, string>;
  gesperrt: string[];
  children: ReactNode;
}) {
  return createElement(
    Kontext.Provider,
    { value: { nachweise: werte, gesperrt: new Set(gesperrt) } },
    children,
  );
}

/** Liefert den Nachweis-Text zu einem Bildpfad, sonst undefined. */
export function useBildnachweis(src?: string): string | undefined {
  const { nachweise } = useContext(Kontext);
  if (!src) return undefined;
  return nachweise[src] ?? bildnachweise[src];
}

/** Sagt, ob ein Bild mangels geklärter Rechte noch nicht gezeigt werden darf. */
export function useIstGesperrt(src?: string): boolean {
  const { gesperrt } = useContext(Kontext);
  if (!src) return false;
  return gesperrt.has(src);
}

/** Variante ohne Hook, etwa für Exporte außerhalb der Komponenten. */
export function bildnachweis(src?: string): string | undefined {
  if (!src) return undefined;
  return bildnachweise[src];
}
