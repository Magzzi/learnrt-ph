/** A distance for riders: metres to the nearest 10 under 1 km, otherwise km to one decimal. */
export function formatDistance(km: number): string {
  const metres = Math.round((km * 1000) / 10) * 10;
  return metres < 1000 ? `${metres} m` : `${km.toFixed(1)} km`;
}
