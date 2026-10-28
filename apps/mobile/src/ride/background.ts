import { arrivedAt, geofenceRegions, rideStatus, type RideState } from "@learnrt/core";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";
import { i18n } from "@/i18n";
import { loadRide, onRideAlerts, updateRide } from "./activeRide";
import { alertText, ongoingText } from "./alertText";

const GEOFENCE_TASK = "learnrt-guided-ride-geofence";
const ALERTS_CHANNEL = "guided-ride-alerts";
const PROGRESS_CHANNEL = "guided-ride-progress";
const ONGOING_ID = "guided-ride-ongoing";

// Alerts pop up even with the app open; the ongoing notification updates quietly.
Notifications.setNotificationHandler({
  handleNotification: async (n) => {
    const ongoing = n.request.identifier === ONGOING_ID;
    return { shouldPlaySound: !ongoing, shouldSetBadge: false, shouldShowBanner: !ongoing, shouldShowList: true };
  },
});

TaskManager.defineTask<{ eventType: Location.GeofencingEventType; region: Location.LocationRegion }>(
  GEOFENCE_TASK,
  async ({ data, error }) => {
    if (error || data.eventType !== Location.GeofencingEventType.Enter || !data.region.identifier) return;
    const stationId = data.region.identifier;
    // Running in the background, the saved ride is the only state there is.
    await loadRide();
    await updateRide((state) => arrivedAt(state, stationId));
  },
);

async function ensureChannels() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(ALERTS_CHANNEL, {
    name: i18n.t("alerts.alertsChannel"),
    importance: Notifications.AndroidImportance.HIGH,
  });
  await Notifications.setNotificationChannelAsync(PROGRESS_CHANNEL, {
    name: i18n.t("alerts.progressChannel"),
    importance: Notifications.AndroidImportance.LOW,
  });
}

/**
 * On Android, geofences go through Google Play services, which silently refuses them while Location
 * Accuracy (the network location provider) is off; expo-location does not report that refusal.
 */
export async function geofencingAvailable(): Promise<boolean> {
  if (Platform.OS !== "android") return true;
  return (await Location.getProviderStatusAsync().catch(() => null))?.networkAvailable ?? false;
}

/** Asks Android to turn Location Accuracy on; the rider confirms in a system dialog. */
export async function turnOnLocationAccuracy(state: RideState | null): Promise<boolean> {
  await Location.enableNetworkProviderAsync().catch(() => {});
  if (state) await sync(state);
  return geofencingAvailable();
}

/** Location all the time, and notifications: what alerts need with the phone locked. */
export async function alertsEnabled(): Promise<boolean> {
  const [fg, bg, notif] = await Promise.all([
    Location.getForegroundPermissionsAsync(),
    Location.getBackgroundPermissionsAsync(),
    Notifications.getPermissionsAsync(),
  ]);
  return fg.granted && bg.granted && notif.granted;
}

/** Asks for the permissions, after the ride screen has explained why. */
export async function enableAlerts(state: RideState | null): Promise<boolean> {
  await ensureChannels(); // Android shows the notification prompt only once a channel exists.
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.granted) await Location.requestBackgroundPermissionsAsync();
  await Notifications.requestPermissionsAsync();
  if (state) await sync(state);
  return alertsEnabled();
}

async function syncGeofences(state: RideState) {
  const running = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK).catch(() => false);
  const regions = geofenceRegions(state);
  if (state.ended || rideStatus(state).completed || regions.length === 0) {
    if (running) await Location.stopGeofencingAsync(GEOFENCE_TASK);
    return;
  }
  if (!(await Location.getBackgroundPermissionsAsync()).granted) return;
  await Location.startGeofencingAsync(
    GEOFENCE_TASK,
    regions.map((r) => ({
      identifier: r.stationId,
      latitude: r.latitude,
      longitude: r.longitude,
      radius: r.radius,
      notifyOnEnter: true,
      notifyOnExit: false,
    })),
  );
}

async function syncOngoing(state: RideState) {
  const text = state.ended ? null : ongoingText(state);
  if (!text || Platform.OS !== "android") {
    await Notifications.dismissNotificationAsync(ONGOING_ID).catch(() => {});
    return;
  }
  await Notifications.scheduleNotificationAsync({
    identifier: ONGOING_ID,
    content: { title: i18n.t("alerts.ongoingTitle"), body: i18n.t(text.key as never, text.params), sticky: true, autoDismiss: false },
    trigger: { channelId: PROGRESS_CHANNEL },
  });
}

async function sync(state: RideState) {
  await syncGeofences(state).catch(() => {});
  if ((await Notifications.getPermissionsAsync()).granted) await syncOngoing(state).catch(() => {});
  else if (state.ended) await Notifications.dismissNotificationAsync(ONGOING_ID).catch(() => {});
}

onRideAlerts(async (alerts, state) => {
  if ((await Notifications.getPermissionsAsync()).granted) {
    await ensureChannels();
    for (const alert of alerts) {
      const { title, body } = alertText(alert, state);
      await Notifications.scheduleNotificationAsync({
        content: { title: i18n.t(title.key as never, title.params), body: i18n.t(body.key as never, body.params) },
        trigger: { channelId: ALERTS_CHANNEL },
      });
    }
  }
  await sync(state);
});
