/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./mdx-components.tsx",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fefafa",
          100: "#fcebd8",
          200: "#f8d4b0",
          300: "#f2a766",
          400: "#ee8b49",
          500: "#ea6d25",
          600: "#db541b",
          700: "#b63f18",
          800: "#91321b",
          900: "#752c19",
          950: "#3f140b",
        },
        secondary: {
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
          950: "#011322",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100ch", // add required value here
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
