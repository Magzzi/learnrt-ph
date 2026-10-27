import { LANDMARKS } from "./data/landmarks";

export const landmarkData = {
  source: "LearnRT website landmark page",
  lastVerified: null as string | null,
};

/** Landmarks near a Station, as listed on the website. Empty when there are none. */
export function landmarksAt(stationId: string): readonly string[] {
  return LANDMARKS[stationId] ?? [];
}
