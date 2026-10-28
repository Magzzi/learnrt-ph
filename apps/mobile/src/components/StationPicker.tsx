import { getLine, getStation, stations, stationsOnLine, type LineId } from "@learnrt/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

/** Stations on operational Lines, Line by Line. */
const rideableStations = () => stations.filter((s) => getLine(s.lineId)?.status === "operational");

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
  const [open, setOpen] = useState(false);
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
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${name ?? t("fares.choose")}`}
        className="rounded-lg border border-border bg-base px-3 py-3"
      >
        <Text className={name ? "text-white" : "text-muted"}>{name ?? t("fares.choose")}</Text>
      </Pressable>
      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 bg-base pt-12">
          <View className="flex-row items-center justify-between px-4 pb-2">
            <Text className="text-xl font-bold text-white">{label}</Text>
            <Pressable onPress={() => setOpen(false)} accessibilityRole="button" className="p-2">
              <Text className="text-accent">{t("fares.close")}</Text>
            </Pressable>
          </View>
          <FlatList
            data={stationIds ? stationIds.map((id) => getStation(id)!) : lineId ? stationsOnLine(lineId) : rideableStations()}
            keyExtractor={(s) => s.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: item.id === value }}
                className="border-b border-raised px-4 py-4"
              >
                <Text className={item.id === value ? "font-semibold text-accent" : "text-white"}>{withLine(item.id)}</Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
