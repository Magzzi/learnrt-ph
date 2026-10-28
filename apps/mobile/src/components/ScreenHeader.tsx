import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";

/** A tab's header: large serif title, a one-line subtitle, and the settings button (About). */
export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-row items-start gap-3 bg-page px-4 pb-3" style={{ paddingTop: insets.top + 12 }}>
      <View className="flex-1">
        <Text className="font-display text-3xl text-ink" accessibilityRole="header">
          {title}
        </Text>
        {subtitle && <Text className="mt-1 text-base text-muted">{subtitle}</Text>}
      </View>
      <Pressable
        onPress={() => router.push("/about")}
        accessibilityRole="button"
        accessibilityLabel={t("common.settings")}
        className="h-12 w-12 items-center justify-center rounded-full bg-sunken"
      >
        <Ionicons name="settings-sharp" size={22} color={theme.ink} />
      </Pressable>
    </View>
  );
}
