import { advanceStep, fareData, rideStations, rideStatus, rideSteps, transferData, type RideState, type RideStatus } from "@learnrt/core";
import { stepText, type StepText } from "./stepText";

export interface RideView {
  status: RideStatus;
  current: StepText;
  /** The current step can be ticked off without moving (enter, pay, board). */
  canAdvance: boolean;
  /** Where the rider gets off the current train. */
  getOffAt: string;
  /** Stations still to pass on the current train, ending where the rider gets off. */
  ahead: string[];
  upcoming: StepText[];
  /** The current step shows a Fare or a Transfer that is not verified yet. */
  unverified: boolean;
}

/** What the Guided Ride screen shows for a ride in progress. */
export function rideView(state: RideState): RideView {
  const steps = rideSteps(state.route, state.ticket, state.discounted);
  const step = steps[state.stepIndex]!;
  const status = rideStatus(state);
  const stations = rideStations(state.route);
  const here = stations.indexOf(status.stationId);

  const current = stepText(step);
  if (step.kind === "ride" && status.stopsLeftOnLeg > 0) current.params = { ...current.params, count: status.stopsLeftOnLeg };

  return {
    status,
    current,
    canAdvance: advanceStep(state) !== state,
    getOffAt: stations[here + status.stopsLeftOnLeg]!,
    ahead: stations.slice(here + 1, here + 1 + status.stopsLeftOnLeg),
    upcoming: steps.slice(state.stepIndex + 1).map(stepText),
    unverified:
      (step.kind === "pay" && fareData.lastVerified === null) || (step.kind === "transfer" && transferData.lastVerified === null),
  };
}
