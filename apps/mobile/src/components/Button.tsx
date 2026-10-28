import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

/** The one main action on a screen: orange, with large bold text (WCAG AA either way). */
export function PrimaryButton({ label, onPress, icon }: { label: string; onPress: () => void; icon?: IconName }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-row items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-4 active:opacity-80"
    >
      {icon && <Ionicons name={icon} size={20} color={theme.onAccent} />}
      <Text className="font-display text-lg text-onAccent">{label}</Text>
    </Pressable>
  );
}

/** A secondary action: outlined, orange text. */
export function SecondaryButton({ label, onPress, icon }: { label: string; onPress: () => void; icon?: IconName }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-edge bg-card px-4 py-3 active:opacity-80"
    >
      {icon && <Ionicons name={icon} size={18} color={theme.accentInk} />}
      <Text className="text-base font-semibold text-accentInk">{label}</Text>
    </Pressable>
  );
}
