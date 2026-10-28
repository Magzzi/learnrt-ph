import "../../global.css";
import "@/i18n";

import { Fraunces_700Bold, useFonts } from "@expo-google-fonts/fraunces";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { AppState, View } from "react-native";
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

  // The heading font is bundled; until it is ready the screen stays the page colour, so no other
  // font flashes up first.
  // If the font fails to load, carry on with the system serif rather than a blank screen.
  const [fontsLoaded, fontError] = useFonts({ Fraunces_700Bold });
  if (!fontsLoaded && !fontError) return <View style={{ flex: 1, backgroundColor: theme.page }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.page }}>
      {/* The theme's CSS variables sit on this view (NativeWind reads them from a plain View), so
          every class below follows light or dark. */}
      <View style={[{ flex: 1 }, themeVariables]}>
      <StatusBar style={themeName === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.page },
          headerTintColor: theme.ink,
          headerTitleStyle: { fontFamily: "Fraunces_700Bold" },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.page },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="guided-ride" options={{ gestureEnabled: false }} />
      </Stack>
      </View>
    </GestureHandlerRootView>
  );
}
