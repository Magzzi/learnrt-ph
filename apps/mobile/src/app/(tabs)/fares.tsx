import { fareData, getLine, type TicketType } from "@learnrt/core";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { Segmented } from "@/components/Segmented";
import { StationPicker } from "@/components/StationPicker";
import { UnverifiedBadge } from "@/components/UnverifiedBadge";
import { FARE_LINES, faresReducer, formatPesos, initialFaresState, quote, type FareLine } from "@/fares/faresState";
import colors from "@/theme/colors";

export default function FaresScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ line?: string; from?: string; at?: string }>();
  const [state, dispatch] = useReducer(faresReducer, params, initialFaresState);

  // "Fares from here" re-opens this tab; `at` changes on every tap, so the origin is applied each time.
  useEffect(() => {
    const next = initialFaresState(params);
    if (params.from && next.from) {
      dispatch({ type: "line", line: next.line });
      dispatch({ type: "from", stationId: next.from });
    }
  }, [params.line, params.from, params.at]);

  const result = quote(state);

  return (
    <ScrollView className="flex-1 bg-base" contentContainerClassName="gap-4 p-4">
      <View className="gap-2">
        <Text className="text-sm text-muted">{t("fares.line")}</Text>
        <Segmented<FareLine>
          options={FARE_LINES.map((id) => ({ value: id, label: getLine(id)!.name }))}
          value={state.line}
          onChange={(line) => dispatch({ type: "line", line })}
        />
      </View>

      <StationPicker
        label={t("fares.from")}
        lineId={state.line}
        value={state.from}
        onChange={(stationId) => dispatch({ type: "from", stationId })}
      />
      <StationPicker
        label={t("fares.to")}
        lineId={state.line}
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
          <Text className="text-white">{t("fares.discounted")}</Text>
          <Text className="text-sm text-muted">{t("fares.discountedHint")}</Text>
        </View>
        <Switch
          value={state.discounted}
          onValueChange={(value) => dispatch({ type: "discounted", value })}
          importantForAccessibility="no-hide-descendants"
          trackColor={{ true: colors.accentStrong, false: colors.raised }}
        />
      </Pressable>

      <View className="gap-2 rounded-xl border border-raised bg-panel p-4" accessibilityLiveRegion="polite">
        <View className="flex-row items-center justify-between">
          <Text className="text-muted">{t("fares.fare")}</Text>
          {fareData.lastVerified === null && <UnverifiedBadge />}
        </View>
        {result.kind === "fare" ? (
          <Text className="text-4xl font-bold text-white">{formatPesos(result.pesos)}</Text>
        ) : (
          <Text className="text-lg text-white">{t(result.kind === "no-fare" ? "fares.noFare" : "fares.incomplete")}</Text>
        )}
      </View>

      <Text className="text-sm text-muted">{t("fares.oneLine")}</Text>
    </ScrollView>
  );
}
