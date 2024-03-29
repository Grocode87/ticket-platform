module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        gif: "url('/images/phone-video.gif')",
      },
      fontFamily: {
        nighty: ["NightyFont"],
        sans: ["NightyFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};
