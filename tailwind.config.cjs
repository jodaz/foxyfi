/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#2e3440',
        'bg-component': '#3b4252',
        'text-alt': '#434c5e',
        'text-muted': '#4c566a',
        'text-primary': '#ffffff',
      },
    },
  },
  plugins: [],
};
