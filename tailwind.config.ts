import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        phone: "390px",
        tablet: "768px",
        dt: "1025px",
        ws: "1780px",
      },
      letterSpacing: {
        wide: "0.06em",
        wider: "0.2em",
        widest: "0.24em",
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        lato: ['var(--font-lato)'],
    },
    },
  },
  plugins: [],
};

export default config;
