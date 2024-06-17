/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        light: "rgba(255, 255, 255, 0.87)",
        darker: "#242424",
        dark: "#3E4145"
      },
      textColor: {
        light: "rgba(255, 255, 255, 0.87)",
        active: "#007d5c",
        darker: "#242424",
        dark: "#3E4145"
      },
      borderColor: {
        evil: "#dd3333"
      }
    },
  },
  plugins: [],
}

