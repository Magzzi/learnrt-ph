import Ionicons from "@expo/vector-icons/Ionicons";
import type { LineStatus } from "@learnrt/core";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { Section } from "@/components/Section";
import { openStation } from "@/navigation";
import { stationDetail } from "@/station/detail";
import { useTheme } from "@/theme";

const STATUS_KEYS = {
  operational: "lineStatus.operational",
  "coming-soon": "lineStatus.comingSoon",
  suspended: "lineStatus.suspended",
} as const satisfies Record<LineStatus, string>;


export default function StationScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = stationDetail(id);

  if (!detail) {
    return (
      <View className="flex-1 bg-page p-4">
        <Stack.Screen options={{ title: t("station.notFound") }} />
        <Text className="text-lg text-ink">{t("station.notFound")}</Text>
      </View>
    );
  }

  const facilities = ["station.entrances", "station.platforms", "station.elevators"] as const;

  return (
    <ScrollView className="flex-1 bg-page" contentContainerClassName="gap-3 p-4">
      <Stack.Screen options={{ title: detail.title }} />

      <View className="gap-2">
        <Text className="font-serif text-4xl text-ink" accessibilityRole="header">
          {detail.name}
        </Text>
        <View className="flex-row items-center gap-2">
          <View className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.lines[detail.line.id] }} />
          <Text className="text-ink">{detail.line.name}</Text>
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
              className="rounded-full border border-edge bg-card px-3 py-2"
            >
              <Text className="text-accentInk">{n.name}</Text>
            </Pressable>
          ))}
        </View>
      </Section>

      {detail.transfers.length > 0 && (
        <Section title={t("station.transfer")} unverified={detail.unverified.transfers}>
          {detail.transfers.map((tr) => (
            <Pressable key={tr.stationId} onPress={() => openStation(tr.stationId)} accessibilityRole="link">
              <Text className="text-accentInk">{t("station.transferTo", { station: tr.stationName, line: tr.lineName })}</Text>
              <Text className="text-sm text-muted">{tr.directions ?? t("station.walkingNotAvailable")}</Text>
            </Pressable>
          ))}
        </Section>
      )}

      <Section title={t("station.nearby")} unverified={detail.unverified.landmarks && detail.landmarks.length > 0}>
        {detail.landmarks.length > 0 ? (
          detail.landmarks.map((l) => (
            <Text key={l} className="text-ink">
              • {l}
            </Text>
          ))
        ) : (
          <Text className="text-muted">{t("station.noLandmarks")}</Text>
        )}
      </Section>

      <Pressable
        onPress={() => router.push({ pathname: "/street-map/[id]", params: { id: detail.id } })}
        accessibilityRole="button"
        className="flex-row items-center justify-center gap-2 rounded-2xl border border-edge bg-card p-4"
      >
        <Ionicons name="map-outline" size={20} color={theme.accentInk} />
        <Text className="font-semibold text-accentInk">{t("station.streetMap")}</Text>
      </Pressable>

      <Section title={t("station.facilities")}>
        {facilities.map((key) => (
          <View key={key} className="flex-row justify-between">
            <Text className="text-ink">{t(key)}</Text>
            <Text className="text-muted">{t("station.notAvailable")}</Text>
          </View>
        ))}
      </Section>

      {detail.line.status === "operational" && (
        <PrimaryButton
          label={t("station.faresFromHere")}
          icon="cash-outline"
          onPress={() => router.navigate({ pathname: "/fares", params: { from: detail.id, at: String(Date.now()) } })}
        />
      )}
      {detail.line.status === "operational" && (
        <View className="flex-row gap-3">
          {(["from", "to"] as const).map((end) => (
            <SecondaryButton
              key={end}
              label={t(end === "from" ? "station.rideFromHere" : "station.rideToHere")}
              onPress={() => router.navigate({ pathname: "/ride", params: { [end]: detail.id, at: String(Date.now()) } })}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
