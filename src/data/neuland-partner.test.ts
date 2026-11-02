import { describe, test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { neulandPartner } from "./neuland-partner";

describe("neuland-Kooperationspartner", () => {
  test("enthält ausschließlich die sechs ausgewählten Organisationen in der gewünschten Reihenfolge", () => {
    deepStrictEqual(neulandPartner.map(({ name }) => name), [
      "Karl Schlecht Stiftung",
      "German Design Council",
      "NFG Gruppe",
      "Werner Sobek",
      "Atelier Brückner",
      "Studio Kurbos",
    ]);
  });
});