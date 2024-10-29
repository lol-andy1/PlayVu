/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#97FB57",
        secondary: {
          DEFAULT: "#FD6326",
          100: "#262E57",
          200: "#A5E9E8",
        },
        black: {
          DEFAULT: "#121212",
        },
        gray: {
          100: "#909090",
          200: "#F6F2F2",
        },
      },
      fontFamily: {
        pthin: ["Montserrat-Thin", "sans-serif"],
        pextralight: ["Montserrat-ExtraLight", "sans-serif"],
        plight: ["Montserrat-Light", "sans-serif"],
        pregular: ["Montserrat-Regular", "sans-serif"],
        pmedium: ["Montserrat-Medium", "sans-serif"],
        psemibold: ["Montserrat-SemiBold", "sans-serif"],
        pbold: ["Montserrat-Bold", "sans-serif"],
        pextrabold: ["Montserrat-ExtraBold", "sans-serif"],
        pblack: ["Montserrat-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
