/** Daten bleiben erhalten; die öffentliche Auswahl folgt dem vorhandenen Porträt. */
export function mitPortraet<T extends { name: string }>(
  personen: readonly T[],
  bildFuer: (name: string) => string | undefined,
): T[] {
  return personen.filter((person) => Boolean(bildFuer(person.name)));
}