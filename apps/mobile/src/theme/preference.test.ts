import { describe, expect, it } from "vitest";
import { parseThemePreference } from "./preference";

describe("parseThemePreference", () => {
  it("accepts the three choices", () => {
    expect(parseThemePreference("system")).toBe("system");
    expect(parseThemePreference("light")).toBe("light");
    expect(parseThemePreference("dark")).toBe("dark");
  });

  it("follows the phone when nothing, or something unknown, was saved", () => {
    expect(parseThemePreference(null)).toBe("system");
    expect(parseThemePreference("sepia")).toBe("system");
  });
});
