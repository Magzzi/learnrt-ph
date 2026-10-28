import Ionicons from "@expo/vector-icons/Ionicons";
import { Camera, GeoJSONSource, Layer, Map, Marker } from "@maplibre/maplibre-react-native";
import { getLine, getStation } from "@learnrt/core";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { STREET_MAP_ATTRIBUTION, STREET_MAP_STYLE_URL } from "@/config";
import { boundsAround, googleMapsWalkingUrl } from "@/nearby/directions";
import { formatDistance } from "@/nearest/formatDistance";
import { openStation } from "@/navigation";
import { streetMap } from "@/station/streetMap";
import { useTheme } from "@/theme";

/** From a nearby Station on the Nearest tab: the rider, the Station and its entrances on the street map. */
export default function NearbyScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { id, lat, lng, km } = useLocalSearchParams<{ id: string; lat: string; lng: string; km: string }>();
  const map = streetMap(id);
  const lineId = getStation(id)?.lineId;
  const [failed, setFailed] = useState(false);

  // As on the street map screen: MapLibre fails silently without tiles, so check the server.
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

  const rider = { lat: Number(lat), lng: Number(lng) };
  if (!map || !lineId || !Number.isFinite(rider.lat) || !Number.isFinite(rider.lng)) {
    return (
      <View className="flex-1 bg-page p-4">
        <Stack.Screen options={{ title: t("station.notFound") }} />
        <Text className="text-lg text-ink">{t("station.notFound")}</Text>
      </View>
    );
  }

  const riderPoint: [number, number] = [rider.lng, rider.lat];
  const openMaps = () =>
    void Linking.openURL(googleMapsWalkingUrl({ lat: map.center[1], lng: map.center[0] })).catch(() =>
      Alert.alert(t("nearby.openMaps"), t("nearby.openMapsFailed")),
    );

  return (
    <View className="flex-1 bg-page">
      <Stack.Screen options={{ title: t("nearby.title", { station: map.station.name }) }} />
      {failed ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-center text-ink">{t("nearby.offline")}</Text>
        </View>
      ) : (
        <Map style={{ flex: 1 }} mapStyle={STREET_MAP_STYLE_URL} logo={false} onDidFailLoadingMap={() => setFailed(true)}>
          <Camera initialViewState={{ bounds: boundsAround([riderPoint, map.center]), padding: { top: 80, bottom: 80, left: 60, right: 60 } }} />
          <GeoJSONSource
            id="straight-line"
            data={{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [riderPoint, map.center] } }}
          >
            <Layer id="straight-line-layer" type="line" paint={{ "line-color": theme.accentInk, "line-width": 3, "line-dasharray": [2, 2] }} />
          </GeoJSONSource>
          <Marker id="rider" lngLat={riderPoint}>
            <View className="items-center">
              <View className="h-5 w-5 rounded-full border-2 border-card bg-ink" />
              <Text className="mt-0.5 rounded-full bg-card px-2 text-xs font-semibold text-ink">{t("nearby.you")}</Text>
            </View>
          </Marker>
          <Marker id={map.station.id} lngLat={map.center}>
            <View className="items-center rounded-full border-2 border-card bg-accent px-3 py-1">
              <Text className="font-semibold text-onAccent">{map.station.name}</Text>
            </View>
          </Marker>
          {map.entrances.map((e) => (
            <Marker key={e.osmId} id={e.osmId} lngLat={e.lngLat}>
              <View className="h-7 min-w-7 items-center justify-center rounded-full bg-accent px-1">
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
      <View className="gap-3 border-t border-edge bg-card p-4" style={{ paddingBottom: 16 + insets.bottom }}>
        <View className="flex-row items-center gap-2">
          <View className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.lines[lineId] }} />
          <Text className="flex-1 font-display text-xl text-ink">
            {map.station.name} · {getLine(lineId)!.name}
          </Text>
        </View>
        {Number.isFinite(Number(km)) && (
          <Text className="text-sm text-muted">{t("nearby.straightLine", { distance: formatDistance(Number(km)) })}</Text>
        )}
        <PrimaryButton label={t("nearby.openMaps")} icon="navigate" onPress={openMaps} />
        <Text className="text-xs text-muted">{t("nearby.openMapsNote")}</Text>
        <View className="flex-row">
          <SecondaryButton label={t("nearby.stationDetails")} icon="information-circle-outline" onPress={() => openStation(map.station.id)} />
        </View>
        <Text className="text-xs text-muted">{STREET_MAP_ATTRIBUTION}</Text>
      </View>
    </View>
  );
}
