import { getLine, getStation, lines, stations, stationsOnLine, type LineId } from "@learnrt/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";
import { filterStations } from "@/map/search";
import { useTheme } from "@/theme";

/** Stations on operational Lines, Line by Line. */
const rideableStations = () => stations.filter((s) => getLine(s.lineId)?.status === "operational");

const operationalLines = lines.filter((l) => l.status === "operational");

/** A field that opens a list of a Line's Stations in Line order, or of every operational Station when no Line is given. */
export function StationPicker({
  label,
  lineId,
  stationIds,
  value,
  onChange,
}: {
  label: string;
  lineId?: LineId;
  /** Offer only these Stations, in this order (overrides `lineId`). */
  stationIds?: readonly string[];
  value: string | null;
  onChange: (stationId: string) => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // Without a fixed list or Line, the rider picks the railway first (null: every Line), then a Station.
  const picksLine = !lineId && !stationIds;
  const [chosenLine, setChosenLine] = useState<LineId | null>(null);
  const openPicker = () => {
    setQuery("");
    setChosenLine(value && getStation(value) ? getStation(value)!.lineId : (operationalLines[0]?.id ?? null));
    setOpen(true);
  };
  // Without a Line, the Line is part of the name: there are two Santolan and two Cubao Stations.
  const withLine = (id: string) => {
    const station = getStation(id)!;
    return lineId ? station.name : `${station.name} (${getLine(station.lineId)!.name})`;
  };
  const name = value && getStation(value) ? withLine(value) : undefined;

  return (
    <View className="gap-1">
      <Text className="text-sm text-muted">{label}</Text>
      <Pressable
        onPress={openPicker}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${name ?? t("fares.choose")}`}
        className="flex-row items-center justify-between gap-2 rounded-2xl border border-edge bg-card px-4 py-4"
      >
        <Text className={`flex-1 text-base ${name ? "text-ink" : "text-muted"}`}>{name ?? t("fares.choose")}</Text>
        <Ionicons name="chevron-down" size={18} color={theme.muted} />
      </Pressable>
      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 bg-page pt-12">
          <View className="flex-row items-center justify-between px-4 pb-2">
            <Text className="font-display text-2xl text-ink">{label}</Text>
            <Pressable onPress={() => setOpen(false)} accessibilityRole="button" className="p-2">
              <Text className="text-accentInk">{t("fares.close")}</Text>
            </Pressable>
          </View>
          {picksLine && (
            <View className="gap-2 px-4 pb-2">
              <Text className="text-sm text-muted">{t("map.chooseLine")}</Text>
              <View className="flex-row flex-wrap gap-2" accessibilityRole="radiogroup">
                {[...operationalLines.map((l) => ({ id: l.id as LineId | null, name: l.name })), { id: null, name: t("map.allLines") }].map((l) => {
                  const selected = l.id === chosenLine;
                  return (
                    <Pressable
                      key={l.id ?? "all"}
                      onPress={() => setChosenLine(l.id)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      className={`flex-row items-center gap-2 rounded-full border px-4 py-2 ${selected ? "border-accent bg-accentSoft" : "border-edge bg-card"}`}
                    >
                      {l.id && <View className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.lines[l.id] }} />}
                      <Text className={selected ? "font-semibold text-accentInk" : "text-ink"}>{l.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
          <View className="mx-4 mb-2 flex-row items-center gap-2 rounded-2xl border border-edge bg-card px-3">
            <Ionicons name="search" size={18} color={theme.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t("map.searchPlaceholder")}
              placeholderTextColor={theme.muted}
              autoCorrect={false}
              accessibilityLabel={t("map.searchPlaceholder")}
              className="flex-1 py-3 text-base text-ink"
            />
          </View>
          <FlatList
            data={filterStations(
              stationIds ? stationIds.map((id) => getStation(id)!) : lineId ? stationsOnLine(lineId) : picksLine && chosenLine ? stationsOnLine(chosenLine) : rideableStations(),
              query,
            )}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text className="px-4 py-4 text-muted">{t("map.noMatch", { query: query.trim() })}</Text>}
            keyExtractor={(s) => s.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: item.id === value }}
                className="border-b border-edge px-4 py-4"
              >
                <Text className={item.id === value ? "font-semibold text-accentInk" : "text-ink"}>{withLine(item.id)}</Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
