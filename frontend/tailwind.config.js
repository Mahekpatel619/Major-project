/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6fb',
          100: '#e8edf7',
          200: '#cbd7ee',
          300: '#9eb7e0',
          400: '#6a92cf',
          500: '#4672bc',
          600: '#3457a4',
          700: '#2c4585',
          800: '#273b6e',
          900: '#1d2a4d',
          950: '#131b32',
        },
        sage: {
          50: '#f4f8f6',
          100: '#e5f0ec',
          200: '#cce2da',
          300: '#a5cec0',
          400: '#75b39f',
          500: '#539783',
          600: '#3f7968',
          700: '#346154',
          800: '#2c4e44',
          900: '#274139',
        },
        calm: {
          bg: '#f8fafc',
          card: '#ffffff',
          dark: '#0f172a',
          purple: '#7c3aed',
          teal: '#0d9488',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'card': '0 10px 30px -4px rgba(15, 23, 42, 0.08)',
        'glow': '0 0 25px -5px rgba(70, 114, 188, 0.25)',
      }
    },
  },
  plugins: [],
}
