import { findNearestStations, getLine, type NearestStation } from "@learnrt/core";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { LINE_COLORS } from "@/map/lineColors";
import { formatDistance } from "@/nearest/formatDistance";
import colors from "@/theme/colors";

type Status =
  | { kind: "idle" }
  | { kind: "finding" }
  | { kind: "denied"; canAskAgain: boolean }
  | { kind: "unavailable" }
  | { kind: "found"; results: NearestStation[] };

/** The phone's position, or null. Falls back to the last known fix, e.g. underground. */
async function currentPosition() {
  try {
    // High accuracy uses GPS, which keeps working in airplane mode; Balanced relies on the network on Android.
    const fix = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    return fix.coords;
  } catch {
    return (await Location.getLastKnownPositionAsync().catch(() => null))?.coords ?? null;
  }
}

export default function NearestScreen() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

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
        ? { kind: "found", results: findNearestStations({ lat: coords.latitude, lng: coords.longitude }) }
        : { kind: "unavailable" },
    );
  };

  const button = (label: string, onPress: () => void, primary = false) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`items-center rounded-xl p-4 ${primary ? "bg-primary" : "border border-border"}`}
    >
      <Text className={primary ? "font-semibold text-black" : "text-accent"}>{label}</Text>
    </Pressable>
  );
  const openMap = () => router.navigate("/");

  return (
    <ScrollView className="flex-1 bg-base" contentContainerClassName="gap-4 p-4">
      <Text className="text-white">{t("nearest.explain")}</Text>

      {status.kind === "finding" && (
        <View className="flex-row items-center gap-3" accessibilityLiveRegion="polite">
          <ActivityIndicator color={colors.accent} />
          <Text className="text-muted">{t("nearest.finding")}</Text>
        </View>
      )}

      {status.kind === "denied" && (
        <View className="gap-3" accessibilityLiveRegion="polite">
          <Text className="text-white">{t("nearest.denied")}</Text>
          {status.canAskAgain
            ? button(t("nearest.tryAgain"), find, true)
            : button(t("nearest.openSettings"), () => void Linking.openSettings(), true)}
          {button(t("nearest.openMap"), openMap)}
        </View>
      )}

      {status.kind === "unavailable" && (
        <View className="gap-3" accessibilityLiveRegion="polite">
          <Text className="text-white">{t("nearest.unavailable")}</Text>
          {button(t("nearest.tryAgain"), find, true)}
          {button(t("nearest.openMap"), openMap)}
        </View>
      )}

      {status.kind === "found" && (
        <View className="gap-2" accessibilityLiveRegion="polite">
          <Text className="text-base font-semibold text-white" accessibilityRole="header">
            {t("nearest.closest")}
          </Text>
          {status.results.map(({ station, distanceKm }) => {
            const line = getLine(station.lineId)!;
            return (
              <Pressable
                key={station.id}
                onPress={() => router.push({ pathname: "/station/[id]", params: { id: station.id } })}
                accessibilityRole="link"
                className="flex-row items-center justify-between rounded-xl border border-raised bg-panel p-4"
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-3 w-3 rounded-full" style={{ backgroundColor: LINE_COLORS[line.id] }} />
                  <View>
                    <Text className="text-lg text-white">{station.name}</Text>
                    <Text className="text-muted">{line.name}</Text>
                  </View>
                </View>
                <Text className="text-accent">{t("nearest.away", { distance: formatDistance(distanceKm) })}</Text>
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
