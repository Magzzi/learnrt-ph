import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { useThemeName } from "@/theme";

// An original flat illustration for the Map tab's welcome card (UI1): a sun, a city skyline, hills and
// an elevated train on a viaduct. Drawn for LearnRT; decorative, so it is hidden from screen readers.
const PALETTES = {
  light: { sun: "#F6A98A", far: "#C9DCE6", near: "#9FBFCF", hill: "#A9CDA0", hillDark: "#7FB07A", deck: "#56707D", pier: "#6D8794", train: "#FFFFFF", trainLine: "#2E3A40", stripe: "#E4572E", window: "#5D7884" },
  dark: { sun: "#B8492A", far: "#2E3B44", near: "#3C4D57", hill: "#2F4630", hillDark: "#263A27", deck: "#5B6E77", pier: "#4B5C64", train: "#E8E2DC", trainLine: "#1C1917", stripe: "#E4572E", window: "#41545E" },
};

export function WelcomeArt({ width, height }: { width: number; height: number }) {
  const c = PALETTES[useThemeName()];
  const buildings = [
    [70, 46, 10, 50], [82, 30, 12, 66], [96, 52, 9, 44], [108, 22, 14, 74], [124, 40, 10, 56], [136, 14, 13, 82], [151, 36, 11, 60], [164, 26, 12, 70], [178, 44, 10, 52],
  ];
  return (
    <Svg width={width} height={height} viewBox="0 0 200 120" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Circle cx={150} cy={34} r={18} fill={c.sun} />
      {buildings.map(([x, y, w, h], i) => (
        <Rect key={i} x={x} y={y} width={w} height={h} fill={i % 2 ? c.far : c.near} />
      ))}
      <Path d="M0 96 C30 78 60 82 90 92 S150 84 200 90 L200 120 L0 120 Z" fill={c.hill} />
      <Path d="M0 104 C40 92 70 100 110 106 S170 100 200 104 L200 120 L0 120 Z" fill={c.hillDark} />
      {/* Viaduct: a deck on piers, rising to the right. */}
      {[60, 92, 124, 156, 188].map((x, i) => (
        <Rect key={x} x={x} y={92 - i * 6} width={6} height={30 + i * 6} fill={c.pier} />
      ))}
      <Path d="M40 96 L200 66 L200 72 L40 102 Z" fill={c.deck} />
      {/* Train: three cars along the deck. */}
      <G transform="rotate(-10.6 120 80)">
        {[0, 1, 2].map((car) => (
          <G key={car} transform={`translate(${70 + car * 42} 70)`}>
            <Rect x={0} y={0} width={40} height={16} rx={5} fill={c.train} stroke={c.trainLine} strokeWidth={0.8} />
            <Rect x={0} y={11} width={40} height={2.5} fill={c.stripe} />
            {[4, 13, 22, 31].map((wx) => (
              <Rect key={wx} x={wx} y={3.5} width={6} height={5} rx={1} fill={c.window} />
            ))}
          </G>
        ))}
      </G>
    </Svg>
  );
}
