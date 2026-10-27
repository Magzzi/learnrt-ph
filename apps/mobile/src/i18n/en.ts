// English strings. Station and Line names never go here: they come from @learnrt/core as-is.
export const en = {
  tabs: {
    map: "Map",
    fares: "Fares",
    nearest: "Nearest",
    learn: "Learn",
  },
  unverified: {
    label: "Unverified",
    a11y: "Unverified data",
  },
  map: {
    stationA11y: "{{station}}, {{line}}",
    comingSoon: "Coming Soon",
    hint: "Pinch to zoom. Tap a Station.",
  },
  station: {
    notFound: "Station not found",
  },
  placeholder: {
    counts: "{{lines}} Lines · {{stations}} Stations",
  },
};

export type Strings = typeof en;
