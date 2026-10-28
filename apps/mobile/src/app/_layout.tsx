import "../../global.css";
import "@/i18n";

import { Stack } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { loadRide } from "@/ride/activeRide";
import { useTheme, useThemeName, useThemeVariables } from "@/theme";

export default function RootLayout() {
  const theme = useTheme();
  const themeName = useThemeName();
  const themeVariables = useThemeVariables();

  // Coming back from the background re-reads the ride, since the geofence task may have moved it on.
  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => s === "active" && void loadRide());
    return () => sub.remove();
  }, []);

  return (
    // The theme's CSS variables sit on the root view, so every class below follows light or dark.
    <GestureHandlerRootView style={[{ flex: 1, backgroundColor: theme.page }, themeVariables]}>
      <StatusBar style={themeName === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.page },
          headerTintColor: theme.ink,
          contentStyle: { backgroundColor: theme.page },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="guided-ride" options={{ gestureEnabled: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
