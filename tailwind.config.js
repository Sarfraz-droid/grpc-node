/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/index.ejs",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
