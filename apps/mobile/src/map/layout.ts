import { lines, stations, stationsOnLine, transfers, type LineId } from "@learnrt/core";

export interface Point {
  x: number;
  y: number;
}

export interface NetworkLayout {
  width: number;
  height: number;
  /** Radius of a Station dot, in layout units. */
  stationRadius: number;
  stations: ({ id: string; lineId: LineId } & Point)[];
  lines: { lineId: LineId; points: Point[]; dashed: boolean }[];
  transfers: { from: Point; to: Point }[];
}

/**
 * Positions every Station for the Line map: an equirectangular projection of the Stations'
 * real positions, north up, scaled to `width`. Height follows from the network's shape.
 */
export function layoutNetwork({ width, padding }: { width: number; padding: number }): NetworkLayout {
  const lats = stations.map((s) => s.location.lat);
  const lngs = stations.map((s) => s.location.lng);
  const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];
  const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)];
  // A degree of longitude is shorter than a degree of latitude away from the equator.
  const lngScale = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const unitsPerDegree = (width - 2 * padding) / ((maxLng - minLng) * lngScale);

  const placed = stations.map((s) => ({
    id: s.id,
    lineId: s.lineId,
    x: padding + (s.location.lng - minLng) * lngScale * unitsPerDegree,
    y: padding + (maxLat - s.location.lat) * unitsPerDegree,
  }));
  const point = (id: string): Point => {
    const { x, y } = placed.find((s) => s.id === id)!;
    return { x, y };
  };

  return {
    width,
    height: 2 * padding + (maxLat - minLat) * unitsPerDegree,
    stationRadius: width / 250,
    stations: placed,
    lines: lines.map((l) => ({
      lineId: l.id,
      points: stationsOnLine(l.id).map((s) => point(s.id)),
      dashed: l.status !== "operational",
    })),
    transfers: transfers.map((t) => ({ from: point(t.from), to: point(t.to) })),
  };
}

/** The id of the Station nearest to `point`, if one is within `reach` layout units. */
export function stationAt(layout: NetworkLayout, point: Point, reach: number): string | undefined {
  let best: { id: string; distance: number } | undefined;
  for (const s of layout.stations) {
    const distance = Math.hypot(s.x - point.x, s.y - point.y);
    if (distance <= reach && (!best || distance < best.distance)) best = { id: s.id, distance };
  }
  return best?.id;
}
