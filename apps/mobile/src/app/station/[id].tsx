import { getLine, getStation } from "@learnrt/core";
import { Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

// Stub until M1-06 builds the full Station detail.
export default function StationScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const station = getStation(id);
  const line = station && getLine(station.lineId);
  return (
    <View className="flex-1 gap-2 bg-base p-4">
      <Stack.Screen options={{ title: station?.name ?? t("station.notFound") }} />
      <Text className="text-2xl font-bold text-white">{station?.name ?? t("station.notFound")}</Text>
      {line && <Text className="text-muted">{line.name}</Text>}
    </View>
  );
}
