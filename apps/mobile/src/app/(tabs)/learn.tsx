import { uncoveredLines, learnData, lineAreas, lines, stationsOnLine } from "@learnrt/core";
import { router } from "expo-router";
import { openStation } from "@/navigation";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text } from "react-native";
import { LineCard } from "@/components/LineCard";
import { Section } from "@/components/Section";
import { useTheme } from "@/theme";

const TIPS = ["tips.buy", "tips.security", "tips.gates", "tips.platform"] as const;

export default function LearnScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const unverified = learnData.lastVerified === null;

  return (
    <ScrollView className="flex-1 bg-page" contentContainerClassName="gap-4 p-4">
      <Text className="text-xl font-bold text-ink" accessibilityRole="header">
        {t("learn.lines")}
      </Text>
      {lines
        .filter((l) => l.status === "operational")
        .map((line) => (
          <LineCard
            key={line.id}
            title={line.name}
            color={theme.lines[line.id]}
            unverified={unverified}
            stations={stationsOnLine(line.id).map((s) => ({
              key: s.id,
              name: s.name,
              onPress: () => openStation(s.id),
            }))}
          >
            <Text className="text-muted">{t("learn.areas", { areas: lineAreas(line.id).join(", ") })}</Text>
          </LineCard>
        ))}

      <Text className="text-xl font-bold text-ink" accessibilityRole="header">
        {t("learn.notCovered")}
      </Text>
      <Text className="text-muted">{t("learn.notCoveredIntro")}</Text>
      {uncoveredLines.map((line) => (
        <LineCard
          key={line.name}
          title={line.name}
          color={line.lineId ? theme.lines[line.lineId] : theme.muted}
          unverified={unverified}
          stations={line.stationNames.map((name, i) => ({ key: `${i}-${name}`, name }))}
        />
      ))}

      <Section title={t("learn.tipsTitle")}>
        {TIPS.map((key) => (
          <Text key={key} className="text-ink">
            • {t(key)}
          </Text>
        ))}
      </Section>

      <Pressable
        onPress={() => router.push("/about")}
        accessibilityRole="link"
        className="items-center rounded-xl border border-edge p-4"
      >
        <Text className="text-accentInk">{t("learn.about")}</Text>
      </Pressable>
    </ScrollView>
  );
}
