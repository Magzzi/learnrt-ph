import { describe, expect, it } from "vitest";
import { pickLanguage } from "./language";

describe("pickLanguage", () => {
  it.each([
    [["fil-PH"], "fil"],
    [["tl"], "fil"],
    [["tl-PH", "en-US"], "fil"],
    [["en-US"], "en"],
    [["ja-JP"], "en"],
    [[], "en"],
  ])("device languages %j → %s", (tags, expected) => {
    expect(pickLanguage(tags)).toBe(expected);
  });

  it("follows the device's first language only", () => {
    expect(pickLanguage(["ja-JP", "fil-PH"])).toBe("en");
  });
});
