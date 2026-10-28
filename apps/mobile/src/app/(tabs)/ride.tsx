import { fareData, getStation, rideStations, rideStatus, type TicketType } from "@learnrt/core";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { Segmented } from "@/components/Segmented";
import { StationPicker } from "@/components/StationPicker";
import { UnverifiedBadge } from "@/components/UnverifiedBadge";
import { beginRide, useActiveRide } from "@/ride/activeRide";
import { initialPlanState, planReducer, planRides } from "@/ride/planState";
import { RouteSummary } from "@/ride/RouteSummary";
import { useTheme } from "@/theme";

export default function RideScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const params = useLocalSearchParams<{ from?: string; to?: string; at?: string }>();
  const [state, dispatch] = useReducer(planReducer, params, initialPlanState);

  // "Ride from here" / "Ride to here" re-open this tab; `at` changes on every tap.
  const { from, to, at } = params;
  useEffect(() => {
    const next = initialPlanState({ from, to });
    if (next.from) dispatch({ type: "from", stationId: next.from });
    if (next.to) dispatch({ type: "to", stationId: next.to });
  }, [from, to, at]);

  const result = planRides(state);
  const active = useActiveRide();
  const activeTo = active && !rideStatus(active).completed ? rideStations(active.route).at(-1) : undefined;

  return (
    <ScrollView className="flex-1 bg-page" contentContainerClassName="gap-4 p-4">
      {activeTo && (
        <Pressable
          onPress={() => router.push("/guided-ride")}
          accessibilityRole="button"
          className="items-center rounded-xl border border-accent bg-card p-4"
        >
          <Text className="font-semibold text-accentInk">{t("plan.continue", { station: getStation(activeTo)!.name })}</Text>
        </Pressable>
      )}
      <StationPicker label={t("plan.from")} value={state.from} onChange={(stationId) => dispatch({ type: "from", stationId })} />
      <Pressable
        onPress={() => dispatch({ type: "swap" })}
        accessibilityRole="button"
        accessibilityLabel={t("plan.swap")}
        className="self-end rounded-full border border-edge px-3 py-1"
      >
        <Text className="text-accentInk">⇅</Text>
      </Pressable>
      <StationPicker label={t("plan.to")} value={state.to} onChange={(stationId) => dispatch({ type: "to", stationId })} />

      <View className="gap-2">
        <Text className="text-sm text-muted">{t("fares.ticket")}</Text>
        <Segmented<TicketType>
          options={[
            { value: "single-journey", label: t("fares.singleJourney") },
            { value: "stored-value", label: t("fares.storedValue") },
          ]}
          value={state.ticket}
          onChange={(ticket) => dispatch({ type: "ticket", ticket })}
        />
      </View>

      <Pressable
        onPress={() => dispatch({ type: "discounted", value: !state.discounted })}
        accessibilityRole="switch"
        accessibilityState={{ checked: state.discounted }}
        accessibilityLabel={t("fares.discounted")}
        className="flex-row items-center justify-between gap-4"
      >
        <Text className="flex-1 text-ink">{t("fares.discounted")}</Text>
        <Switch
          value={state.discounted}
          onValueChange={(value) => dispatch({ type: "discounted", value })}
          importantForAccessibility="no-hide-descendants"
          trackColor={{ true: theme.accent, false: theme.sunken }}
        />
      </Pressable>

      {result.kind === "planned" ? (
        result.options.map((option) => (
          <View key={option.route.basis} className="gap-3 rounded-xl border border-edge bg-card p-4">
            <View className="flex-row items-start justify-between gap-2">
              <View className="flex-1">
                <Text className="text-base font-semibold text-ink" accessibilityRole="header">
                  {t(option.route.basis === "fewest-transfers" ? "plan.fewestTransfers" : "plan.fewerStops")}
                </Text>
                <Text className="text-xs text-muted">{t("plan.estimated")}</Text>
              </View>
              {fareData.lastVerified === null && <UnverifiedBadge />}
            </View>
            <RouteSummary option={option} />
            <Pressable
              onPress={() => beginRide(option.route, state.ticket, state.discounted)}
              accessibilityRole="button"
              className="items-center rounded-xl bg-accent p-4"
            >
              <Text className="font-semibold text-onAccent">{t("plan.start")}</Text>
            </Pressable>
          </View>
        ))
      ) : (
        <Text className="text-muted" accessibilityLiveRegion="polite">
          {t(result.kind === "incomplete" ? "plan.incomplete" : result.kind === "same-station" ? "plan.sameStation" : "plan.noRoute")}
        </Text>
      )}
    </ScrollView>
  );
}
