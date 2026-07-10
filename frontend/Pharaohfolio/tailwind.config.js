/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffdf5',
          100: '#fef7da',
          200: '#fdeea7',
          300: '#fcdf70',
          400: '#fbcd3d',
          500: '#d4af37', // Regal gold
          600: '#c59b27', // Bronze gold
          700: '#a37c1c',
          800: '#7d5e12',
          900: '#543f07',
        },
        obsidian: {
          50: '#f7f8fa',
          100: '#eceef2',
          200: '#d5dae2',
          300: '#b1bccb',
          400: '#8496af',
          500: '#617592',
          600: '#4c5c76',
          700: '#3c485c',
          800: '#2b3343',
          900: '#111424', // Deep obsidian navy
          950: '#05070f', // Near black
        },
        primary: {
          50: '#fef7f0',
          100: '#fdeee1',
          200: '#fbd4bd',
          300: '#f7b794',
          400: '#f2906b',
          500: '#ed7143',
          600: '#e85a2b',
          700: '#c44622',
          800: '#9d3821',
          900: '#7e2f1f',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      fontFamily: {
        'chef': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'pharaoh-gradient': 'linear-gradient(135deg, #111424 0%, #05070f 100%)',
        'gold-gradient': 'linear-gradient(135deg, #fbcd3d 0%, #d4af37 50%, #a37c1c 100%)',
        'chef-gradient': 'linear-gradient(135deg, #ed7143 0%, #f2906b 50%, #22c55e 100%)',
        'pharaoh-pattern': "url('data:image/svg+xml,%3Csvg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M15 0L30 15L15 30L0 15Z\" fill=\"%23d4af37\" fill-opacity=\"0.025\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
        'chef-pattern': "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23f97316\" fill-opacity=\"0.05\" fill-rule=\"evenodd\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"3\"/%3E%3Ccircle cx=\"13\" cy=\"13\" r=\"3\"/%3E%3C/g%3E%3C/svg%3E')",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}