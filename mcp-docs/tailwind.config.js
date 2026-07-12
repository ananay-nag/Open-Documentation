/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        'mcp-dark': '#0B0F19',
        'mcp-primary': '#4F46E5',
        'mcp-primary-light': '#818CF8',
        'mcp-accent': '#06B6D4',
        'mcp-accent-light': '#22D3EE',
        'mcp-secondary': '#7C3AED',
      }
    },
  },
  plugins: [],
}
