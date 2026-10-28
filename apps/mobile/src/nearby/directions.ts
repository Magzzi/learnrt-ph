import type { LatLng } from "@learnrt/core";

/**
 * A Google Maps link with walking directions to a Station. Only the Station's position is in it;
 * Google Maps starts from wherever the phone is, so the rider's position never leaves the phone.
 */
export function googleMapsWalkingUrl(destination: LatLng): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&travelmode=walking`;
}

/** The [west, south, east, north] box around points given as [lng, lat]. */
export function boundsAround(points: readonly (readonly [number, number])[]): [number, number, number, number] {
  const lngs = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
}
