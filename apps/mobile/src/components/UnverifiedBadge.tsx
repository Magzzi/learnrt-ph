import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/theme";

/**
 * A yellow warning icon beside any data whose `lastVerified` is null. Tapping it says what that means,
 * so the icon never stands alone without an explanation.
 */
export function UnverifiedBadge() {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => Alert.alert(t("unverified.label"), t("about.unverified"))}
      accessibilityRole="button"
      accessibilityLabel={t("unverified.a11y")}
      hitSlop={10}
      className="h-8 w-8 items-center self-start justify-center rounded-full bg-caution"
    >
      <Ionicons name="warning" size={18} color={theme.onCaution} />
    </Pressable>
  );
}
