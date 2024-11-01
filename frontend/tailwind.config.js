/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      fullblack: "#000000",
      black: "#222831",
      black2: "#31363F",
      teal: "#76ACAE",
      white: "#FFFFFF",
      gold: "#FFD700",
      green: "#7FFF00",
      lightgreen: "#98FB98",
      red: "#FF0000",
      gray: "#B2BEB5",
      offwhite: "#FAF9F6",
      lightgray: "#E0E0E0",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
