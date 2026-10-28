import Ionicons from "@expo/vector-icons/Ionicons";
import { Camera, Map, Marker, UserLocation } from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UnverifiedBadge } from "@/components/UnverifiedBadge";
import { STREET_MAP_ATTRIBUTION, STREET_MAP_STYLE_URL } from "@/config";
import { streetMap } from "@/station/streetMap";
import { useTheme } from "@/theme";

export default function StreetMapScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const map = streetMap(id);
  const insets = useSafeAreaInsets();
  const [failed, setFailed] = useState(false);
  // The rider's dot only when location is already allowed; this screen never asks for it.
  const [showMe, setShowMe] = useState(false);
  useEffect(() => {
    void Location.getForegroundPermissionsAsync().then((p) => setShowMe(p.granted));
  }, []);

  // MapLibre keeps a cached style and then fails silently on missing tiles, so check the tile server
  // directly and say so when it can't be reached.
  useEffect(() => {
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 5000);
    fetch(STREET_MAP_STYLE_URL, { method: "HEAD", signal: abort.signal })
      .then((res) => !res.ok && setFailed(true))
      .catch(() => setFailed(true))
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      abort.abort();
    };
  }, []);

  if (!map) {
    return (
      <View className="flex-1 bg-page p-4">
        <Stack.Screen options={{ title: t("station.notFound") }} />
        <Text className="text-lg text-ink">{t("station.notFound")}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-page">
      <Stack.Screen options={{ title: t("streetMap.title", { station: map.station.name }) }} />
      {failed ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-center text-ink">{t("streetMap.offline")}</Text>
        </View>
      ) : (
        <Map
          style={{ flex: 1 }}
          mapStyle={STREET_MAP_STYLE_URL}
          logo={false}
          onDidFailLoadingMap={() => setFailed(true)}
        >
          <Camera initialViewState={{ center: map.center, zoom: 16.5 }} />
          {showMe && <UserLocation />}
          <Marker id={map.station.id} lngLat={map.center}>
            <View className="items-center rounded-full border-2 border-card bg-accent px-3 py-1">
              <Text className="font-semibold text-onAccent">{map.station.name}</Text>
            </View>
          </Marker>
          {map.entrances.map((e) => (
            <Marker key={e.osmId} id={e.osmId} lngLat={e.lngLat}>
              <View
                className="h-7 min-w-7 items-center justify-center rounded-full bg-accent px-1"
                accessibilityLabel={e.label ? t("streetMap.entranceA11y", { label: e.label }) : t("streetMap.entrance")}
              >
                {e.label ? (
                  <Text className="text-xs font-bold text-onAccent">{e.label}</Text>
                ) : (
                  <Ionicons name="enter-outline" size={16} color={theme.onAccent} />
                )}
              </View>
            </Marker>
          ))}
        </Map>
      )}
      <View className="gap-1 border-t border-edge bg-card p-3" style={{ paddingBottom: 12 + insets.bottom }}>
        <View className="flex-row items-center justify-between gap-2">
          <Text className="flex-1 text-sm text-ink">
            {map.entrances.length > 0 ? t("streetMap.entrances", { count: map.entrances.length }) : t("streetMap.noEntrances")}
          </Text>
          {map.entrances.length > 0 && map.unverified && <UnverifiedBadge />}
        </View>
        <Text className="text-xs text-muted">{STREET_MAP_ATTRIBUTION}</Text>
      </View>
    </View>
  );
}
