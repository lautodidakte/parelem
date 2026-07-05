import type { Config } from "tailwindcss";

// Thème repris à l'identique de l'ancien index.html (Tailwind CDN),
// pour que tous les composants existants gardent exactement le même rendu.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./contexts/**/*.{ts,tsx}",
    "./*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#328080", // Vert Sarcelle (Teal)
        primaryDark: "#235C5C",
        secondary: "#FFD700", // Sun Yellow
        secondaryLight: "#FFE55C",
        surface: "#FFFFFF",
        background: "#F8FAFC",
        darkCard: "#1E293B",
        alert: "#EF4444",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        heading: ["Source Sans Pro", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
