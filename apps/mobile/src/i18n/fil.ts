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
  fares: {
    line: { text: "Linya", review: "needs review" },
    from: { text: "Mula sa", review: "needs review" },
    to: { text: "Papunta sa", review: "needs review" },
    choose: { text: "Pumili ng istasyon", review: "needs review" },
    ticket: { text: "Tiket", review: "needs review" },
    singleJourney: { text: "Single Journey Ticket (pang-isang sakay)", review: "needs review" },
    storedValue: { text: "Stored Value Ticket (may load)", review: "needs review" },
    discounted: { text: "May diskwento", review: "needs review" },
    discountedHint: { text: "Para sa mga estudyante, senior citizen at may kapansanan (PWD)", review: "needs review" },
    fare: { text: "Pamasahe", review: "needs review" },
    noFare: { text: "Walang pamasahe para sa biyaheng ito", review: "needs review" },
    incomplete: { text: "Piliin kung saan ka sasakay at bababa", review: "needs review" },
    oneLine: { text: "Ang pamasahe ay para sa isang linya lang. Ang biyaheng tatawid ng linya ay kasama sa Guided Ride.", review: "needs review" },
    close: { text: "Isara", review: "needs review" },
  },
  nearest: {
    explain: { text: "Ginagamit ng LearnRT ang iyong lokasyon nang isang beses, dito lang sa telepono, para mahanap ang pinakamalapit na istasyon. Hindi ito ipinapadala kahit saan.", review: "needs review" },
    find: { text: "Hanapin ang pinakamalapit na istasyon", review: "needs review" },
    finding: { text: "Hinahanap ang iyong lokasyon…", review: "needs review" },
    denied: { text: "Naka-off ang lokasyon para sa LearnRT. I-on ito sa Settings, o maghanap ng istasyon sa mapa.", review: "needs review" },
    unavailable: { text: "Hindi makuha ang iyong lokasyon. Subukang muli, o maghanap ng istasyon sa mapa.", review: "needs review" },
    openSettings: { text: "Buksan ang Settings", review: "needs review" },
    tryAgain: { text: "Subukang muli", review: "needs review" },
    openMap: { text: "Buksan ang mapa", review: "needs review" },
    closest: { text: "Pinakamalapit na mga istasyon", review: "needs review" },
    away: { text: "{{distance}} ang layo", review: "needs review" },
  },
  placeholder: {
    counts: { text: "{{lines}} linya · {{stations}} istasyon", review: "needs review" },
  },
};
