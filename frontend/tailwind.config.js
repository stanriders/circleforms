module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      body: [
        '"Exo 2"',
        "sans-serif",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        "sans-serif",
      ],
      museo: [
        "MuseoModerno",
        "sans-serif",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        "sans-serif",
      ],
    },
    extend: {
      colors: {
        black: {
          DEFAULT: "#0E0E0E",
          darker: "#0c0c0c",
          dark2: "#0F0F0F",
          light: "#121212",
          lighter: "#131313",
          lightest: "#1A1A1A",
        },
        grey: {
          dark: "#2D2D2D",
          DEFAULT: "#999999",
          border: "rgba(255, 255, 255, 0.15)",
          skeleton: "rgba(255, 255, 255, 0.02)",
        },
        pink: {
          DEFAULT: "#FF66AA",
          dark: "#5C253D",
          darker: "#3C1526",
        },
        green: {
          DEFAULT: "#ACFF8F",
          dark: "#426636",
        },
        red: {
          DEFAULT: "#FF8F8F",
          a: "#614e4e",
        },
        blue: {
          DEFAULT: "#005ce7",
          discord: "#5865F2",
        },
      },
      borderRadius: {
        5: "5px",
        7: "7px",
        9: "9px",
        14: "14px",
        20: "20px",
        35: "35px",
        40: "40px",
        70: "70px",
      },
      outlineWidth: {
        3: "3px",
        5: "5px",
      },
      scale: {
        99: "0.99",
      },
      zIndex: {
        navbar: "999",
        aboveNavbar: "9999",
      },
    },
  },
  plugins: [require("@whiterussianstudio/tailwind-easing")],
};
