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
  map: {
    stationA11y: { text: "{{station}}, {{line}}", review: "needs review" },
    comingSoon: { text: "Paparating", review: "needs review" },
    hint: { text: "Ipitin para mag-zoom. Pindutin ang isang istasyon.", review: "needs review" },
  },
  station: {
    notFound: { text: "Hindi makita ang istasyon", review: "needs review" },
    onThisLine: { text: "Sa linyang ito", review: "needs review" },
    transfer: { text: "Lipat-linya", review: "needs review" },
    transferTo: { text: "Lumakad papuntang {{station}} ({{line}})", review: "needs review" },
    walkingNotAvailable: { text: "Wala pang direksyon sa paglalakad", review: "needs review" },
    nearby: { text: "Malapit dito", review: "needs review" },
    noLandmarks: { text: "Wala pang nakalistang palatandaan", review: "needs review" },
    facilities: { text: "Mga pasilidad ng istasyon", review: "needs review" },
    entrances: { text: "Mga pasukan at labasan", review: "needs review" },
    platforms: { text: "Mga plataporma", review: "needs review" },
    elevators: { text: "Mga elevator", review: "needs review" },
    notAvailable: { text: "Wala pa", review: "needs review" },
    faresFromHere: { text: "Pamasahe mula rito", review: "needs review" },
  },
  lineStatus: {
    operational: { text: "Tumatakbo", review: "needs review" },
    comingSoon: { text: "Paparating", review: "needs review" },
    suspended: { text: "Suspendido", review: "needs review" },
  },
  placeholder: {
    counts: { text: "{{lines}} linya · {{stations}} istasyon", review: "needs review" },
  },
};
