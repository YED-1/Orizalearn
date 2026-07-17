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
        },
      },
    },
  },
  plugins: [],
};
