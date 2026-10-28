import { stations, type Station } from "@learnrt/core";

// "Doña" and "dona", "EDSA" and "edsa" are the same to a rider typing.
const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Stations whose name contains the query, names that start with it first, then in Line order. */
export function searchStations(query: string): Station[] {
  const q = fold(query);
  if (!q) return [];
  const matches = stations.filter((s) => fold(s.name).includes(q));
  return [...matches.filter((s) => fold(s.name).startsWith(q)), ...matches.filter((s) => !fold(s.name).startsWith(q))];
}
