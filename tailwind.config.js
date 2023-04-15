/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [".//*.html", "./dist/public/scripts/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: { 
    preflight: false,
  },
}