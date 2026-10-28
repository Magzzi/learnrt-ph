import { getLine, getStation, rideStations, rideStatus, type RideAlert, type RideState } from "@learnrt/core";

export interface NotificationWords {
  key: `alerts.${string}`;
  params: Record<string, string | number>;
}

const name = (id: string) => getStation(id)!.name;

/** The words of a Guided Ride notification. */
export function alertText(alert: RideAlert, state: RideState): { title: NotificationWords; body: NotificationWords } {
  if (alert.kind === "next-station") {
    return { title: { key: "alerts.nextTitle", params: {} }, body: { key: "alerts.nextBody", params: { station: name(alert.stationId) } } };
  }
  const stations = rideStations(state.route);
  const next = stations[stations.indexOf(alert.stationId) + 1];
  const title: NotificationWords = { key: "alerts.getOffTitle", params: { station: name(alert.stationId) } };
  if (!next) return { title, body: { key: "alerts.arriveBody", params: {} } };
  const to = getStation(next)!;
  return { title, body: { key: "alerts.transferBody", params: { station: to.name, line: getLine(to.lineId)!.name } } };
}

/** The ongoing notification's words: stops left to the destination. Null once the ride is complete. */
export function ongoingText(state: RideState): NotificationWords | null {
  const status = rideStatus(state);
  if (status.completed) return null;
  const destination = rideStations(state.route).at(-1)!;
  return { key: "alerts.ongoing", params: { count: status.stopsLeft, station: name(destination) } };
}
