import AsyncStorage from "@react-native-async-storage/async-storage";
import { startRide, type RideAlert, type RideState, type RideUpdate, type Route, type TicketType } from "@learnrt/core";
import { router } from "expo-router";
import { useSyncExternalStore } from "react";

// The ride in progress lives on the device, so it survives the app being closed. The background
// geofence task (M2-08) reads and writes the same key while the app is not on screen.
const STORAGE_KEY = "learnrt.activeRide";

let current: RideState | null = null;
const listeners = new Set<() => void>();
type AlertHandler = (alerts: RideAlert[], state: RideState) => void | Promise<void>;
const alertHandlers = new Set<AlertHandler>();

// Changes run one at a time: geofence events can arrive close together, and each must see the
// previous one's result. Callers (notably the background task) wait for the handlers to finish, so
// the system does not freeze the app halfway through posting a notification.
let queue: Promise<unknown> = Promise.resolve();
function serially<T>(work: () => Promise<T>): Promise<T> {
  const next = queue.then(work, work);
  queue = next.catch(() => {});
  return next;
}
const notify = (alerts: RideAlert[], state: RideState) => Promise.all([...alertHandlers].map((h) => h(alerts, state)));

async function save(state: RideState | null) {
  current = state;
  listeners.forEach((l) => l());
  if (state) await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  else await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
}

/**
 * Reads the saved ride, e.g. at launch or when the app comes back to the foreground, and re-registers
 * geofences and the ongoing notification, which the system may have dropped.
 */
export function loadRide(): Promise<RideState | null> {
  return serially(async () => {
    const state = await readSaved();
    if (state) await notify([], state);
    return state;
  });
}

async function readSaved(): Promise<RideState | null> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY).catch(() => null);
  let state: RideState | null = null;
  try {
    state = saved ? (JSON.parse(saved) as RideState) : null;
  } catch {
    state = null; // A corrupt save is dropped rather than crashing the app.
  }
  current = state && !state.ended ? state : null;
  listeners.forEach((l) => l());
  return current;
}

export function useActiveRide(): RideState | null {
  return useSyncExternalStore(
    (listener) => (listeners.add(listener), () => listeners.delete(listener)),
    () => current,
  );
}

/** Lets the notification layer hear about alerts that become due. */
export function onRideAlerts(handler: AlertHandler) {
  alertHandlers.add(handler);
  return () => alertHandlers.delete(handler);
}

export async function beginRide(route: Route, ticket: TicketType, discounted: boolean) {
  const state = startRide(route, ticket, discounted);
  await save(state);
  router.push("/guided-ride");
  await serially(() => notify([], state));
}

/**
 * Applies a change to the ride in progress: a step done, "I'm at ___", or a geofence arrival.
 * `fromSaved` reads the saved ride first, for the background task, where nothing is in memory.
 */
export function updateRide(change: (state: RideState) => RideUpdate | RideState, { fromSaved = false } = {}) {
  return serially(async () => {
    if (fromSaved) await readSaved();
    if (!current) return;
    const result = change(current);
    const update = "state" in result ? result : { state: result, alerts: [] };
    await save(update.state);
    await notify(update.alerts, update.state);
  });
}

export function finishRide() {
  return serially(async () => {
    const last = current;
    await save(null);
    if (last) await notify([], { ...last, ended: true });
  });
}
