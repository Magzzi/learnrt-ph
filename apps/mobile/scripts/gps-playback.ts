// Plays a ride on the Android emulator by moving its GPS test provider through Station positions.
// Usage (from apps/mobile): node scripts/gps-playback.ts [--seconds-per-hop 20] <stationId> <stationId> ...
// Pass every Station of the route in riding order (both ends of a Transfer). Needs adb on PATH and a
// running emulator; the location test provider is set up here (see CLAUDE.md, apps/mobile).
import { execFileSync } from "node:child_process";
import { STATIONS } from "../../../packages/core/src/data/stations.ts";

const args = process.argv.slice(2);
let secondsPerHop = 20;
const flag = args.indexOf("--seconds-per-hop");
if (flag >= 0) {
  secondsPerHop = Number(args[flag + 1]);
  args.splice(flag, 2);
}
const route = args.map((id) => {
  const station = STATIONS.find((s) => s.id === id);
  if (!station) throw new Error(`Unknown Station id: ${id}`);
  return station;
});
if (route.length < 2) throw new Error("Give at least two Station ids");

const adb = (...a: string[]) => execFileSync("adb", ["shell", ...a], { stdio: "pipe" }).toString();
adb("appops", "set", "com.android.shell", "android:mock_location", "allow");
try {
  adb("cmd", "location", "providers", "add-test-provider", "gps");
} catch {
  // Already added.
}
adb("cmd", "location", "providers", "set-test-provider-enabled", "gps", "true");

const STEPS_PER_HOP = 5;
const setLocation = (lat: number, lng: number) =>
  adb("cmd", "location", "providers", "set-test-provider-location", "gps", "--location", `${lat},${lng}`, "--accuracy", "5");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

for (let i = 0; i < route.length; i++) {
  const here = route[i]!;
  console.log(`${new Date().toISOString().slice(11, 19)} at ${here.name} (${here.id})`);
  setLocation(here.location.lat, here.location.lng);
  const next = route[i + 1];
  if (!next) break;
  for (let step = 1; step < STEPS_PER_HOP; step++) {
    await sleep((secondsPerHop * 1000) / STEPS_PER_HOP);
    const f = step / STEPS_PER_HOP;
    setLocation(
      here.location.lat + (next.location.lat - here.location.lat) * f,
      here.location.lng + (next.location.lng - here.location.lng) * f,
    );
  }
  await sleep((secondsPerHop * 1000) / STEPS_PER_HOP);
}
