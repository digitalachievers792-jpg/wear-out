/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette
        ink: '#0a0a0a', // primary black background
        coal: '#111111',
        smoke: '#1a1a1a',
        gold: {
          DEFAULT: '#c9a24b',
          light: '#e7c977',
          dark: '#9c7a2f',
        },
        bronze: '#a9743b',
        sand: '#d8c7a8',
        tan: '#c9b18a',
        bone: '#f3ece0', // light backgrounds (admin)
        mist: '#f7f5f0',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Oswald', 'Arial Narrow', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(201,162,75,0.4), 0 8px 30px rgba(201,162,75,0.15)',
      },
    },
  },
  plugins: [],
};
