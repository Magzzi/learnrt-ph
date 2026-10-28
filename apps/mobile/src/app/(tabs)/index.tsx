import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, Text, View } from "react-native";
import { LineMap, type LineMapHandle } from "@/map/LineMap";
import { MapLegend } from "@/map/MapLegend";
import { StationSearch } from "@/map/StationSearch";
import { WelcomeArt } from "@/map/WelcomeArt";
import { openStation } from "@/navigation";
import { currentPosition } from "@/nearest/currentPosition";
import { useTheme } from "@/theme";

export default function MapScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const map = useRef<LineMapHandle>(null);

  const locate = async () => {
    const show = async () => {
      const coords = await currentPosition();
      if (coords) map.current?.showPosition({ lat: coords.latitude, lng: coords.longitude });
      else Alert.alert(t("map.showMe"), t("map.locationUnavailable"));
    };
    if ((await Location.getForegroundPermissionsAsync()).granted) return show();
    // Explain first, as the Nearest tab does, then ask.
    Alert.alert(t("map.showMe"), t("map.showMeExplain"), [
      { text: t("map.showMeCancel"), style: "cancel" },
      {
        text: t("map.showMeAllow"),
        onPress: async () => {
          if ((await Location.requestForegroundPermissionsAsync()).granted) await show();
          else Alert.alert(t("map.showMe"), t("map.locationOff"));
        },
      },
    ]);
  };

  const control = (icon: "add" | "remove" | "locate", label: string, onPress: () => void) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="h-12 w-12 items-center justify-center rounded-full border border-edge bg-card"
    >
      <Ionicons name={icon} size={24} color={theme.ink} />
    </Pressable>
  );

  return (
    <View className="flex-1 gap-3 bg-page px-4 pb-3">
      <View className="flex-row overflow-hidden rounded-2xl bg-accentSoft">
        <View className="flex-1 gap-1 p-4">
          <Text className="text-xs font-bold uppercase tracking-widest text-accentInk">{t("map.eyebrow")}</Text>
          <Text className="font-serif text-2xl text-ink">{t("map.welcomeTitle")}</Text>
          <Text className="text-sm text-muted">{t("map.welcomeBody")}</Text>
        </View>
        <View className="justify-end">
          <WelcomeArt width={150} height={90} />
        </View>
      </View>

      <View className="flex-1 overflow-hidden rounded-2xl border border-edge bg-card">
        <View className="flex-row items-center gap-3 p-3">
          <View className="flex-1">
            <Text className="font-serif text-xl text-ink" accessibilityRole="header">
              {t("map.cardTitle")}
            </Text>
            <Text className="text-sm text-muted">{t("map.cardSubtitle")}</Text>
          </View>
          <StationSearch onSelect={openStation} />
        </View>
        <View className="flex-1">
          <LineMap ref={map} onSelectStation={openStation} />
          <View className="absolute right-3 top-3 gap-2">
            {control("locate", t("map.showMe"), () => void locate())}
            {control("add", t("map.zoomIn"), () => map.current?.zoomIn())}
            {control("remove", t("map.zoomOut"), () => map.current?.zoomOut())}
          </View>
          <MapLegend />
        </View>
      </View>

      <View className="flex-row items-center gap-3 rounded-2xl border border-edge bg-card px-4 py-3">
        <Ionicons name="location" size={22} color={theme.accent} />
        <Text className="flex-1 text-sm text-ink">{t("map.tip")}</Text>
      </View>
    </View>
  );
}
