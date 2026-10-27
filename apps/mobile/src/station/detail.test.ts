import { describe, expect, it } from "vitest";
import { stationDetail } from "./detail";

describe("stationDetail", () => {
  it("describes Doroteo Jose: Line, neighbours, Transfer and landmarks", () => {
    const d = stationDetail("lrt1-doroteo-jose")!;
    expect(d.title).toBe("Doroteo Jose · LRT-1");
    expect(d.line).toEqual({ id: "LRT1", name: "LRT-1", status: "operational" });
    expect(d.neighbours.map((n) => n.name)).toEqual(["Carriedo", "Bambang"]);
    expect(d.transfers).toEqual([
      { stationId: "lrt2-recto", stationName: "Recto", lineName: "LRT-2", walkMinutes: null, directions: null },
    ]);
    expect(d.landmarks[0]).toBe("Isetann / Cinerama Recto");
  });

  it("names the Line in the title, so same-named Stations stay distinct", () => {
    expect(stationDetail("lrt2-santolan")!.title).toBe("Santolan · LRT-2");
    expect(stationDetail("mrt3-santolan")!.title).toBe("Santolan-Annapolis · MRT-3");
  });

  it("reports which parts are unverified", () => {
    expect(stationDetail("lrt1-doroteo-jose")!.unverified).toEqual({ station: true, transfers: true, landmarks: true });
  });

  it("has no Transfers or landmarks where there are none", () => {
    const d = stationDetail("mrt7-tala")!;
    expect(d.transfers).toEqual([]);
    expect(d.landmarks).toEqual([]);
    expect(d.line.status).toBe("coming-soon");
  });

  it("returns undefined for an unknown Station", () => {
    expect(stationDetail("lrt1-nowhere")).toBeUndefined();
  });
});
