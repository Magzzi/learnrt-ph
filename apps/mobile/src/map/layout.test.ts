import { getStation, lines, stations, stationsOnLine, transfers } from "@learnrt/core";
import { describe, expect, it } from "vitest";
import { layoutNetwork, projectPoint, stationAt } from "./layout";

const WIDTH = 1000;
const PADDING = 40;

describe("layoutNetwork", () => {
  const layout = layoutNetwork({ width: WIDTH, padding: PADDING });
  const at = (id: string) => layout.stations.find((s) => s.id === id)!;

  it("places every Station exactly once", () => {
    expect(layout.stations.map((s) => s.id).sort()).toEqual(stations.map((s) => s.id).sort());
  });

  it("keeps every Station inside the padded drawing", () => {
    for (const s of layout.stations) {
      expect(s.x, s.id).toBeGreaterThanOrEqual(PADDING);
      expect(s.x, s.id).toBeLessThanOrEqual(WIDTH - PADDING);
      expect(s.y, s.id).toBeGreaterThanOrEqual(PADDING);
      expect(s.y, s.id).toBeLessThanOrEqual(layout.height - PADDING);
    }
  });

  it("puts north up and east right", () => {
    expect(at("lrt1-fernando-poe-jr").y).toBeLessThan(at("lrt1-dr-santos").y);
    expect(at("mrt7-san-jose-del-monte").y).toBeLessThan(at("mrt3-taft-ave").y);
    expect(at("lrt2-antipolo").x).toBeGreaterThan(at("lrt2-recto").x);
  });

  it("never draws two Station dots on top of each other", () => {
    for (const a of layout.stations)
      for (const b of layout.stations)
        if (a.id < b.id) expect(Math.hypot(a.x - b.x, a.y - b.y), `${a.id} ${b.id}`).toBeGreaterThan(2 * layout.stationRadius);
  });

  it("draws each Line through its Stations in Line order, MRT-7 dashed", () => {
    expect(layout.lines.map((l) => [l.lineId, l.dashed])).toEqual(lines.map((l) => [l.id, l.status !== "operational"]));
    for (const line of layout.lines) {
      expect(line.points).toEqual(stationsOnLine(line.lineId).map((s) => ({ x: at(s.id).x, y: at(s.id).y })));
    }
  });

  it("joins each Transfer's two Stations", () => {
    expect(layout.transfers).toEqual(
      transfers.map((t) => ({ from: { x: at(t.from).x, y: at(t.from).y }, to: { x: at(t.to).x, y: at(t.to).y } })),
    );
  });
});

describe("stationAt", () => {
  const layout = layoutNetwork({ width: WIDTH, padding: PADDING });
  const at = (id: string) => layout.stations.find((s) => s.id === id)!;

  it("picks the Station under the finger", () => {
    expect(stationAt(layout, at("lrt1-edsa"), 20)).toBe("lrt1-edsa");
  });

  it("picks the nearer of two close Stations", () => {
    const edsa = at("lrt1-edsa");
    const taft = at("mrt3-taft-ave");
    const nearTaft = { x: edsa.x + (taft.x - edsa.x) * 0.8, y: edsa.y + (taft.y - edsa.y) * 0.8 };
    expect(stationAt(layout, nearTaft, 20)).toBe("mrt3-taft-ave");
  });

  it("picks nothing when no Station is within reach", () => {
    expect(stationAt(layout, { x: 0, y: 0 }, 20)).toBeUndefined();
  });
});

describe("projectPoint", () => {
  it("puts a Station's own position exactly on its dot", () => {
    const layout = layoutNetwork({ width: 1000, padding: 60 });
    const edsa = layout.stations.find((s) => s.id === "lrt1-edsa")!;
    const p = projectPoint(layout, getStation("lrt1-edsa")!.location);
    expect(p.x).toBeCloseTo(edsa.x, 6);
    expect(p.y).toBeCloseTo(edsa.y, 6);
  });
});
