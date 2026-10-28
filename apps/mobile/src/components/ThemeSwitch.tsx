import { useTranslation } from "react-i18next";
import { Segmented } from "@/components/Segmented";
import { THEME_PREFERENCES, type ThemePreference } from "@/theme/preference";
import { setThemePreference, useThemePreference } from "@/theme/themeStore";

const LABELS = { system: "about.themeSystem", light: "about.themeLight", dark: "about.themeDark" } as const;

/** Same as the phone, or light, or dark. */
export function ThemeSwitch() {
  const { t } = useTranslation();
  return (
    <Segmented<ThemePreference>
      options={THEME_PREFERENCES.map((value) => ({ value, label: t(LABELS[value]) }))}
      value={useThemePreference()}
      onChange={(value) => void setThemePreference(value)}
    />
  );
}
