/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#ec0000",
        "sec":'#f6f6f6',
        "col":"#f97316",
        "slate":"#f1f2f5"
      }
    },
  },
  plugins: [],
}

