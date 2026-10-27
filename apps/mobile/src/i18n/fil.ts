// Filipino strings, drafted by Claude. Every entry stays "needs review" until the owner and a
// native-speaking reviewer check it; launch requires all of them "reviewed" (PRD §11).
// Station and Line names never go here: they come from @learnrt/core as-is.
import type { FilipinoStrings } from "./translations";

export const fil: FilipinoStrings = {
  tabs: {
    map: { text: "Mapa", review: "needs review" },
    fares: { text: "Pamasahe", review: "needs review" },
    nearest: { text: "Pinakamalapit", review: "needs review" },
    learn: { text: "Matuto", review: "needs review" },
  },
  unverified: {
    label: { text: "Hindi pa beripikado", review: "needs review" },
    a11y: { text: "Datos na hindi pa beripikado", review: "needs review" },
  },
  placeholder: {
    counts: { text: "{{lines}} linya · {{stations}} istasyon", review: "needs review" },
  },
};
