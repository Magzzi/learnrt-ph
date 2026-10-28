import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

const TONES = {
  warn: { box: "bg-warnSoft", text: "text-warn", color: "warn" },
  neutral: { box: "bg-sunken", text: "text-muted", color: "muted" },
} as const;

/** A small rounded label: "Unverified" (warn) or "Coming Soon" (neutral). */
export function Chip({
  label,
  tone = "neutral",
  icon,
  accessibilityLabel,
  maxFontSizeMultiplier,
}: {
  label: string;
  tone?: keyof typeof TONES;
  icon?: IconName;
  accessibilityLabel?: string;
  /** Caps how far the phone's text size enlarges the label, where space is tight. */
  maxFontSizeMultiplier?: number;
}) {
  const theme = useTheme();
  const style = TONES[tone];
  return (
    <View
      className={`flex-row items-center gap-1 self-start rounded-full px-3 py-1 ${style.box}`}
      accessibilityLabel={accessibilityLabel}
    >
      <Text className={`text-sm font-medium ${style.text}`} maxFontSizeMultiplier={maxFontSizeMultiplier}>{label}</Text>
      {icon && <Ionicons name={icon} size={16} color={theme[style.color]} />}
    </View>
  );
}
