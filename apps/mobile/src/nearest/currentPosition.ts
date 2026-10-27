import * as Location from "expo-location";

/** The phone's position, or null. Falls back to the last known fix, e.g. underground. */
export async function currentPosition() {
  try {
    // High accuracy uses GPS, which keeps working in airplane mode; Balanced relies on the network on Android.
    // No Google "Location Accuracy" prompt: the screen promises the location is not sent anywhere.
    const fix = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      mayShowUserSettingsDialog: false,
    });
    return fix.coords;
  } catch {
    return (await Location.getLastKnownPositionAsync().catch(() => null))?.coords ?? null;
  }
}
