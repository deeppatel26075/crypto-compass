/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep futuristic space palette
        dark: {
          950: '#060709', // Near-black deepest background
          900: '#0a0d14', // Base body background
          850: '#0f131d', // Card and panel base
          800: '#151b28', // Elevated surface
          750: '#1b2334', // Secondary surface
          700: '#232d42', // Subdued borders
          600: '#34425f', // Muted text / light borders
        },
        // Neon green primary accent (Financial growth & learning)
        neon: {
          green: '#00f59b',
          'green-light': '#5cffbe',
          'green-dark': '#00b875',
          'green-glow': 'rgba(0, 245, 155, 0.25)',
        },
        // Futuristic cyan/blue accents
        cyan: {
          accent: '#00d4ff',
          'accent-glow': 'rgba(0, 212, 255, 0.25)',
        },
        // Royal purple secondary accents
        purple: {
          accent: '#8a2be2',
          'accent-glow': 'rgba(138, 43, 226, 0.25)',
        },
        // Educational alert colors
        amber: {
          accent: '#f59e0b',
          'accent-glow': 'rgba(245, 158, 11, 0.25)',
        },
        rose: {
          accent: '#f43f5e',
          'accent-glow': 'rgba(244, 63, 94, 0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 25px -5px rgba(0, 245, 155, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(0, 212, 255, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(138, 43, 226, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
