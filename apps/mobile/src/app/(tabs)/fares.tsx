import { fareData, getLine, getStation, type TicketType } from "@learnrt/core";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { Segmented } from "@/components/Segmented";
import { StationPicker } from "@/components/StationPicker";
import { UnverifiedBadge } from "@/components/UnverifiedBadge";
import { faresReducer, formatPesos, initialFaresState, quote } from "@/fares/faresState";
import { useTheme } from "@/theme";

export default function FaresScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const params = useLocalSearchParams<{ from?: string; at?: string }>();
  const [state, dispatch] = useReducer(faresReducer, params, initialFaresState);

  // "Fares from here" re-opens this tab; `at` changes on every tap, so the origin is applied each time.
  const { from, at } = params;
  useEffect(() => {
    const next = initialFaresState({ from });
    if (next.from) dispatch({ type: "from", stationId: next.from });
  }, [from, at]);

  const result = quote(state);

  return (
    <ScrollView className="flex-1 bg-page" contentContainerClassName="gap-4 p-4">
      <StationPicker
        label={t("fares.from")}
        value={state.from}
        onChange={(stationId) => dispatch({ type: "from", stationId })}
      />
      <StationPicker
        label={t("fares.to")}
        value={state.to}
        onChange={(stationId) => dispatch({ type: "to", stationId })}
      />

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

      {/* The whole row toggles, so the label is as easy to hit as the switch. */}
      <Pressable
        onPress={() => dispatch({ type: "discounted", value: !state.discounted })}
        accessibilityRole="switch"
        accessibilityState={{ checked: state.discounted }}
        accessibilityLabel={t("fares.discounted")}
        accessibilityHint={t("fares.discountedHint")}
        className="flex-row items-center justify-between gap-4"
      >
        <View className="flex-1">
          <Text className="text-ink">{t("fares.discounted")}</Text>
          <Text className="text-sm text-muted">{t("fares.discountedHint")}</Text>
        </View>
        <Switch
          value={state.discounted}
          onValueChange={(value) => dispatch({ type: "discounted", value })}
          importantForAccessibility="no-hide-descendants"
          trackColor={{ true: theme.accent, false: theme.sunken }}
        />
      </Pressable>

      <View className="gap-2 rounded-xl border border-edge bg-card p-4" accessibilityLiveRegion="polite">
        <View className="flex-row items-center justify-between">
          <Text className="text-muted">{t("fares.fare")}</Text>
          {fareData.lastVerified === null && <UnverifiedBadge />}
        </View>
        {result.kind === "fare" ? (
          <>
            <Text className="text-4xl font-bold text-ink">
              {result.total === null ? t("plan.fareUnknown") : formatPesos(result.total)}
            </Text>
            {result.legs.length > 1 &&
              result.legs.map((leg) => (
                <View key={leg.lineId} className="flex-row justify-between">
                  <Text className="text-muted">
                    {getLine(leg.lineId)!.name}: {getStation(leg.from)!.name} → {getStation(leg.to)!.name}
                  </Text>
                  <Text className="text-ink">{leg.fare === null ? "–" : formatPesos(leg.fare)}</Text>
                </View>
              ))}
          </>
        ) : (
          <Text className="text-lg text-ink">
            {t(result.kind === "no-fare" ? "fares.noFare" : result.kind === "walk-only" ? "plan.walkOnly" : "fares.incomplete")}
          </Text>
        )}
      </View>

      <Text className="text-sm text-muted">{t("fares.oneLine")}</Text>
    </ScrollView>
  );
}
