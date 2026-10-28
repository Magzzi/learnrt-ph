import Ionicons from "@expo/vector-icons/Ionicons";
import { getLine } from "@learnrt/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";
import { useTheme } from "@/theme";
import { searchStations } from "./search";

/** "Find a station": a button that opens a search over every Station, by name. */
export function StationSearch({ onSelect }: { onSelect: (stationId: string) => void }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = searchStations(query);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="search"
        className="flex-row items-center gap-2 rounded-2xl border border-edge bg-page px-3 py-2"
      >
        <Ionicons name="search" size={18} color={theme.ink} />
        <Text className="text-base text-ink">{t("map.findStation")}</Text>
      </Pressable>
      <Modal visible={open} animationType="slide" onRequestClose={close}>
        <View className="flex-1 bg-page pt-12">
          <View className="flex-row items-center gap-2 px-4 pb-3">
            <View className="flex-1 flex-row items-center gap-2 rounded-2xl border border-edge bg-card px-3">
              <Ionicons name="search" size={18} color={theme.muted} />
              <TextInput
                autoFocus
                value={query}
                onChangeText={setQuery}
                placeholder={t("map.searchPlaceholder")}
                placeholderTextColor={theme.muted}
                accessibilityLabel={t("map.findStation")}
                className="flex-1 py-3 text-base text-ink"
              />
            </View>
            <Pressable onPress={close} accessibilityRole="button" className="p-2">
              <Text className="text-base text-accentInk">{t("fares.close")}</Text>
            </Pressable>
          </View>
          {query.trim() !== "" && results.length === 0 ? (
            <Text className="px-4 text-muted" accessibilityLiveRegion="polite">
              {t("map.noMatch", { query: query.trim() })}
            </Text>
          ) : (
            <FlatList
              data={results}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(s) => s.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    close();
                    onSelect(item.id);
                  }}
                  accessibilityRole="button"
                  className="flex-row items-center gap-3 border-b border-edge px-4 py-4"
                >
                  <View className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.lines[item.lineId] }} />
                  <Text className="flex-1 text-base text-ink">{item.name}</Text>
                  <Text className="text-sm text-muted">{getLine(item.lineId)!.name}</Text>
                </Pressable>
              )}
            />
          )}
        </View>
      </Modal>
    </>
  );
}
