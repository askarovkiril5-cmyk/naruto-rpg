/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ninja: {
          dark: '#0e1117',
          card: '#161b22',
          accent: '#f59e0b',
          chakra: '#06b6d4',
        }
      }
    },
  },
  plugins: [],
}
