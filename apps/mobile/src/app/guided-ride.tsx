import { advanceStep, getStation, imAt, rideStations } from "@learnrt/core";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { StationPicker } from "@/components/StationPicker";
import { UnverifiedBadge } from "@/components/UnverifiedBadge";
import { finishRide, updateRide, useActiveRide } from "@/ride/activeRide";
import { alertsEnabled, enableAlerts, geofencingAvailable, turnOnLocationAccuracy } from "@/ride/background";
import { rideView } from "@/ride/rideView";

export default function GuidedRideScreen() {
  const { t } = useTranslation();
  const ride = useActiveRide();
  // null: not checked yet; "ask": never asked on this screen; "accuracy": permissions given, but
  // Location Accuracy is off so the phone will not watch the Stations.
  const [alerts, setAlerts] = useState<"ask" | "on" | "off" | "accuracy" | null>(null);

  useEffect(() => {
    const check = async () => {
      const on = await alertsEnabled();
      const accurate = await geofencingAvailable();
      // Once alerts were on or refused, losing a permission means "off" (with a link to Settings),
      // not asking again.
      setAlerts((prev) => (on ? (accurate ? "on" : "accuracy") : prev === null || prev === "ask" ? "ask" : "off"));
    };
    void check();
    const sub = AppState.addEventListener("change", (s) => s === "active" && void check());
    return () => sub.remove();
  }, []);

  const end = async () => {
    await finishRide();
    if (router.canGoBack()) router.back();
    else router.replace("/ride");
  };

  if (!ride) {
    return (
      <View className="flex-1 gap-4 bg-page p-4">
        <Stack.Screen options={{ title: t("ride.title") }} />
        <Text className="text-lg text-ink">{t("ride.complete")}</Text>
        <Pressable onPress={() => router.replace("/ride")} accessibilityRole="button" className="items-center rounded-xl bg-accent p-4">
          <Text className="font-semibold text-onAccent">{t("ride.backToPlanner")}</Text>
        </Pressable>
      </View>
    );
  }

  const { status, current, canAdvance, getOffAt, ahead, upcoming, unverified } = rideView(ride);

  return (
    <ScrollView className="flex-1 bg-page" contentContainerClassName="gap-4 p-4">
      <Stack.Screen options={{ title: t("ride.title") }} />

      <View className="gap-1" accessibilityLiveRegion="polite">
        <Text className="text-muted">{t("ride.nowAt", { station: getStation(status.stationId)!.name })}</Text>
        {status.stopsLeftOnLeg > 0 && (
          <Text className="text-lg font-semibold text-ink">
            {t("ride.stopsLeft", { count: status.stopsLeftOnLeg, station: getStation(getOffAt)!.name })}
          </Text>
        )}
      </View>

      <View className="gap-3 rounded-xl border border-accent bg-card p-4" accessibilityLiveRegion="polite">
        {unverified && <UnverifiedBadge />}
        <Text className="text-xl font-bold text-ink">{t(current.key as never, current.params)}</Text>
        {current.note && <Text className="text-muted">{t(current.note as never)}</Text>}
        {canAdvance && (
          <Pressable
            onPress={() => updateRide(advanceStep)}
            accessibilityRole="button"
            className="items-center rounded-xl bg-accent p-3"
          >
            <Text className="font-semibold text-onAccent">{t("ride.done")}</Text>
          </Pressable>
        )}
        {status.completed && (
          <Pressable onPress={end} accessibilityRole="button" className="items-center rounded-xl bg-accent p-3">
            <Text className="font-semibold text-onAccent">{t("ride.backToPlanner")}</Text>
          </Pressable>
        )}
      </View>

      {ahead.length > 0 && (
        <View className="gap-1">
          <Text className="text-sm text-muted">{t("ride.ahead")}</Text>
          {ahead.map((id) => (
            <Text key={id} className={id === getOffAt ? "font-semibold text-accentInk" : "text-ink"}>
              • {getStation(id)!.name}
            </Text>
          ))}
        </View>
      )}

      {upcoming.map((text, i) => (
        <Text key={i} className="text-muted">
          {ride.stepIndex + i + 2}. {t(text.key as never, text.params)}
        </Text>
      ))}

      {!status.completed && alerts === "on" && <Text className="text-sm text-accentInk">{t("alerts.on")}</Text>}
      {!status.completed && alerts === "accuracy" && (
        <View className="gap-2 rounded-xl border border-warn bg-card p-4">
          <Text className="text-base font-semibold text-ink">{t("alerts.explainTitle")}</Text>
          <Text className="text-muted">{t("alerts.accuracyOff")}</Text>
          <Pressable
            onPress={async () => setAlerts((await turnOnLocationAccuracy(ride)) ? "on" : "accuracy")}
            accessibilityRole="button"
            className="items-center rounded-xl border border-accent p-3"
          >
            <Text className="font-semibold text-accentInk">{t("alerts.turnOnAccuracy")}</Text>
          </Pressable>
        </View>
      )}
      {!status.completed && (alerts === "ask" || alerts === "off") && (
        <View className="gap-2 rounded-xl border border-edge bg-card p-4">
          <Text className="text-base font-semibold text-ink">{t("alerts.explainTitle")}</Text>
          <Text className="text-muted">{t(alerts === "ask" ? "alerts.explain" : "alerts.off")}</Text>
          <Pressable
            onPress={async () => {
              if (alerts === "off") return void Linking.openSettings();
              if (!(await enableAlerts(ride))) return setAlerts("off");
              setAlerts((await geofencingAvailable()) ? "on" : "accuracy");
            }}
            accessibilityRole="button"
            className="items-center rounded-xl border border-accent p-3"
          >
            <Text className="font-semibold text-accentInk">{t(alerts === "ask" ? "alerts.enable" : "alerts.openSettings")}</Text>
          </Pressable>
        </View>
      )}

      {!status.completed && (
        <>
          <View className="gap-1">
            <StationPicker
              label={t("ride.imAt")}
              stationIds={rideStations(ride.route)}
              value={status.stationId}
              onChange={(stationId) => updateRide((state) => imAt(state, stationId))}
            />
            <Text className="text-sm text-muted">{t("ride.imAtHint")}</Text>
          </View>
          <Text className="text-sm text-muted">{t("ride.keepOpen")}</Text>
          <Pressable onPress={end} accessibilityRole="button" className="items-center rounded-xl border border-edge p-4">
            <Text className="text-ink">{t("ride.end")}</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}
