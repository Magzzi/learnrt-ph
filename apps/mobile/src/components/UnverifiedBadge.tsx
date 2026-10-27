import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

/** Shown next to any data whose `lastVerified` is null. */
export function UnverifiedBadge() {
  const { t } = useTranslation();
  return (
    <View
      className="self-start rounded-full border border-warning px-2 py-0.5"
      accessibilityLabel={t("unverified.a11y")}
    >
      <Text className="text-xs font-medium text-warning">{t("unverified.label")}</Text>
    </View>
  );
}
