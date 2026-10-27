import { describe, expect, it } from "vitest";
import { en } from "./en";
import { fil } from "./fil";
import { filipinoResource, flatten, isFilipinoEntry } from "./translations";

const placeholders = (text: string) => [...text.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort();

describe("translations", () => {
  const english = flatten(en);
  const filipino = flatten(fil, isFilipinoEntry);

  it("has the same keys in English and Filipino", () => {
    expect(Object.keys(filipino).sort()).toEqual(Object.keys(english).sort());
  });

  it("keeps the same {{placeholders}} in both languages", () => {
    for (const [key, text] of Object.entries(english)) {
      expect(placeholders(filipino[key]!.text), key).toEqual(placeholders(text));
    }
  });

  it('marks every Filipino string "needs review" until the owner and a native speaker review it (PRD §11)', () => {
    for (const [key, entry] of Object.entries(filipino)) {
      expect(entry.review, key).toBe("needs review");
    }
  });

  it("gives i18next plain Filipino text", () => {
    expect(flatten(filipinoResource(fil))).toEqual(
      Object.fromEntries(Object.entries(filipino).map(([key, entry]) => [key, entry.text])),
    );
  });
});
