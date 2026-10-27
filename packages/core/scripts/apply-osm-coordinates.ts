// Copies each Station's position from data-sources/osm-stations.json into src/data/stations.ts,
// using the Station's osmId. Stations with osmId null keep their coordinates.
// Run from packages/core: pnpm apply-osm-coordinates
import { readFileSync, writeFileSync } from "node:fs";

const EXTRACT = new URL("../data-sources/osm-stations.json", import.meta.url);
const STATIONS = new URL("../src/data/stations.ts", import.meta.url);

const { elements } = JSON.parse(readFileSync(EXTRACT, "utf8")) as {
  elements: { osmId: string; lat: number; lng: number }[];
};
const byOsmId = new Map(elements.map((e) => [e.osmId, e]));

let updated = 0;
const source = readFileSync(STATIONS, "utf8").replace(
  /osmId: "([^"]+)", location: \{ lat: [\d.]+, lng: [\d.]+ \}/g,
  (_, osmId: string) => {
    const element = byOsmId.get(osmId);
    if (!element) throw new Error(`OSM element ${osmId} is not in the extract`);
    updated++;
    return `osmId: "${osmId}", location: { lat: ${element.lat}, lng: ${element.lng} }`;
  },
);
writeFileSync(STATIONS, source);
console.log(`Updated ${updated} Station positions from OSM`);
