// The geofence task must be defined when the JS bundle loads, before any screen: Android may start
// the app in the background just to run it (expo-task-manager docs).
import "./src/ride/background";
import "expo-router/entry";
