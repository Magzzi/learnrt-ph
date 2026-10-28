import { getLine, getStation, type RideStep } from "@learnrt/core";
import { formatPesos } from "../fares/faresState";

/** An i18n key and its parameters; `note` is a second line for details that are not known yet. */
export interface StepText {
  key: `ride.${string}`;
  params: Record<string, string | number>;
  note?: `ride.${string}`;
}

const station = (id: string) => getStation(id)!.name;
const lineOf = (stationId: string) => getLine(getStation(stationId)!.lineId)!.name;

/** How the app words a Guided Ride step. Unknown details never get made-up text (data-todo D10, D15). */
export function stepText(step: RideStep): StepText {
  switch (step.kind) {
    case "enter":
      return { key: "ride.enter", params: { station: station(step.stationId) }, note: "ride.entranceUnknown" };
    case "pay":
      return {
        key: step.ticket === "single-journey" ? "ride.paySingle" : "ride.payStored",
        params: { line: getLine(step.lineId)!.name, fare: step.fare === null ? "–" : formatPesos(step.fare) },
      };
    case "board":
      return {
        key: "ride.board",
        params: { line: getLine(step.lineId)!.name, towards: station(step.towards) },
        note: "ride.platformUnknown",
      };
    case "ride":
      return { key: "ride.ride", params: { count: step.stops, station: station(step.stationIds.at(-1)!) } };
    case "transfer":
      return {
        key: step.byTrain ? "ride.transferByTrain" : "ride.transferOnFoot",
        params: { from: station(step.from), to: station(step.to), line: lineOf(step.to) },
        ...(step.walk.directions === null ? { note: "ride.walkUnknown" as const } : {}),
      };
    case "arrive":
      return { key: step.byTrain ? "ride.arriveByTrain" : "ride.arriveOnFoot", params: { station: station(step.stationId) } };
  }
}
