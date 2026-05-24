import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // Rating palette
        r1: "#ef4444", // total failure
        r2: "#f97316", // bad
        r3: "#eab308", // acceptable
        r4: "#65d36e", // good
        r5: "#16a34a", // fantastic
        // Surface palette (dark-first)
        ink: {
          950: "#0a0a0b",
          900: "#111113",
          850: "#16161a",
          800: "#1c1c22",
          700: "#26262e",
          600: "#3a3a44",
          500: "#5a5a66",
          400: "#8a8a96",
          300: "#b3b3bc",
          200: "#d6d6dc",
          100: "#ececf0",
        },
      },
    },
  },
  plugins: [],
};

export default config;
