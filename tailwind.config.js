/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EAB308", // Gold
        dark: "#0F172A", // Dark Navy/Black
        surface: "#1E293B", // Lighter Dark
      },
    },
  },
  plugins: [],
}
