// Test-only: reads the Line list from the website's explore page, which core's Line info was moved from.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PAGE = fileURLToPath(new URL("../../../../apps/web/src/app/explore/page.tsx", import.meta.url));

export interface WebsiteLine {
  name: string;
  status: string;
  areas: string[];
  stations: string[];
}

/** The page's `railwayData` array. Its open/closed calls are stubbed out: core does not use them. */
export function readWebsiteLines(): WebsiteLine[] {
  const source = readFileSync(PAGE, "utf8");
  const literal = source.match(/const railwayData = (\[[\s\S]*?\n\]);/)?.[1];
  if (!literal) throw new Error("railwayData not found in the explore page");
  return new Function("getOpenStatus", `return ${literal}`)(() => "") as WebsiteLine[];
}
