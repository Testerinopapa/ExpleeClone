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
        background: '#f6f5f3',
        foreground: '#0a0a0a',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0a0a0a',
        },
        chip: 'rgba(0, 0, 0, 0.04)',
        border: 'rgba(0, 0, 0, 0.08)',
        muted: {
          DEFAULT: 'rgba(0, 0, 0, 0.04)',
          foreground: '#737373',
        },
        brand: {
          50: '#f3fcf9',
          100: '#dbf5ec',
          200: '#abe7d3',
          300: '#7cd9ba',
          500: '#10b981',
          600: '#0d9467',
          700: '#0a7854',
          800: '#096647',
        },
        primary: {
          DEFAULT: '#171717',
          foreground: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'GeistSans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['GeistMono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        plaque: '0 2px 10px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        glass: '0 8px 30px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
