import Ionicons from "@expo/vector-icons/Ionicons";
import { rideStatus } from "@learnrt/core";
import { router, Tabs, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { ComponentProps } from "react";
import { Text, View, useWindowDimensions, type ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";
import { loadRide } from "@/ride/activeRide";
import { useTheme } from "@/theme";

type IconProps = ComponentProps<typeof Ionicons>;

const icon = (name: IconProps["name"]) =>
  function TabIcon({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) {
    // Tab tints are plain colour strings; anything else falls back to the icon's default.
    const tint = typeof color === "string" ? color : undefined;
    return (
      <View className="items-center">
        {/* The active tab gets a short bar along the top edge of the tab bar, as in the design. */}
        <View className="absolute -top-2.5 h-1 w-9 rounded-full" style={{ backgroundColor: focused ? tint : "transparent" }} />
        <Ionicons name={name} color={tint} size={size + 2} />
      </View>
    );
  };

// The bar grows with the phone's text size, but its labels scale only up to this, so five tabs
// still fit at 360 dp in English and Filipino.
const LABEL_SCALE = 1.3;

const tabLabel = (title: string) =>
  function TabLabel({ color }: { color: ColorValue }) {
    return (
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        maxFontSizeMultiplier={LABEL_SCALE}
        style={{ fontSize: 13, fontWeight: "500", color: typeof color === "string" ? color : undefined }}
      >
        {title}
      </Text>
    );
  };

export default function TabsLayout() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { fontScale } = useWindowDimensions();
  const bottomInset = useSafeAreaInsets().bottom;

  // A ride in progress comes back on launch, once the root navigator is ready to navigate.
  const navigationReady = Boolean(useRootNavigationState()?.key);
  useEffect(() => {
    if (!navigationReady) return;
    void loadRide().then((ride) => ride && !rideStatus(ride).completed && router.push("/guided-ride"));
  }, [navigationReady]);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.page },
        headerTintColor: theme.ink,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.edge,
          paddingTop: 6,
          height: bottomInset + 34 + 22 * Math.min(fontScale, LABEL_SCALE),
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        sceneStyle: { backgroundColor: theme.page },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.map"),
          tabBarAccessibilityLabel: t("tabs.map"),
          tabBarLabel: tabLabel(t("tabs.map")),
          tabBarIcon: icon("map-outline"),
          header: () => <ScreenHeader title={t("headers.mapTitle")} subtitle={t("headers.mapSubtitle")} />,
        }}
      />
      <Tabs.Screen
        name="fares"
        options={{
          title: t("tabs.fares"),
          tabBarAccessibilityLabel: t("tabs.fares"),
          tabBarLabel: tabLabel(t("tabs.fares")),
          tabBarIcon: icon("cash-outline"),
          header: () => <ScreenHeader title={t("headers.faresTitle")} subtitle={t("headers.faresSubtitle")} />,
        }}
      />
      <Tabs.Screen
        name="ride"
        options={{
          title: t("tabs.ride"),
          tabBarAccessibilityLabel: t("tabs.ride"),
          tabBarLabel: tabLabel(t("tabs.ride")),
          tabBarIcon: icon("train-outline"),
          header: () => <ScreenHeader title={t("headers.rideTitle")} subtitle={t("headers.rideSubtitle")} />,
        }}
      />
      <Tabs.Screen
        name="nearest"
        options={{
          title: t("tabs.nearest"),
          tabBarAccessibilityLabel: t("tabs.nearest"),
          tabBarLabel: tabLabel(t("tabs.nearest")),
          tabBarIcon: icon("location-outline"),
          header: () => <ScreenHeader title={t("headers.nearestTitle")} subtitle={t("headers.nearestSubtitle")} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t("tabs.learn"),
          tabBarAccessibilityLabel: t("tabs.learn"),
          tabBarLabel: tabLabel(t("tabs.learn")),
          tabBarIcon: icon("book-outline"),
          header: () => <ScreenHeader title={t("headers.learnTitle")} subtitle={t("headers.learnSubtitle")} />,
        }}
      />
    </Tabs>
  );
}
