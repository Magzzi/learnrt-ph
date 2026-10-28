import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/theme";

/** Shown next to any data whose `lastVerified` is null. */
export function UnverifiedBadge() {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <View
      className="flex-row items-center gap-1 self-start rounded-full bg-warnSoft px-3 py-1"
      accessibilityLabel={t("unverified.a11y")}
    >
      <Text className="text-sm font-medium text-warn">{t("unverified.label")}</Text>
      <Ionicons name="information-circle-outline" size={16} color={theme.warn} />
    </View>
  );
}
