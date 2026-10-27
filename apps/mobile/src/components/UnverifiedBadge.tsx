import { Text, View } from "react-native";

/** Shown next to any data whose `lastVerified` is null. */
export function UnverifiedBadge() {
  return (
    <View
      className="self-start rounded-full border border-warning px-2 py-0.5"
      accessibilityLabel="Unverified data"
    >
      <Text className="text-xs font-medium text-warning">Unverified</Text>
    </View>
  );
}
