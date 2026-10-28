import Ionicons from "@expo/vector-icons/Ionicons";
import { rideStatus } from "@learnrt/core";
import { router, Tabs, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import { loadRide } from "@/ride/activeRide";
import { useTheme } from "@/theme";

type IconProps = ComponentProps<typeof Ionicons>;

const icon = (name: IconProps["name"]) =>
  function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    // Tab tints are plain colour strings; anything else falls back to the icon's default.
    return <Ionicons name={name} color={typeof color === "string" ? color : undefined} size={size} />;
  };

export default function TabsLayout() {
  const { t } = useTranslation();
  const theme = useTheme();

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
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.edge },
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
          tabBarIcon: icon("map-outline"),
          header: () => <ScreenHeader title={t("headers.mapTitle")} subtitle={t("headers.mapSubtitle")} />,
        }}
      />
      <Tabs.Screen
        name="fares"
        options={{
          title: t("tabs.fares"),
          tabBarAccessibilityLabel: t("tabs.fares"),
          tabBarIcon: icon("cash-outline"),
          header: () => <ScreenHeader title={t("headers.faresTitle")} subtitle={t("headers.faresSubtitle")} />,
        }}
      />
      <Tabs.Screen
        name="ride"
        options={{
          title: t("tabs.ride"),
          tabBarAccessibilityLabel: t("tabs.ride"),
          tabBarIcon: icon("train-outline"),
          header: () => <ScreenHeader title={t("headers.rideTitle")} subtitle={t("headers.rideSubtitle")} />,
        }}
      />
      <Tabs.Screen
        name="nearest"
        options={{
          title: t("tabs.nearest"),
          tabBarAccessibilityLabel: t("tabs.nearest"),
          tabBarIcon: icon("locate-outline"),
          header: () => <ScreenHeader title={t("headers.nearestTitle")} subtitle={t("headers.nearestSubtitle")} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t("tabs.learn"),
          tabBarAccessibilityLabel: t("tabs.learn"),
          tabBarIcon: icon("book-outline"),
          header: () => <ScreenHeader title={t("headers.learnTitle")} subtitle={t("headers.learnSubtitle")} />,
        }}
      />
    </Tabs>
  );
}
