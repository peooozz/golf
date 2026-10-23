/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', '"Fredoka"', 'system-ui', 'sans-serif'],
        sans: ['"Fredoka"', '"Baloo 2"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        fairway: {
          light: '#4ade80',
          dark: '#22c55e',
          deep: '#15803d'
        },
        sky: {
          sunny: '#38bdf8',
          horizon: '#bae6fd'
        },
        sand: '#fde047',
        coral: '#fb7185'
      }
    }
  },
  plugins: []
};
