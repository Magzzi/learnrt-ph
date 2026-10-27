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
  fares: {
    line: "Line",
    from: "From",
    to: "To",
    choose: "Choose a Station",
    ticket: "Ticket",
    singleJourney: "Single Journey Ticket",
    storedValue: "Stored Value Ticket",
    discounted: "Discounted Fare",
    discountedHint: "For students, senior citizens and persons with disabilities",
    fare: "Fare",
    noFare: "No fare for this trip",
    incomplete: "Choose where you board and where you get off",
    oneLine: "Fares are for a ride on one Line. Trips across Lines come with Guided Ride.",
    close: "Close",
  },
  placeholder: {
    counts: "{{lines}} Lines · {{stations}} Stations",
  },
};

export type Strings = typeof en;
