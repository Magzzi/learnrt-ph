import { findNearestStations, getLine, networkData, type NearestStation } from "@learnrt/core";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { Card } from "@/components/Card";
import { currentPosition } from "@/nearest/currentPosition";
import { formatDistance } from "@/nearest/formatDistance";
import { UnverifiedBadge } from "@/components/UnverifiedBadge";
import { useTheme } from "@/theme";

type SearchState =
  | { kind: "idle" }
  | { kind: "finding" }
  | { kind: "denied"; canAskAgain: boolean }
  | { kind: "unavailable" }
  | { kind: "found"; from: { lat: number; lng: number }; results: NearestStation[] };

export default function NearestScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [status, setStatus] = useState<SearchState>({ kind: "idle" });

  const find = async () => {
    setStatus({ kind: "finding" });
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      setStatus({ kind: "denied", canAskAgain: permission.canAskAgain });
      return;
    }
    const coords = await currentPosition();
    setStatus(
      coords
        ? {
            kind: "found",
            from: { lat: coords.latitude, lng: coords.longitude },
            results: findNearestStations({ lat: coords.latitude, lng: coords.longitude }),
          }
        : { kind: "unavailable" },
    );
  };

  const button = (label: string, onPress: () => void, primary = false) =>
    primary ? (
      <PrimaryButton label={label} icon="locate" onPress={onPress} />
    ) : (
      <View className="flex-row">
        <SecondaryButton label={label} onPress={onPress} />
      </View>
    );
  const openMap = () => router.navigate("/");

  return (
    <ScrollView className="flex-1 bg-page" contentContainerClassName="gap-4 p-4">
      <Card><Text className="text-ink">{t("nearest.explain")}</Text></Card>

      {status.kind === "finding" && (
        <View className="flex-row items-center gap-3" accessibilityLiveRegion="polite">
          <ActivityIndicator color={theme.accentInk} />
          <Text className="text-muted">{t("nearest.finding")}</Text>
        </View>
      )}

      {status.kind === "denied" && (
        <View className="gap-3" accessibilityLiveRegion="polite">
          <Text className="text-ink">{t("nearest.denied")}</Text>
          {status.canAskAgain
            ? button(t("nearest.tryAgain"), find, true)
            : button(t("nearest.openSettings"), () => void Linking.openSettings(), true)}
          {button(t("nearest.openMap"), openMap)}
        </View>
      )}

      {status.kind === "unavailable" && (
        <View className="gap-3" accessibilityLiveRegion="polite">
          <Text className="text-ink">{t("nearest.unavailable")}</Text>
          {button(t("nearest.tryAgain"), find, true)}
          {button(t("nearest.openMap"), openMap)}
        </View>
      )}

      {status.kind === "found" && (
        <View className="gap-2" accessibilityLiveRegion="polite">
          <View className="flex-row items-center justify-between">
            <Text className="font-display text-2xl text-ink" accessibilityRole="header">
              {t("nearest.closest")}
            </Text>
            {networkData.lastVerified === null && <UnverifiedBadge />}
          </View>
          {status.results.map(({ station, distanceKm }) => {
            const line = getLine(station.lineId)!;
            return (
              <Pressable
                key={station.id}
                onPress={() =>
                  router.push({
                    pathname: "/nearby/[id]",
                    params: { id: station.id, lat: String(status.from.lat), lng: String(status.from.lng), km: String(distanceKm) },
                  })
                }
                accessibilityRole="link"
                className="flex-row items-center justify-between rounded-2xl border border-edge bg-card p-4"
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.lines[line.id] }} />
                  <View>
                    <Text className="text-lg font-semibold text-ink">{station.name}</Text>
                    <Text className="text-muted">{line.name}</Text>
                  </View>
                </View>
                <Text className="font-semibold text-accentInk">{t("nearest.away", { distance: formatDistance(distanceKm) })}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {(status.kind === "idle" || status.kind === "found") &&
        button(status.kind === "idle" ? t("nearest.find") : t("nearest.tryAgain"), find, true)}
    </ScrollView>
  );
}
