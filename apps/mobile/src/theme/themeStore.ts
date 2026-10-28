import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { useSyncExternalStore } from "react";
import { parseThemePreference, type ThemePreference } from "./preference";

const STORAGE_KEY = "learnrt.theme";

let current: ThemePreference = "system";
const listeners = new Set<() => void>();

// `Appearance.setColorScheme(null)` hands control back to the phone.
function apply(preference: ThemePreference) {
  current = preference;
  Appearance.setColorScheme(preference === "system" ? "unspecified" : preference);
  listeners.forEach((l) => l());
}

/** Applies the saved choice; call once when the app starts. */
export async function loadThemePreference() {
  apply(parseThemePreference(await AsyncStorage.getItem(STORAGE_KEY).catch(() => null)));
}

export async function setThemePreference(preference: ThemePreference) {
  apply(preference);
  await AsyncStorage.setItem(STORAGE_KEY, preference).catch(() => {});
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
  );
}
