# Build the mobile app with Expo (React Native) rather than Capacitor, Flutter or native

The existing codebase is TypeScript and React, and Guided Ride needs reliable background geofencing and notifications. Capacitor around the Next.js site would still feel like a website and handles background location poorly. Flutter and native Kotlin/Swift would mean rewriting in a new language, and native would mean two codebases. Expo keeps the existing language and logic, and EAS builds iOS without a Mac.
