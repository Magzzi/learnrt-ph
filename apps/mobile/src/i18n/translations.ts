import type { Strings } from "./en";

/** Review state of a Filipino string. Launch requires every string to be "reviewed" (PRD §11). */
export type ReviewStatus = "needs review" | "reviewed";

export interface FilipinoEntry {
  text: string;
  review: ReviewStatus;
}

/** The English shape with every string replaced by a Filipino entry carrying its review status. */
export type FilipinoStrings<T = Strings> = {
  [K in keyof T]: T[K] extends string ? FilipinoEntry : FilipinoStrings<T[K]>;
};

type Tree = { [key: string]: unknown };

export function isFilipinoEntry(value: unknown): value is FilipinoEntry {
  return typeof value === "object" && value !== null && "text" in value && "review" in value;
}

/** Nested strings as dot-separated keys, e.g. { "tabs.map": "Map" }. `isLeaf` decides where to stop. */
export function flatten(tree: object): Record<string, string>;
export function flatten<T>(tree: object, isLeaf: (value: unknown) => value is T): Record<string, T>;
export function flatten(tree: object, isLeaf: (value: unknown) => boolean = (v) => typeof v === "string") {
  const out: Record<string, unknown> = {};
  const walk = (node: Tree, prefix: string) => {
    for (const [key, value] of Object.entries(node)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (isLeaf(value)) out[path] = value;
      else walk(value as Tree, path);
    }
  };
  walk(tree as Tree, "");
  return out;
}

function toText(tree: Tree): Tree {
  return Object.fromEntries(
    Object.entries(tree).map(([key, value]) => [key, isFilipinoEntry(value) ? value.text : toText(value as Tree)]),
  );
}

/** Filipino strings in the plain shape i18next expects. */
export function filipinoResource(strings: FilipinoStrings): Strings {
  return toText(strings as unknown as Tree) as unknown as Strings;
}
