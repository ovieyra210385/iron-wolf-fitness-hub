module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'lime-green': '#A4D65E',
        'electric-blue': '#007BFF',
        'matte-black': '#1C1C1C',
      },
      fontFamily: {
        'sans': ['Montserrat', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}