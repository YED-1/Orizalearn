import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta "Amanecer". Los tonos DEFAULT son decorativos; para texto de
        // color o botones con texto blanco usa la variante "fuerte" (contraste ≥ 4.5:1).
        oriza: {
          crema: "#FFF8F1",
          tinta: "#2A2438",
          coral: {
            DEFAULT: "#FF6B4A",
            suave: "#FFE3DA",
            fuerte: "#CF4327",
            oscuro: "#B5361D",
          },
          sol: {
            DEFAULT: "#FFC53D",
            suave: "#FFF1C7",
          },
          menta: {
            DEFAULT: "#2BB3A3",
            suave: "#DDF5F1",
            fuerte: "#1A7F74",
          },
          lila: {
            DEFAULT: "#8B7CF6",
            suave: "#ECE8FF",
            fuerte: "#5B4BC4",
          },
        },
      },
      fontFamily: {
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        flotar: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        flotar: "flotar 6s ease-in-out infinite",
        "flotar-lento": "flotar 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
