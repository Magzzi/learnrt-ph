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
    onThisLine: "On this Line",
    transfer: "Transfer",
    transferTo: "Walk to {{station}} ({{line}})",
    walkingNotAvailable: "Walking directions not available yet",
    nearby: "Nearby",
    noLandmarks: "No landmarks listed yet",
    facilities: "Station facilities",
    entrances: "Entrances and exits",
    platforms: "Platforms",
    elevators: "Elevators",
    notAvailable: "Not available yet",
    faresFromHere: "Fares from here",
  },
  lineStatus: {
    operational: "Operational",
    comingSoon: "Coming Soon",
    suspended: "Suspended",
  },
  placeholder: {
    counts: "{{lines}} Lines · {{stations}} Stations",
  },
};

export type Strings = typeof en;
