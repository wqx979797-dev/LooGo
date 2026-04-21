/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F59F85',
        secondary: '#9CCFC0',
        honey: '#F7C873',
        cream: '#FFF7EC',
        blush: '#FFE8DF',
        mint: '#E8F6F0',
        cocoa: '#5B4636',
        dark: '#3D322A',
        light: '#FFF9F1'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
