import { Pressable, Switch, Text, View } from "react-native";
import { useTheme } from "@/theme";

/** A labelled switch in a card; the whole row toggles, so the label is as easy to hit as the switch. */
export function ToggleRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      accessibilityHint={hint}
      className="flex-row items-center justify-between gap-4 rounded-2xl border border-edge bg-card p-4"
    >
      <View className="flex-1">
        <Text className="font-serif text-xl text-ink">{label}</Text>
        {hint && <Text className="text-sm text-muted">{hint}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        importantForAccessibility="no-hide-descendants"
        trackColor={{ true: theme.accent, false: theme.muted }}
        thumbColor={theme.card}
      />
    </Pressable>
  );
}
