import { describe, expect, it } from "vitest";
import { neighbours, transfers, transfersFrom } from "./graph";
import { getLine, stations } from "./network";

const ids = (list: { id: string }[]) => list.map((s) => s.id);

/** Every Station reachable from `start` by riding a Line or walking a Transfer. */
function reachableFrom(start: string): Set<string> {
  const seen = new Set([start]);
  const queue = [start];
  while (queue.length > 0) {
    const id = queue.shift()!;
    const next = [...ids(neighbours(id)), ...transfersFrom(id).map((t) => t.to)];
    for (const n of next) if (!seen.has(n)) (seen.add(n), queue.push(n));
  }
  return seen;
}

describe("neighbours", () => {
  it("gives an end Station one neighbour", () => {
    expect(ids(neighbours("lrt1-dr-santos"))).toEqual(["lrt1-ninoy-aquino-avenue"]);
    expect(ids(neighbours("lrt1-fernando-poe-jr"))).toEqual(["lrt1-balintawak"]);
    expect(ids(neighbours("mrt3-taft-ave"))).toEqual(["mrt3-magallanes"]);
  });

  it("gives a middle Station the Stations either side of it on its Line", () => {
    expect(ids(neighbours("lrt1-baclaran"))).toEqual(["lrt1-redemptorist-aseana", "lrt1-edsa"]);
    expect(ids(neighbours("lrt2-cubao"))).toEqual(["lrt2-betty-go-belmonte", "lrt2-anonas"]);
  });

  it("returns nothing for an unknown Station", () => {
    expect(neighbours("lrt1-nowhere")).toEqual([]);
  });
});

describe("Transfers", () => {
  it("links Doroteo Jose–Recto, EDSA–Taft Ave and the two Cubao Stations", () => {
    expect(transfers.map((t) => [t.from, t.to])).toEqual([
      ["lrt1-doroteo-jose", "lrt2-recto"],
      ["lrt1-edsa", "mrt3-taft-ave"],
      ["lrt2-cubao", "mrt3-cubao"],
    ]);
  });

  it("works in both directions", () => {
    expect(transfersFrom("lrt1-doroteo-jose").map((t) => t.to)).toEqual(["lrt2-recto"]);
    expect(transfersFrom("lrt2-recto").map((t) => t.to)).toEqual(["lrt1-doroteo-jose"]);
    expect(transfersFrom("mrt3-taft-ave").map((t) => t.to)).toEqual(["lrt1-edsa"]);
    expect(transfersFrom("mrt3-cubao").map((t) => t.to)).toEqual(["lrt2-cubao"]);
  });

  it("has no walking details yet (data-todo D10)", () => {
    for (const t of transfers) expect(t.walk).toEqual({ minutes: null, metres: null, directions: null });
  });

  it("returns nothing for a Station without a Transfer", () => {
    expect(transfersFrom("lrt1-monumento")).toEqual([]);
  });
});

describe("Station graph", () => {
  const operational = stations.filter((s) => getLine(s.lineId)?.status === "operational");

  it("connects every operational Station to every other", () => {
    expect(reachableFrom("lrt1-dr-santos")).toEqual(new Set(ids(operational)));
  });

  it("does not connect coming-soon Lines to the network", () => {
    expect([...reachableFrom("lrt1-dr-santos")].some((id) => id.startsWith("mrt7-"))).toBe(false);
  });
});
