import { Text, View } from "react-native";
import { lines, stations } from "@learnrt/core";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { UnverifiedBadge } from "./UnverifiedBadge";

/** Temporary screen body until each tab's ticket lands; proves core data reaches the app. */
export function Placeholder({ title, children }: { title: string; children?: ReactNode }) {
  const { t } = useTranslation();
  return (
    <View className="flex-1 gap-3 bg-base p-4">
      <Text className="text-2xl font-bold text-white">{title}</Text>
      <Text className="text-muted">{t("placeholder.counts", { lines: lines.length, stations: stations.length })}</Text>
      <UnverifiedBadge />
      {children}
    </View>
  );
}
