
const colors = require('tailwindcss/colors');
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx}"],
  
  theme: {
    extend: {},
    color: {
      primary: colors.blue,
      secondary: colors.emerald,
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      red: colors.red,
      yellow: colors.amber,
      green: colors.emerald,
      blue: colors.blue,
      indigo: colors.indigo,
      purple: colors.violet,
      pink: colors.pink,
    }
  },
  plugins: [],
}

