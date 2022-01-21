module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: "#0E0E0E",
        },
        grey: {
          light: "#BDBDBD",
          dark: "#2D2D2D",
          DEFAULT: "#2C2C2C",
        }
      },
    },
  },
  plugins: [],
}