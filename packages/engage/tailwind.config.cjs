const theme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /max-w-(\d)+xl/,
      variants: ["lg", "xl"],
    },
  ],
  theme: {
    screens: {
      sm: theme.screens.sm,
      md: theme.screens.md,
      lg: theme.screens.lg,
      xl: theme.screens.xl,
      "1.5xl": "1430px",
      "2xl": theme.screens["2xl"],
    },
    extend: {
      fontFamily: {
        sans: ["Inter", ...theme.fontFamily.sans],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
