import "../../global.css";
import "@/i18n";

import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { loadRide } from "@/ride/activeRide";
import colors from "@/theme/colors";

export default function RootLayout() {
  // A ride in progress comes back on launch. Coming back from the background re-reads it, since the
  // geofence task may have moved it on meanwhile.
  useEffect(() => {
    loadRide().then((ride) => ride && router.push("/guided-ride"));
    const sub = AppState.addEventListener("change", (s) => s === "active" && void loadRide());
    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.panel },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.base },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="guided-ride" options={{ gestureEnabled: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
