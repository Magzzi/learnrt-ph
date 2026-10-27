// Downloads rail Station positions from OpenStreetMap (© OpenStreetMap contributors, ODbL)
// into data-sources/osm-stations.json. Run from packages/core: pnpm fetch-osm-stations
// Then run `pnpm apply-osm-coordinates` to update src/data/stations.ts.
import { writeFileSync } from "node:fs";

const OUT = new URL("../data-sources/osm-stations.json", import.meta.url);
const BBOX = "14.40,120.90,14.80,121.20";
const QUERY = `[out:json][timeout:90];
(nwr["railway"="station"]["station"~"light_rail|subway|monorail"](${BBOX});
 nwr["public_transport"="station"]["light_rail"="yes"](${BBOX});
 nwr["railway"="station"]["network"~"LRT|MRT|Light Rail|Metro Rail",i](${BBOX}););
out center tags;`;

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

const res = await fetch("https://overpass-api.de/api/interpreter", {
  method: "POST",
  headers: { "User-Agent": "LearnRT data script (github.com/Magzzi/learnrt-ph)" },
  body: new URLSearchParams({ data: QUERY }),
});
if (!res.ok) throw new Error(`Overpass: HTTP ${res.status}`);
const json = (await res.json()) as { osm3s: { timestamp_osm_base: string }; elements: OverpassElement[] };

const elements = json.elements
  .map((e) => ({
    osmId: `${e.type}/${e.id}`,
    name: e.tags?.name ?? null,
    network: e.tags?.network ?? null,
    station: e.tags?.station ?? null,
    lat: e.lat ?? e.center!.lat,
    lng: e.lon ?? e.center!.lon,
  }))
  .sort((a, b) => a.osmId.localeCompare(b.osmId));

writeFileSync(
  OUT,
  JSON.stringify(
    {
      attribution: "© OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright)",
      osmBase: json.osm3s.timestamp_osm_base,
      query: QUERY,
      elements,
    },
    null,
    2,
  ) + "\n",
);
console.log(`Wrote ${elements.length} OSM elements (data as of ${json.osm3s.timestamp_osm_base})`);
