import Ionicons from "@expo/vector-icons/Ionicons";
import type { LineId } from "@learnrt/core";
import { View } from "react-native";
import { useTheme } from "@/theme";

/** A Line's round train badge with a bar running down from it, as in a route card. */
export function LegIcon({ lineId }: { lineId: LineId }) {
  const theme = useTheme();
  const color = theme.lines[lineId];
  return (
    <View className="items-center" style={{ width: 36 }}>
      <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: color }}>
        <Ionicons name="train" size={20} color={theme.card} />
      </View>
      <View className="w-1.5 flex-1 rounded-b-full" style={{ backgroundColor: color, minHeight: 10 }} />
    </View>
  );
}
