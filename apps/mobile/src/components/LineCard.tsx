import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { UnverifiedBadge } from "./UnverifiedBadge";

/** A Line's card on Learn: a header, optional details, and a Station list that expands on demand. */
export function LineCard({
  title,
  color,
  children,
  stations,
  unverified,
}: {
  title: string;
  unverified?: boolean;
  color: string;
  children?: ReactNode;
  stations: readonly { key: string; name: string; onPress?: () => void }[];
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <View className="gap-2 rounded-xl border border-raised bg-panel p-4">
      <View className="flex-row items-center gap-2">
        <View className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <Text className="flex-1 text-lg font-semibold text-white" accessibilityRole="header">
          {title}
        </Text>
        {unverified && <UnverifiedBadge />}
      </View>
      {children}
      {stations.length === 0 ? (
        <Text className="text-muted">{t("learn.noStationList")}</Text>
      ) : (
        <>
          <Pressable onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityState={{ expanded: open }}>
            <Text className="text-accent">
              {open ? t("learn.hideStations") : t("learn.showStations", { count: stations.length })}
            </Text>
          </Pressable>
          {open &&
            stations.map((s) =>
              s.onPress ? (
                <Pressable key={s.key} onPress={s.onPress} accessibilityRole="link">
                  <Text className="text-white underline">{s.name}</Text>
                </Pressable>
              ) : (
                <Text key={s.key} className="text-white">
                  {s.name}
                </Text>
              ),
            )}
        </>
      )}
    </View>
  );
}
