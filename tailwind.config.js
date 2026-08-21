/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#04044A',
          900: '#070868', // Deep Navy
          800: '#0E0F8C', // Primary Navy (#0E0F8C)
          700: '#1B1CD2',
          600: '#3334E8',
          500: '#5758EE',
          300: '#A8A9F7',
          200: '#D0D0FC',
          100: '#EAEAFE',
          50: '#F4F4FD',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
