// Test-only: reads the landmark lists from the website's landmark page, which core's landmarks were moved from.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { matrixStationId } from "./fareMatrixFiles";

const PAGE = fileURLToPath(new URL("../../../../apps/web/src/app/landmark/page.tsx", import.meta.url));

export interface WebsiteLineLandmarks {
  name: string;
  stations: Record<string, string[]>;
}

/** The page's `landmarkData` array, evaluated as the plain object literal it is. */
export function readWebsiteLandmarks(): WebsiteLineLandmarks[] {
  const source = readFileSync(PAGE, "utf8");
  const literal = source.match(/const landmarkData = (\[[\s\S]*?\n\]);/)?.[1];
  if (!literal) throw new Error("landmarkData not found in the landmark page");
  return new Function(`return ${literal}`)() as WebsiteLineLandmarks[];
}

const LINE_IDS: Record<string, string> = { "LRT-1": "LRT1", "LRT-2": "LRT2", "MRT-3": "MRT3" };

/** The Station id the website means, or undefined (including for Lines core does not cover, such as PNR). */
export function websiteLandmarkStationId(
  lineName: string,
  stationName: string,
  stations: readonly { id: string; name: string; lineId: string }[],
): string | undefined {
  const lineId = LINE_IDS[lineName];
  if (!lineId) return undefined;
  // The website writes some names with a non-breaking hyphen (U+2011), and LRT-1's last Station by its old name.
  const name = stationName.replaceAll("‑", "-");
  if (lineId === "LRT1" && name === "Roosevelt") return "lrt1-fernando-poe-jr";
  return matrixStationId(lineId, name, stations);
}
