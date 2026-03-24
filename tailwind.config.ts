import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: "#E8D4A2",
          light: "#F0DFBA",
          dark: "#D4BC8A",
        },
        crimson: {
          DEFAULT: "#7B1D1D",
          dark: "#5C1515",
          muted: "#8E2A2A",
        },
        brown: {
          heading: "#3B1F0C",
          body: "#4A2E14",
          muted: "#7A5C3A",
        },
        frame: {
          DEFAULT: "#8B6340",
          dark: "#5C3D1E",
          light: "#C4A06A",
        },
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        garamond: ['"EB Garamond"', "Garamond", "serif"],
      },
      boxShadow: {
        parchment: "2px 2px 8px rgba(60, 30, 10, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
