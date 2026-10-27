import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, type Strings } from "./en";
import { fil } from "./fil";
import { LANGUAGES, pickLanguage, type Language } from "./language";
import { filipinoResource } from "./translations";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: { translation: Strings };
  }
}

const STORAGE_KEY = "learnrt.language";

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fil: { translation: filipinoResource(fil) } },
  lng: pickLanguage(getLocales().map((l) => l.languageTag)),
  fallbackLng: "en",
  interpolation: { escapeValue: false }, // React already escapes
});

// A language the rider picked by hand wins over the device language.
AsyncStorage.getItem(STORAGE_KEY)
  .then((saved) => {
    if (saved && (LANGUAGES as readonly string[]).includes(saved)) void i18n.changeLanguage(saved);
  })
  .catch(() => {});

export async function setLanguage(language: Language) {
  await i18n.changeLanguage(language);
  await AsyncStorage.setItem(STORAGE_KEY, language).catch(() => {});
}

export { i18n };
