const { ROLES } = require("./src/theme/tokens");

// Each colour role is a CSS variable, set for the current theme at the root of the app (src/theme).
const colors = Object.fromEntries(ROLES.map((role) => [role, `rgb(var(--color-${role}) / <alpha-value>)`]));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      // Headings only; body text stays in the system font (owner, 2026-10-28).
      fontFamily: { display: ["PlusJakartaSans_700Bold"], title: ["PlusJakartaSans_800ExtraBold"] },
    },
  },
  plugins: [],
};
