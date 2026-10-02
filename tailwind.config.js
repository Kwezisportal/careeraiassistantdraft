/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcf9',
          100: '#faf8f1',
          200: '#f5f0e6',
        },
        navy: {
          900: '#1a2332',
          800: '#243044',
          700: '#2f3e52',
          600: '#3b4b62',
          500: '#4a5a73',
          400: '#6b7a92',
          300: '#94a1b8',
          200: '#bcc7d9',
          100: '#e2e8f0',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 3px 0 rgba(26,35,50,0.06), 0 1px 2px 0 rgba(26,35,50,0.04)',
        medium: '0 4px 12px -2px rgba(26,35,50,0.08), 0 2px 6px -2px rgba(26,35,50,0.04)',
        card: '0 2px 8px -2px rgba(26,35,50,0.06)',
      },
    },
  },
  plugins: [],
};
