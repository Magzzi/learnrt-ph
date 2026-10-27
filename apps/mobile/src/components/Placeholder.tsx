import { Text, View } from "react-native";
import { lines, stations } from "@learnrt/core";
import { UnverifiedBadge } from "./UnverifiedBadge";

/** Temporary screen body until each tab's ticket lands; proves core data reaches the app. */
export function Placeholder({ title }: { title: string }) {
  return (
    <View className="flex-1 gap-3 bg-base p-4">
      <Text className="text-2xl font-bold text-white">{title}</Text>
      <Text className="text-muted">
        {lines.length} Lines · {stations.length} Stations
      </Text>
      <UnverifiedBadge />
    </View>
  );
}
