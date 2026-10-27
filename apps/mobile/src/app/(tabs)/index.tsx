import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { LineMap } from "@/map/LineMap";
import { MapLegend } from "@/map/MapLegend";

export default function MapScreen() {
  const { t } = useTranslation();
  return (
    <View className="flex-1 bg-base">
      <LineMap onSelectStation={(id) => router.push({ pathname: "/station/[id]", params: { id } })} />
      <MapLegend />
      <Text className="absolute bottom-36 right-3 text-xs text-muted">{t("map.hint")}</Text>
    </View>
  );
}
