import type { LineStatus } from "@learnrt/core";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Section } from "@/components/Section";
import { LINE_COLORS } from "@/map/lineColors";
import { openStation } from "@/navigation";
import { stationDetail } from "@/station/detail";

const STATUS_KEYS = {
  operational: "lineStatus.operational",
  "coming-soon": "lineStatus.comingSoon",
  suspended: "lineStatus.suspended",
} as const satisfies Record<LineStatus, string>;


export default function StationScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = stationDetail(id);

  if (!detail) {
    return (
      <View className="flex-1 bg-base p-4">
        <Stack.Screen options={{ title: t("station.notFound") }} />
        <Text className="text-lg text-white">{t("station.notFound")}</Text>
      </View>
    );
  }

  const facilities = ["station.entrances", "station.platforms", "station.elevators"] as const;

  return (
    <ScrollView className="flex-1 bg-base" contentContainerClassName="gap-3 p-4">
      <Stack.Screen options={{ title: detail.title }} />

      <View className="gap-2">
        <Text className="text-3xl font-bold text-white" accessibilityRole="header">
          {detail.name}
        </Text>
        <View className="flex-row items-center gap-2">
          <View className="h-3 w-3 rounded-full" style={{ backgroundColor: LINE_COLORS[detail.line.id] }} />
          <Text className="text-white">{detail.line.name}</Text>
          <Text className="text-muted">· {t(STATUS_KEYS[detail.line.status])}</Text>
        </View>
      </View>

      <Section title={t("station.onThisLine")} unverified={detail.unverified.station}>
        <View className="flex-row flex-wrap gap-2">
          {detail.neighbours.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => openStation(n.id)}
              accessibilityRole="link"
              className="rounded-full border border-border px-3 py-2"
            >
              <Text className="text-accent">{n.name}</Text>
            </Pressable>
          ))}
        </View>
      </Section>

      {detail.transfers.length > 0 && (
        <Section title={t("station.transfer")} unverified={detail.unverified.transfers}>
          {detail.transfers.map((tr) => (
            <Pressable key={tr.stationId} onPress={() => openStation(tr.stationId)} accessibilityRole="link">
              <Text className="text-accent">{t("station.transferTo", { station: tr.stationName, line: tr.lineName })}</Text>
              <Text className="text-sm text-muted">{tr.directions ?? t("station.walkingNotAvailable")}</Text>
            </Pressable>
          ))}
        </Section>
      )}

      <Section title={t("station.nearby")} unverified={detail.unverified.landmarks && detail.landmarks.length > 0}>
        {detail.landmarks.length > 0 ? (
          detail.landmarks.map((l) => (
            <Text key={l} className="text-white">
              • {l}
            </Text>
          ))
        ) : (
          <Text className="text-muted">{t("station.noLandmarks")}</Text>
        )}
      </Section>

      <Section title={t("station.facilities")}>
        {facilities.map((key) => (
          <View key={key} className="flex-row justify-between">
            <Text className="text-white">{t(key)}</Text>
            <Text className="text-muted">{t("station.notAvailable")}</Text>
          </View>
        ))}
      </Section>

      {detail.line.status === "operational" && (
        <Pressable
          onPress={() => router.navigate({ pathname: "/fares", params: { from: detail.id, at: String(Date.now()) } })}
          accessibilityRole="button"
          className="items-center rounded-xl bg-primary p-4"
        >
          <Text className="font-semibold text-black">{t("station.faresFromHere")}</Text>
        </Pressable>
      )}
      {detail.line.status === "operational" && (
        <View className="flex-row gap-3">
          {(["from", "to"] as const).map((end) => (
            <Pressable
              key={end}
              onPress={() => router.navigate({ pathname: "/ride", params: { [end]: detail.id, at: String(Date.now()) } })}
              accessibilityRole="button"
              className="flex-1 items-center rounded-xl border border-accent p-4"
            >
              <Text className="font-semibold text-accent">{t(end === "from" ? "station.rideFromHere" : "station.rideToHere")}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
