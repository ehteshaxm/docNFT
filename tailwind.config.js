/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
    },
    fontFamily: {
      heading: ['Space Grotesk', 'sans-serif'],
      body: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        'app-yellow': '#FFF033',
        'app-green': {
          100: '#DDFAED',
          200: '#22B573',
          300: '#226F54',
          400: '#002F32',
        },
      },
      boxShadow: {
        '4xl': '15px 15px 2px 0px rgba(0, 0, 0, 1.0)',
        '4xl-green': '15px 15px 2px 0px rgba(0, 72, 47, 1.0)',
      },
    },
  },
  plugins: [],
};
