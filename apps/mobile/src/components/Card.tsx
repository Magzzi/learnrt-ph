import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

/** A white (or dark) rounded panel with a soft border: the basic block of every screen. */
export function Card({ children, className = "", ...props }: ViewProps & { children: ReactNode; className?: string }) {
  return (
    <View className={`gap-3 rounded-2xl border border-edge bg-card p-4 ${className}`} {...props}>
      {children}
    </View>
  );
}
