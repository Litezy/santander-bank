/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#ec0000",
        "sec":'#dc2626',
        "col":"#001f3f",
        "slate":"#f1f2f5",
        "dark":"#303030"
      }
    },
  },
  plugins: [],
}

