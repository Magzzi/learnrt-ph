import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";
import colors from "@/theme/colors";

type IconProps = ComponentProps<typeof Ionicons>;

const icon =
  (name: IconProps["name"]) =>
  ({ color, size }: { color: ColorValue; size: number }) => (
    // Tab tints are plain colour strings; anything else falls back to the icon's default.
    <Ionicons name={name} color={typeof color === "string" ? color : undefined} size={size} />
  );

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.panel },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.panel, borderTopColor: colors.raised },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        sceneStyle: { backgroundColor: colors.base },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("tabs.map"), tabBarAccessibilityLabel: t("tabs.map"), tabBarIcon: icon("map-outline") }} />
      <Tabs.Screen name="fares" options={{ title: t("tabs.fares"), tabBarAccessibilityLabel: t("tabs.fares"), tabBarIcon: icon("cash-outline") }} />
      <Tabs.Screen name="nearest" options={{ title: t("tabs.nearest"), tabBarAccessibilityLabel: t("tabs.nearest"), tabBarIcon: icon("locate-outline") }} />
      <Tabs.Screen name="learn" options={{ title: t("tabs.learn"), tabBarAccessibilityLabel: t("tabs.learn"), tabBarIcon: icon("book-outline") }} />
    </Tabs>
  );
}
