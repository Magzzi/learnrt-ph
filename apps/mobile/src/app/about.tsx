import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, ScrollView, Text } from "react-native";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Section } from "@/components/Section";

const OSM_COPYRIGHT = "https://www.openstreetmap.org/copyright";

export default function AboutScreen() {
  const { t } = useTranslation();
  return (
    <ScrollView className="flex-1 bg-page" contentContainerClassName="gap-3 p-4">
      <Stack.Screen options={{ title: t("about.title") }} />
      <Section title={t("about.unofficialTitle")}>
        <Text className="text-ink">{t("about.unofficial")}</Text>
      </Section>
      <Section title={t("about.dataTitle")}>
        <Text className="text-ink">{t("about.osm")}</Text>
        <Pressable onPress={() => void Linking.openURL(OSM_COPYRIGHT).catch(() => {})} accessibilityRole="link">
          <Text className="text-accentInk underline">{t("about.osmLink")}</Text>
        </Pressable>
      </Section>
      <Section title={t("about.unverifiedTitle")}>
        <Text className="text-ink">{t("about.unverified")}</Text>
      </Section>
      <Section title={t("about.language")}>
        <LanguageSwitch />
      </Section>
    </ScrollView>
  );
}
