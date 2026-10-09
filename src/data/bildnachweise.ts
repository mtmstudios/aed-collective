import { createContext, createElement, useContext, type ReactNode } from "react";

/**
 * Fotonachweise der Website.
 *
 * Gepflegt werden sie im Bildverzeichnis unter /admin/bildverzeichnis: Was dort
 * als Urheber:in eingetragen ist, erscheint unter dem Bild. Die Werte kommen
 * über den Root-Loader herein, damit sie auch serverseitig gerendert werden.
 *
 * Die Liste hier darunter ist nur noch ein Rückfall für Bilder, die bewusst
 * fest verdrahtet sind – normalerweise bleibt sie leer.
 */
export const bildnachweise: Record<string, string> = {};

const NachweisKontext = createContext<Record<string, string>>({});

export function BildnachweisProvider({
  werte,
  children,
}: {
  werte: Record<string, string>;
  children: ReactNode;
}) {
  return createElement(NachweisKontext.Provider, { value: werte }, children);
}

/** Liefert den Nachweis-Text zu einem Bildpfad, sonst undefined. */
export function useBildnachweis(src?: string): string | undefined {
  const ausVerzeichnis = useContext(NachweisKontext);
  if (!src) return undefined;
  return ausVerzeichnis[src] ?? bildnachweise[src];
}

/** Variante ohne Hook, etwa für Exporte außerhalb der Komponenten. */
export function bildnachweis(src?: string): string | undefined {
  if (!src) return undefined;
  return bildnachweise[src];
}
