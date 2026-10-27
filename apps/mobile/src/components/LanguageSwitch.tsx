import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { setLanguage } from "@/i18n";
import { LANGUAGES, type Language } from "@/i18n/language";

// Language names are shown in their own language, so they are not translated.
const NAMES: Record<Language, string> = { en: "English", fil: "Filipino" };

export function LanguageSwitch() {
  const { i18n } = useTranslation();
  return (
    <View className="flex-row gap-2" accessibilityRole="radiogroup">
      {LANGUAGES.map((language) => {
        const selected = i18n.language === language;
        return (
          <Pressable
            key={language}
            onPress={() => void setLanguage(language)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            className={`rounded-full border px-4 py-2 ${selected ? "border-accent bg-raised" : "border-border"}`}
          >
            <Text className={selected ? "font-semibold text-accent" : "text-muted"}>{NAMES[language]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
