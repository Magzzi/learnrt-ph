import { lines, networkData } from "@learnrt/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { Chip } from "@/components/Chip";
import { UnverifiedBadge } from "@/components/UnverifiedBadge";
import { useTheme } from "@/theme";

export function MapLegend() {
  const { t } = useTranslation();
  const theme = useTheme();
  // At very large text the legend would cover the map, so it folds behind a "Lines" button.
  const folds = useWindowDimensions().fontScale > 1.5;
  const [open, setOpen] = useState(false);
  if (folds && !open) {
    return (
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityState={{ expanded: false }}
        className="absolute bottom-3 right-3 rounded-full border border-edge bg-card px-4 py-2"
      >
        <Text className="font-semibold text-accentInk" maxFontSizeMultiplier={1.3}>{t("learn.lines")}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={folds ? () => setOpen(false) : undefined}
      accessibilityRole={folds ? "button" : undefined}
      accessibilityState={folds ? { expanded: true } : undefined}
      className="absolute bottom-3 right-3 gap-1.5 rounded-2xl border border-edge bg-card p-3"
    >
      {lines.map((line) => (
        <View key={line.id} className="flex-row flex-wrap items-center gap-2">
          <View
            className="h-1.5 w-8 rounded-full"
            style={{ backgroundColor: theme.lines[line.id], opacity: line.status === "operational" ? 1 : 0.6 }}
          />
          <Text className="text-sm text-ink" maxFontSizeMultiplier={1}>
            {line.name}
          </Text>
          {line.status === "coming-soon" && <Chip label={t("map.comingSoon")} maxFontSizeMultiplier={1} />}
        </View>
      ))}
      {networkData.lastVerified === null && (
        <View className="flex-row items-center gap-2">
          <UnverifiedBadge />
          <Text className="text-sm text-ink" maxFontSizeMultiplier={1}>
            {t("unverified.label")}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
