import { describe, expect, it } from "vitest";
import { getLine, getStation, lines, networkData, stations, stationsOnLine } from "./network";
import { FARE_TABLES } from "./data/fares";

describe("network", () => {
  it("has the operational Lines and MRT-7 as coming soon", () => {
    expect(lines.map((l) => [l.id, l.status])).toEqual([
      ["LRT1", "operational"],
      ["LRT2", "operational"],
      ["MRT3", "operational"],
      ["MRT7", "coming-soon"],
    ]);
  });

  it.each([
    ["LRT1", 25],
    ["LRT2", 13],
    ["MRT3", 13],
    ["MRT7", 14],
  ] as const)("%s has %i Stations", (lineId, count) => {
    expect(stationsOnLine(lineId)).toHaveLength(count);
  });

  // The fare tables' Station order is checked against the .xlsx headers in fares.test.ts.
  it.each([
    ["LRT1", "LRT1-sjt"],
    ["LRT2", "LRT2-sjt"],
    ["MRT3", "MRT3-regular"],
  ] as const)("%s Station order matches the fare matrix header", (lineId, table) => {
    expect(stationsOnLine(lineId).map((s) => s.id)).toEqual(FARE_TABLES[table].stationIds);
  });

  it("never changes a Station id (renames touch display names only)", () => {
    expect(stations.map((s) => s.id)).toEqual(PINNED_IDS);
  });

  it("uses the approved display names (docs/station-names-proposal.md)", () => {
    expect(Object.fromEntries(Object.keys(APPROVED_NAMES).map((id) => [id, getStation(id)?.name]))).toEqual(
      APPROVED_NAMES,
    );
  });

  it("gives every Station a unique id", () => {
    const ids = stations.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every Station finite coordinates", () => {
    for (const s of stations) {
      expect(Number.isFinite(s.location.lat), s.id).toBe(true);
      expect(Number.isFinite(s.location.lng), s.id).toBe(true);
    }
  });

  it("keeps same-named Stations on different Lines apart", () => {
    expect(getStation("lrt2-santolan")?.lineId).toBe("LRT2");
    expect(getStation("mrt3-santolan")?.lineId).toBe("MRT3");
    expect(getStation("lrt2-cubao")?.lineId).toBe("LRT2");
    expect(getStation("mrt3-cubao")?.lineId).toBe("MRT3");
  });

  it("returns undefined for an unknown Station or Line", () => {
    expect(getStation("lrt1-nowhere")).toBeUndefined();
    expect(getLine("PNR" as never)).toBeUndefined();
  });

  it("marks the data as not yet verified", () => {
    expect(networkData.lastVerified).toBeNull();
  });
});

// prettier-ignore
const PINNED_IDS = ["lrt1-dr-santos","lrt1-ninoy-aquino-avenue","lrt1-pitx","lrt1-mia-road","lrt1-redemptorist-aseana","lrt1-baclaran","lrt1-edsa","lrt1-libertad","lrt1-gil-puyat","lrt1-vito-cruz","lrt1-quirino","lrt1-pedro-gil","lrt1-un-avenue","lrt1-central-terminal","lrt1-carriedo","lrt1-doroteo-jose","lrt1-bambang","lrt1-tayuman","lrt1-blumentritt","lrt1-abad-santos","lrt1-r-papa","lrt1-5th-avenue","lrt1-monumento","lrt1-balintawak","lrt1-fernando-poe-jr","lrt2-recto","lrt2-legarda","lrt2-pureza","lrt2-v-mapa","lrt2-j-ruiz","lrt2-gilmore","lrt2-betty-go-belmonte","lrt2-cubao","lrt2-anonas","lrt2-katipunan","lrt2-santolan","lrt2-marikina","lrt2-antipolo","mrt3-north-ave","mrt3-quezon-ave","mrt3-gma-kamuning","mrt3-cubao","mrt3-santolan","mrt3-ortigas","mrt3-shaw-blvd","mrt3-boni","mrt3-guadalupe","mrt3-buendia","mrt3-ayala","mrt3-magallanes","mrt3-taft-ave","mrt7-north-triangle-common-station","mrt7-quezon-memorial-circle","mrt7-university-avenue","mrt7-tandang-sora","mrt7-don-antonio","mrt7-batasan","mrt7-manggahan","mrt7-dona-carmen","mrt7-regalado-avenue","mrt7-mindanao-avenue","mrt7-quirino-highway","mrt7-sacred-heart","mrt7-tala","mrt7-san-jose-del-monte"];

// Copied from the "Proposed" column of docs/station-names-proposal.md (approved 2026-10-28).
// prettier-ignore
const APPROVED_NAMES: Record<string, string> = {"lrt1-dr-santos":"Dr. Santos","lrt1-ninoy-aquino-avenue":"Ninoy Aquino Avenue","lrt1-pitx":"PITX","lrt1-mia-road":"MIA Road","lrt1-redemptorist-aseana":"Redemptorist-Aseana","lrt1-baclaran":"Baclaran","lrt1-edsa":"EDSA","lrt1-libertad":"Libertad","lrt1-gil-puyat":"Gil Puyat","lrt1-vito-cruz":"Vito Cruz","lrt1-quirino":"Quirino","lrt1-pedro-gil":"Pedro Gil","lrt1-un-avenue":"United Nations","lrt1-central-terminal":"Central Terminal","lrt1-carriedo":"Carriedo","lrt1-doroteo-jose":"Doroteo Jose","lrt1-bambang":"Bambang","lrt1-tayuman":"Tayuman","lrt1-blumentritt":"Blumentritt","lrt1-abad-santos":"Abad Santos","lrt1-r-papa":"R. Papa","lrt1-5th-avenue":"5th Avenue","lrt1-monumento":"Yamaha Monumento","lrt1-balintawak":"Balintawak","lrt1-fernando-poe-jr":"Fernando Poe Jr.","lrt2-recto":"Recto","lrt2-legarda":"Legarda","lrt2-pureza":"Pureza","lrt2-v-mapa":"V. Mapa","lrt2-j-ruiz":"J. Ruiz","lrt2-gilmore":"Gilmore","lrt2-betty-go-belmonte":"Betty Go-Belmonte","lrt2-cubao":"Araneta Center-Cubao","lrt2-anonas":"Anonas","lrt2-katipunan":"Katipunan","lrt2-santolan":"Santolan","lrt2-marikina":"Marikina-Pasig","lrt2-antipolo":"Antipolo","mrt3-north-ave":"North Avenue","mrt3-quezon-ave":"Quezon Avenue","mrt3-gma-kamuning":"GMA Kamuning","mrt3-cubao":"Cubao","mrt3-santolan":"Santolan-Annapolis","mrt3-ortigas":"Ortigas","mrt3-shaw-blvd":"Shaw Boulevard","mrt3-boni":"Boni","mrt3-guadalupe":"Guadalupe","mrt3-buendia":"Buendia","mrt3-ayala":"Ayala","mrt3-magallanes":"Magallanes","mrt3-taft-ave":"Taft Avenue"};
