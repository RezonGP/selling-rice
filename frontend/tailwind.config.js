/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rice: {
          green: '#2E7D32',
          lightgreen: '#E8F5E9',
          gold: '#F9A825',
          cream: '#FAF8F5',
          wood: '#F5F5DC',
          slate: '#1B3B2B',
          accent: '#C62828',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
