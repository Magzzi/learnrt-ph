import { getLine, getStation } from "@learnrt/core";

/** The Station's id if a rider can ride from or to it (its Line is operational), else null. */
export function rideable(id: string | undefined): string | null {
  const station = id ? getStation(id) : undefined;
  return station && getLine(station.lineId)?.status === "operational" ? station.id : null;
}
