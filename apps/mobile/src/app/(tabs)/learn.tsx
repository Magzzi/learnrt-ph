import { useTranslation } from "react-i18next";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Placeholder } from "@/components/Placeholder";

export default function LearnScreen() {
  const { t } = useTranslation();
  return (
    <Placeholder title={t("tabs.learn")}>
      <LanguageSwitch />
    </Placeholder>
  );
}
