import { describe, expect, test } from "bun:test";
import { neulandPartner } from "./neuland-partner";

describe("neuland-Kooperationspartner", () => {
  test("enthält ausschließlich die sechs ausgewählten Organisationen in der gewünschten Reihenfolge", () => {
    expect(neulandPartner.map(({ name }) => name)).toEqual([
      "Karl Schlecht Stiftung",
      "German Design Council",
      "NFG Gruppe",
      "Werner Sobek",
      "Atelier Brückner",
      "Studio Kurbos",
    ]);
  });
});