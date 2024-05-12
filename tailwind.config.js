/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff8ff",
          100: "#ddf1ff",
          200: "#b4e4ff",
          300: "#71cfff",
          400: "#27b7ff",
          500: "#009efd",
          600: "#007dd9",
          700: "#0063af",
          800: "#005390",
          900: "#034577",
          950: "#011526",
        },
      },
    },
  },
  plugins: [],
};
