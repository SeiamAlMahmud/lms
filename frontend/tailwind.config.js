/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2fbfa",
          100: "#d6f3ef",
          200: "#ace8df",
          300: "#78d6c8",
          400: "#38bcae",
          500: "#149f93",
          600: "#0b7f76",
          700: "#0b6660",
          800: "#0d514d",
          900: "#103f3d"
        }
      }
    }
  },
  plugins: []
};
