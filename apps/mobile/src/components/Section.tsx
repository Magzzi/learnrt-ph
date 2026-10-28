import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { UnverifiedBadge } from "./UnverifiedBadge";

/** A titled panel on a detail screen, with an Unverified badge when its data is unverified. */
export function Section({ title, unverified, children }: { title: string; unverified?: boolean; children: ReactNode }) {
  return (
    <View className="gap-2 rounded-xl border border-edge bg-card p-4">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-base font-semibold text-ink" accessibilityRole="header">
          {title}
        </Text>
        {unverified && <UnverifiedBadge />}
      </View>
      {children}
    </View>
  );
}
