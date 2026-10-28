import Ionicons from "@expo/vector-icons/Ionicons";
import { getLine, getStation } from "@learnrt/core";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { formatPesos } from "@/fares/faresState";
import { LINE_COLORS } from "@/map/lineColors";
import colors from "@/theme/colors";
import type { RouteOption } from "./planState";

const name = (id: string) => getStation(id)!.name;

/** One route: each Line ridden (stops, direction, Fare) and each Transfer walk, then the total Fare. */
export function RouteSummary({ option }: { option: RouteOption }) {
  const { t } = useTranslation();
  const { route, fare } = option;
  let leg = 0;

  return (
    <View className="gap-3">
      <Text className="text-sm text-muted">
        {route.transfers === 0 ? t("plan.noTransfers") : t("plan.transfers", { count: route.transfers })} ·{" "}
        {t("plan.stops", { count: route.stops })}
      </Text>
      {route.segments.map((s, i) => {
        if (s.kind === "walk") {
          const to = getStation(s.to)!;
          return (
            <View key={i} className="flex-row items-center gap-2">
              <Ionicons name="walk-outline" size={18} color={colors.muted} />
              <Text className="flex-1 text-white">{t("plan.walk", { station: to.name, line: getLine(to.lineId)!.name })}</Text>
            </View>
          );
        }
        const legFare = fare.legs[leg++]!.fare;
        return (
          <View key={i} className="flex-row gap-3">
            <View className="w-1 rounded-full" style={{ backgroundColor: LINE_COLORS[s.lineId] }} />
            <View className="flex-1 gap-0.5">
              <Text className="font-semibold text-white">
                {getLine(s.lineId)!.name}: {name(s.stationIds[0]!)} → {name(s.stationIds.at(-1)!)}
              </Text>
              <Text className="text-sm text-muted">
                {t("plan.stops", { count: s.stops })} · {t("plan.towards", { station: name(s.towards) })}
              </Text>
            </View>
            <Text className="text-white">{legFare === null ? "–" : formatPesos(legFare)}</Text>
          </View>
        );
      })}
      <View className="flex-row justify-between border-t border-raised pt-2">
        <Text className="text-muted">{t("plan.total")}</Text>
        <Text className="text-lg font-bold text-white">
          {fare.legs.length === 0 ? t("plan.walkOnly") : fare.total === null ? t("plan.fareUnknown") : formatPesos(fare.total)}
        </Text>
      </View>
    </View>
  );
}
