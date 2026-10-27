import { getLine, getStation } from "@learnrt/core";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, type LayoutChangeEvent } from "react-native";
import {
  GestureDetector,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
  useTapGesture,
} from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import Svg, { Circle, G, Line as SvgLine, Polyline, Text as SvgText } from "react-native-svg";
import colors from "@/theme/colors";
import { layoutNetwork, stationAt } from "./layout";
import { LINE_COLORS } from "./lineColors";

const LAYOUT = layoutNetwork({ width: 1000, padding: 60 });
const MIN_SCALE = 1;
const MAX_SCALE = 8;
/** How far from a Station a tap may land and still select it, in screen points. */
const TAP_REACH = 22;
const LABEL_SIZE = 16;
/** Top of the operational network, so the map opens on the Lines riders can use today. */
const OPERATIONAL_TOP = Math.min(
  ...LAYOUT.stations.filter((s) => getLine(s.lineId)?.status === "operational").map((s) => s.y),
);
// Labels that would otherwise sit on top of a neighbour's label at the default zoom.
const LABELS_LEFT = new Set(["lrt2-recto"]);

const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(max, Math.max(min, value));
};

/** The Line map: every Line drawn from core data, with pinch-zoom, pan and tap-to-open. */
export function LineMap({ onSelectStation }: { onSelectStation: (stationId: string) => void }) {
  const { t } = useTranslation();
  const [width, setWidth] = useState(0);
  const pointsPerUnit = width / LAYOUT.width;

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const start = useSharedValue({ scale: 1, x: 0, y: 0 });

  useEffect(() => {
    if (width > 0) translateY.value = -(OPERATIONAL_TOP - 40) * pointsPerUnit;
  }, [width, pointsPerUnit, translateY]);

  // Both gestures continue from wherever the map was when they began.
  const rememberStart = () => {
    "worklet";
    start.value = { scale: scale.value, x: translateX.value, y: translateY.value };
  };

  const pinch = usePinchGesture({
    onBegin: rememberStart,
    onUpdate: (e) => {
      "worklet";
      const next = clamp(start.value.scale * e.scale, MIN_SCALE, MAX_SCALE);
      const ratio = next / start.value.scale;
      // Keep the point between the fingers still while zooming.
      translateX.value = e.focalX - (e.focalX - start.value.x) * ratio;
      translateY.value = e.focalY - (e.focalY - start.value.y) * ratio;
      scale.value = next;
    },
  });

  const pan = usePanGesture({
    minDistance: 8,
    onBegin: rememberStart,
    onUpdate: (e) => {
      "worklet";
      translateX.value = start.value.x + e.translationX;
      translateY.value = start.value.y + e.translationY;
    },
  });

  const tap = useTapGesture({
    runOnJS: true,
    onActivate: (e) => {
      // Screen point → map content point → layout units.
      const contentX = (e.x - translateX.value) / scale.value;
      const contentY = (e.y - translateY.value) / scale.value;
      const id = stationAt(
        LAYOUT,
        { x: contentX / pointsPerUnit, y: contentY / pointsPerUnit },
        TAP_REACH / scale.value / pointsPerUnit,
      );
      if (id) onSelectStation(id);
    },
  });

  const gestures = useSimultaneousGestures(pinch, pan, tap);

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  const labels = useMemo(
    () =>
      LAYOUT.stations.map((s) => {
        const station = getStation(s.id)!;
        // LRT-2 runs east-west, so its labels sit above the line at an angle to avoid overlapping.
        const left = LABELS_LEFT.has(s.id);
        const angled = s.lineId === "LRT2" && !left;
        return { ...s, name: station.name, angled, left, operational: getLine(s.lineId)?.status === "operational" };
      }),
    [],
  );

  return (
    <View
      className="flex-1 overflow-hidden bg-base"
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <GestureDetector gesture={gestures}>
          <View className="flex-1">
            <Animated.View
              style={[
                { width, height: LAYOUT.height * pointsPerUnit, transformOrigin: "0 0" },
                contentStyle,
              ]}
            >
              <Svg width="100%" height="100%" viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`}>
                {LAYOUT.transfers.map((tr, i) => (
                  <SvgLine
                    key={i}
                    x1={tr.from.x}
                    y1={tr.from.y}
                    x2={tr.to.x}
                    y2={tr.to.y}
                    stroke={colors.text}
                    strokeWidth={10}
                    strokeLinecap="round"
                  />
                ))}
                {LAYOUT.lines.map((line) => (
                  <Polyline
                    key={line.lineId}
                    points={line.points.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke={LINE_COLORS[line.lineId]}
                    strokeWidth={6}
                    strokeDasharray={line.dashed ? "14 10" : undefined}
                    strokeLinejoin="round"
                  />
                ))}
                {labels.map((s) => (
                  <G key={s.id}>
                    <Circle
                      cx={s.x}
                      cy={s.y}
                      r={LAYOUT.stationRadius}
                      fill={colors.base}
                      stroke={LINE_COLORS[s.lineId]}
                      strokeWidth={2.5}
                    />
                    <SvgText
                      x={s.left ? s.x - 10 : s.angled ? s.x + 4 : s.x + 10}
                      textAnchor={s.left ? "end" : "start"}
                      y={s.angled ? s.y - 10 : s.y + LABEL_SIZE / 3}
                      fontSize={LABEL_SIZE}
                      fill={s.operational ? colors.label : colors.muted}
                      transform={s.angled ? `rotate(-40 ${s.x + 4} ${s.y - 10})` : undefined}
                    >
                      {s.name}
                    </SvgText>
                  </G>
                ))}
              </Svg>
              {/* Screen-reader targets: one per Station, labelled "<Station>, <Line>". */}
              {labels.map((s) => (
                <View
                  key={s.id}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={t("map.stationA11y", {
                    station: s.name,
                    line: getLine(s.lineId)?.name,
                  })}
                  onAccessibilityTap={() => onSelectStation(s.id)}
                  style={{
                    position: "absolute",
                    left: s.x * pointsPerUnit - 6,
                    top: s.y * pointsPerUnit - 6,
                    width: 12,
                    height: 12,
                  }}
                />
              ))}
            </Animated.View>
          </View>
        </GestureDetector>
      )}
    </View>
  );
}
