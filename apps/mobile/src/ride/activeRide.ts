import AsyncStorage from "@react-native-async-storage/async-storage";
import { startRide, type RideAlert, type RideState, type RideUpdate, type Route, type TicketType } from "@learnrt/core";
import { router } from "expo-router";
import { useSyncExternalStore } from "react";

// The ride in progress lives on the device, so it survives the app being closed. The background
// geofence task (M2-08) reads and writes the same key while the app is not on screen.
const STORAGE_KEY = "learnrt.activeRide";

let current: RideState | null = null;
const listeners = new Set<() => void>();
const alertHandlers = new Set<(alerts: RideAlert[], state: RideState) => void>();

async function save(state: RideState | null) {
  current = state;
  listeners.forEach((l) => l());
  if (state) await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  else await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
}

/** Reads the saved ride, e.g. at launch or when the app comes back to the foreground. */
export async function loadRide(): Promise<RideState | null> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY).catch(() => null);
  let state: RideState | null = null;
  try {
    state = saved ? (JSON.parse(saved) as RideState) : null;
  } catch {
    state = null; // A corrupt save is dropped rather than crashing the app.
  }
  current = state && !state.ended ? state : null;
  listeners.forEach((l) => l());
  // Re-registers geofences and the ongoing notification, which the system may have dropped.
  if (current) alertHandlers.forEach((h) => h([], current!));
  return current;
}

export function useActiveRide(): RideState | null {
  return useSyncExternalStore(
    (listener) => (listeners.add(listener), () => listeners.delete(listener)),
    () => current,
  );
}

/** Lets the notification layer hear about alerts that become due. */
export function onRideAlerts(handler: (alerts: RideAlert[], state: RideState) => void) {
  alertHandlers.add(handler);
  return () => alertHandlers.delete(handler);
}

export async function beginRide(route: Route, ticket: TicketType, discounted: boolean) {
  const state = startRide(route, ticket, discounted);
  await save(state);
  alertHandlers.forEach((h) => h([], state));
  router.push("/guided-ride");
}

/** Applies a change to the ride in progress: a step done, "I'm at ___", or a geofence arrival. */
export async function updateRide(change: (state: RideState) => RideUpdate | RideState) {
  if (!current) return;
  const result = change(current);
  const update = "state" in result ? result : { state: result, alerts: [] };
  await save(update.state);
  alertHandlers.forEach((h) => h(update.alerts, update.state));
}

export async function finishRide() {
  const last = current;
  await save(null);
  if (last) alertHandlers.forEach((h) => h([], { ...last, ended: true }));
}
