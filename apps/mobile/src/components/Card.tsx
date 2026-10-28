import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

/** A white (or dark) rounded panel with a soft border: the basic block of every screen. */
export function Card({ children, className = "", ...props }: ViewProps & { children: ReactNode; className?: string }) {
  // Classes passed in replace the default of the same kind (NativeWind does not resolve clashes itself).
  const gap = /(^|\s)gap-/.test(className) ? "" : "gap-3";
  const bg = /(^|\s)bg-/.test(className) ? "" : "bg-card";
  const border = /(^|\s)border-(?!edge)/.test(className) ? "" : "border-edge";
  return (
    <View className={`rounded-2xl border p-4 ${gap} ${bg} ${border} ${className}`} {...props}>
      {children}
    </View>
  );
}
