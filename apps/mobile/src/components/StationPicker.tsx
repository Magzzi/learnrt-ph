import { getStation, stationsOnLine, type LineId } from "@learnrt/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

/** A field that opens a list of a Line's Stations, in Line order. */
export function StationPicker({
  label,
  lineId,
  value,
  onChange,
}: {
  label: string;
  lineId: LineId;
  value: string | null;
  onChange: (stationId: string) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const name = value ? getStation(value)?.name : undefined;

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
            data={stationsOnLine(lineId)}
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
                <Text className={item.id === value ? "font-semibold text-accent" : "text-white"}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
