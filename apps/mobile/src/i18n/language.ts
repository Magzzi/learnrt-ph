export type Language = "en" | "fil";

export const LANGUAGES: readonly Language[] = ["en", "fil"];

/**
 * The app language for the device's preferred languages (BCP 47 tags, most preferred first).
 * Filipino for `fil` or `tl` (Tagalog), English for everything else.
 */
export function pickLanguage(deviceLanguageTags: readonly string[]): Language {
  const primary = deviceLanguageTags[0]?.split("-")[0]?.toLowerCase();
  return primary === "fil" || primary === "tl" ? "fil" : "en";
}
