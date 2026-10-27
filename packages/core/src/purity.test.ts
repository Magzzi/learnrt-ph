import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Core runs unchanged in the mobile app and offline, so production code must not
// depend on a platform or the network. Tests and test-support may use Node.
const SRC = fileURLToPath(new URL("./", import.meta.url));
const FORBIDDEN = /from "(node:[^"]+|fs|path|react[^"]*|next[^"]*|xlsx)"|\bfetch\(/;

const productionFiles = (readdirSync(SRC, { recursive: true }) as string[]).filter(
  (f) => f.endsWith(".ts") && !f.endsWith(".test.ts") && !f.startsWith("test-support"),
);

describe("packages/core production code", () => {
  it("exists", () => {
    expect(productionFiles.length).toBeGreaterThan(0);
  });

  it.each(productionFiles)("%s uses no platform or network APIs", (file) => {
    expect(readFileSync(SRC + file, "utf8")).not.toMatch(FORBIDDEN);
  });
});
