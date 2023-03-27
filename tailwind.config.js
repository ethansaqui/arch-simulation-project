/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.html", "./dist/public/scripts/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: { 
    preflight: false,
  },
}