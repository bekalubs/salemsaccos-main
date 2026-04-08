/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3b8b',
          dark: '#162b66',
          light: '#2a4eb8',
        },
        secondary: {
          DEFAULT: '#f8f6f5',
          dark: '#e5e1df',
          light: '#ffffff',
        },
        accent: {
          DEFAULT: '#f4ac37',
          dark: '#d68f1c',
          light: '#ffc15e',
        },
      },
    },
  },
  plugins: [],
};

