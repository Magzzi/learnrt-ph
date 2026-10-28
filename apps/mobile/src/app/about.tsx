import { Stack } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, ScrollView, Text } from "react-native";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Section } from "@/components/Section";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { PLUS_JAKARTA_LICENSE } from "@/legal/plusJakartaLicense";

const OSM_COPYRIGHT = "https://www.openstreetmap.org/copyright";

export default function AboutScreen() {
  const { t } = useTranslation();
  const [license, setLicense] = useState(false);
  return (
    <ScrollView className="flex-1 bg-page" contentContainerClassName="gap-3 p-4">
      <Stack.Screen options={{ title: t("about.title") }} />
      <Section title={t("about.appearance")}>
        <ThemeSwitch />
      </Section>
      <Section title={t("about.language")}>
        <LanguageSwitch />
      </Section>
      <Section title={t("about.unofficialTitle")}>
        <Text className="text-ink">{t("about.unofficial")}</Text>
      </Section>
      <Section title={t("about.dataTitle")}>
        <Text className="text-ink">{t("about.osm")}</Text>
        <Pressable onPress={() => void Linking.openURL(OSM_COPYRIGHT).catch(() => {})} accessibilityRole="link">
          <Text className="text-accentInk underline">{t("about.osmLink")}</Text>
        </Pressable>
      </Section>
      <Section title={t("about.unverifiedTitle")} unverified>
        <Text className="text-ink">{t("about.unverified")}</Text>
      </Section>
      {/* SIL OFL 1.1: the bundled font ships with its copyright notice and licence. */}
      <Section title={t("about.fontTitle")}>
        <Text className="text-ink">{t("about.fontCredit")}</Text>
        <Pressable onPress={() => setLicense(!license)} accessibilityRole="button" accessibilityState={{ expanded: license }}>
          <Text className="text-accentInk">{t(license ? "about.hideLicense" : "about.showLicense")}</Text>
        </Pressable>
        {license && <Text className="text-xs text-muted">{PLUS_JAKARTA_LICENSE}</Text>}
      </Section>
    </ScrollView>
  );
}
