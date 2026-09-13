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
        // Deep cosmic space canvas from reference image
        canvas: '#020609',
        space: {
          950: '#020609',
          900: '#050a0f',
          850: '#071018',
          800: '#0a1118',
          750: '#0d151d',
          700: '#111b24',
          650: '#16222e',
          600: '#1d2c3b',
          500: '#2c3e52',
        },
        // Neon green primary accent
        neon: {
          DEFAULT: '#00F59B',
          500: '#00F59B',
          400: '#00EFA3',
          300: '#4DF8B7',
          600: '#00D685',
          glow: 'rgba(0, 245, 155, 0.35)',
        },
        // Secondary Royal Purple
        purple: {
          DEFAULT: '#8A2BE2',
          accent: '#8A2BE2',
          400: '#9D4EDD',
          500: '#8A2BE2',
          600: '#7B1FA2',
          glow: 'rgba(138, 43, 226, 0.35)',
        },
        // Futuristic Cyan
        cyan: {
          DEFAULT: '#00D4FF',
          accent: '#00D4FF',
          glow: 'rgba(0, 212, 255, 0.35)',
        },
        // Electric Blue Accent
        blue: {
          accent: '#3882F6',
          vibrant: '#2389FF',
          glow: 'rgba(56, 130, 246, 0.35)',
        },
        // Semantic Alerts
        success: {
          DEFAULT: '#22C55E',
          glow: 'rgba(34, 197, 94, 0.35)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.35)',
        },
        error: {
          DEFAULT: '#EF4444',
          glow: 'rgba(239, 68, 68, 0.35)',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.07)',
          medium: 'rgba(255, 255, 255, 0.12)',
          highlight: 'rgba(255, 255, 255, 0.20)',
          green: 'rgba(0, 245, 155, 0.35)',
          cyan: 'rgba(0, 212, 255, 0.35)',
          purple: 'rgba(138, 43, 226, 0.35)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-neon': '0 0 25px -4px rgba(0, 245, 155, 0.45)',
        'glow-neon-sm': '0 0 12px -2px rgba(0, 245, 155, 0.4)',
        'glow-cyan': '0 0 25px -4px rgba(0, 212, 255, 0.45)',
        'glow-purple': '0 0 25px -4px rgba(138, 43, 226, 0.45)',
        'glow-gold': '0 0 35px -5px rgba(234, 179, 8, 0.4)',
        'glow-error': '0 0 20px -4px rgba(239, 68, 68, 0.4)',
        'glass-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.55)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
