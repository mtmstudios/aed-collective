import { test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { mitPortraet } from "./jury-sichtbarkeit";

test("Jurymitglieder ohne Foto bleiben gespeichert, aber unsichtbar", () => {
  const personen = [{ name: "Mit Foto" }, { name: "Ohne Foto" }];
  deepStrictEqual(mitPortraet(personen, (name) => name === "Mit Foto" ? "/foto.webp" : undefined), [{ name: "Mit Foto" }]);
  deepStrictEqual(personen, [{ name: "Mit Foto" }, { name: "Ohne Foto" }]);
});

test("ein hinterlegtes Foto macht das Mitglied automatisch wieder sichtbar", () => {
  const personen = [{ name: "Neues Foto" }];
  const bilder: Record<string, string> = {};
  deepStrictEqual(mitPortraet(personen, (name) => bilder[name]), []);
  bilder["Neues Foto"] = "/neues-foto.webp";
  deepStrictEqual(mitPortraet(personen, (name) => bilder[name]), [{ name: "Neues Foto" }]);
});