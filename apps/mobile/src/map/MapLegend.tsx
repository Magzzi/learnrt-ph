import { lines, networkData } from "@learnrt/core";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { UnverifiedBadge } from "@/components/UnverifiedBadge";
import { useTheme } from "@/theme";

export function MapLegend() {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <View className="absolute bottom-3 right-3 gap-1 rounded-lg border border-edge bg-card/90 p-2">
      {lines.map((line) => (
        <View key={line.id} className="flex-row items-center gap-2">
          <View
            className="h-1 w-6 rounded-full"
            style={{ backgroundColor: theme.lines[line.id], opacity: line.status === "operational" ? 1 : 0.6 }}
          />
          <Text className="text-xs text-ink">
            {line.name}
            {line.status === "coming-soon" ? ` · ${t("map.comingSoon")}` : ""}
          </Text>
        </View>
      ))}
      {networkData.lastVerified === null && <UnverifiedBadge />}
    </View>
  );
}
