// Pan and zoom of the Line map as plain data: content shown at `scale`, offset by (x, y) screen points.

export interface MapView {
  scale: number;
  x: number;
  y: number;
}

/** Zooms by `factor` keeping the content under `focus` (a screen point) where it is. */
export function zoomAbout(
  view: MapView,
  factor: number,
  focus: { x: number; y: number },
  limits: { min: number; max: number },
): MapView {
  "worklet";
  const scale = Math.min(limits.max, Math.max(limits.min, view.scale * factor));
  const ratio = scale / view.scale;
  return { scale, x: focus.x - (focus.x - view.x) * ratio, y: focus.y - (focus.y - view.y) * ratio };
}

/** Moves the map so a content point (in screen points at scale 1) sits in the middle of the viewport. */
export function centerOn(view: MapView, point: { x: number; y: number }, viewport: { width: number; height: number }): MapView {
  "worklet";
  return { scale: view.scale, x: viewport.width / 2 - point.x * view.scale, y: viewport.height / 2 - point.y * view.scale };
}
