/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"], 
  theme: {
    extend: {
      fontFamily: {
        body: ['"Inter Tight"', 'sans-serif'],
        header: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}