/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        oriza: {
          darkest: "#0B1121",
          header: "#1E293B",
          light: "#F8FAFC",
          acento: "#3B82F6",
        },
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
