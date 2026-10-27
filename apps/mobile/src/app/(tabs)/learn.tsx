import { comingSoonLines, learnData, lineAreas, lines, stationsOnLine } from "@learnrt/core";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import { LineCard } from "@/components/LineCard";
import { Section } from "@/components/Section";
import { UnverifiedBadge } from "@/components/UnverifiedBadge";
import { LINE_COLORS } from "@/map/lineColors";
import colors from "@/theme/colors";

const TIPS = ["tips.buy", "tips.security", "tips.gates", "tips.direction", "tips.platform", "tips.transfer"] as const;

export default function LearnScreen() {
  const { t } = useTranslation();
  const unverified = learnData.lastVerified === null;

  return (
    <ScrollView className="flex-1 bg-base" contentContainerClassName="gap-4 p-4">
      <Text className="text-xl font-bold text-white" accessibilityRole="header">
        {t("learn.lines")}
      </Text>
      {lines
        .filter((l) => l.status === "operational")
        .map((line) => (
          <LineCard
            key={line.id}
            title={line.name}
            color={LINE_COLORS[line.id]}
            stations={stationsOnLine(line.id).map((s) => ({
              key: s.id,
              name: s.name,
              onPress: () => router.push({ pathname: "/station/[id]", params: { id: s.id } }),
            }))}
          >
            <View className="flex-row flex-wrap items-center gap-2">
              <Text className="text-muted">{t("learn.areas", { areas: lineAreas(line.id).join(", ") })}</Text>
              {unverified && <UnverifiedBadge />}
            </View>
          </LineCard>
        ))}

      <Text className="text-xl font-bold text-white" accessibilityRole="header">
        {t("learn.comingSoon")}
      </Text>
      <Text className="text-muted">{t("learn.comingSoonIntro")}</Text>
      {comingSoonLines.map((line) => (
        <LineCard
          key={line.name}
          title={line.name}
          color={line.name === "MRT-7" ? LINE_COLORS.MRT7 : colors.muted}
          stations={line.stationNames.map((name, i) => ({ key: `${i}-${name}`, name }))}
        />
      ))}

      <Section title={t("learn.tipsTitle")}>
        {TIPS.map((key) => (
          <Text key={key} className="text-white">
            • {t(key)}
          </Text>
        ))}
      </Section>

      <Pressable
        onPress={() => router.push("/about")}
        accessibilityRole="link"
        className="items-center rounded-xl border border-border p-4"
      >
        <Text className="text-accent">{t("learn.about")}</Text>
      </Pressable>
    </ScrollView>
  );
}
