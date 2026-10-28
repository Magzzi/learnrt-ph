import { useTranslation } from "react-i18next";
import { Chip } from "./Chip";

/** Shown next to any data whose `lastVerified` is null. */
export function UnverifiedBadge({ maxFontSizeMultiplier }: { maxFontSizeMultiplier?: number } = {}) {
  const { t } = useTranslation();
  return <Chip tone="warn" label={t("unverified.label")} icon="information-circle-outline" accessibilityLabel={t("unverified.a11y")} maxFontSizeMultiplier={maxFontSizeMultiplier} />;
}
