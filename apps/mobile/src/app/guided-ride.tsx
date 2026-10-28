import { advanceStep, getStation, imAt, rideStations } from "@learnrt/core";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { Card } from "@/components/Card";
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
        <Text className="font-display text-2xl text-ink">{t("ride.complete")}</Text>
        <PrimaryButton label={t("ride.backToPlanner")} onPress={() => router.replace("/ride")} />
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
          <Text className="font-display text-2xl text-ink">
            {t("ride.stopsLeft", { count: status.stopsLeftOnLeg, station: getStation(getOffAt)!.name })}
          </Text>
        )}
      </View>

      <Card className="border-accent bg-accentSoft" accessibilityLiveRegion="polite">
        {unverified && <UnverifiedBadge />}
        <Text className="font-display text-2xl text-ink">{t(current.key as never, current.params)}</Text>
        {current.note && <Text className="text-muted">{t(current.note as never)}</Text>}
        {canAdvance && (
          <PrimaryButton label={t("ride.done")} icon="checkmark-circle" onPress={() => updateRide(advanceStep)} />
        )}
        {status.completed && <PrimaryButton label={t("ride.backToPlanner")} onPress={end} />}
      </Card>

      {ahead.length > 0 && (
        <Card className="gap-2">
          <Text className="text-sm text-muted">{t("ride.ahead")}</Text>
          {ahead.map((id) => (
            <Text key={id} className={id === getOffAt ? "font-semibold text-accentInk" : "text-ink"}>
              • {getStation(id)!.name}
            </Text>
          ))}
        </Card>
      )}

      {upcoming.map((text, i) => (
        <Text key={i} className="text-muted">
          {ride.stepIndex + i + 2}. {t(text.key as never, text.params)}
        </Text>
      ))}

      {!status.completed && alerts === "on" && <Text className="text-sm font-semibold text-accentInk">{t("alerts.on")}</Text>}
      {!status.completed && alerts === "accuracy" && (
        <Card className="gap-2 border-warn bg-warnSoft">
          <Text className="font-display text-xl text-ink">{t("alerts.explainTitle")}</Text>
          <Text className="text-muted">{t("alerts.accuracyOff")}</Text>
          <PrimaryButton label={t("alerts.turnOnAccuracy")} onPress={async () => setAlerts((await turnOnLocationAccuracy(ride)) ? "on" : "accuracy")} />
        </Card>
      )}
      {!status.completed && (alerts === "ask" || alerts === "off") && (
        <Card className="gap-2">
          <Text className="font-display text-xl text-ink">{t("alerts.explainTitle")}</Text>
          <Text className="text-muted">{t(alerts === "ask" ? "alerts.explain" : "alerts.off")}</Text>
          <PrimaryButton
            label={t(alerts === "ask" ? "alerts.enable" : "alerts.openSettings")}
            icon="notifications"
            onPress={async () => {
              if (alerts === "off") return void Linking.openSettings();
              if (!(await enableAlerts(ride))) return setAlerts("off");
              setAlerts((await geofencingAvailable()) ? "on" : "accuracy");
            }}
          />
        </Card>
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
          <View className="flex-row">
            <SecondaryButton label={t("ride.end")} onPress={end} />
          </View>
        </>
      )}
    </ScrollView>
  );
}
