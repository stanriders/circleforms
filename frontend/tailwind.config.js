module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'display': ['Typo Round', 'sans-serif', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      'body': ['Montserrat', 'sans-serif', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
    },
    extend: {
      colors: {
        black: {
          DEFAULT: "#0E0E0E",
          darker: '#0c0c0c',
          light: '#121212'
        },
        grey: {
          light: "#BDBDBD",
          dark: "#2D2D2D",
          DEFAULT: "#2C2C2C",
        },
        pink: {
          DEFAULT: '#FF66AA',
          dark: '#5C253D'
        },
        green: {
          DEFAULT: '#ACFF8F'
        }
      },
      borderRadius: {
        5: '5px',
      },
      outlineWidth: {
        3: '3px',
        5: '5px',
      }
    },
  },
  plugins: [
    require('@whiterussianstudio/tailwind-easing'),
  ],
}