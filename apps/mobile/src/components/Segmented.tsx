import { Pressable, Text, View } from "react-native";

/** A row of mutually exclusive options. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-2" accessibilityRole="radiogroup">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            className={`rounded-full border px-4 py-2 ${selected ? "border-accent bg-sunken" : "border-edge"}`}
          >
            <Text className={selected ? "font-semibold text-accentInk" : "text-muted"}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
