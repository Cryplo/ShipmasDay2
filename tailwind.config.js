/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'soft': {
          50: '#ffffff',
          100: '#faf9f7',
          200: '#f0eeeb',
          300: '#e5e2dd',
          400: '#d4d0c8',
          500: '#a8a49e',
          600: '#7a766f',
          700: '#5a5650',
          800: '#3d3a36',
          900: '#2d3436',
        },
        'holiday': {
          red: '#c85050',
          'red-glow': 'rgba(200, 80, 80, 0.6)',
          green: '#4a9f5a',
          'green-glow': 'rgba(74, 159, 90, 0.6)',
        },
        'accent': {
          warm: '#c85050',
          muted: '#8b7355',
        },
        // Keep these for backwards compatibility but they'll be replaced
        'industrial': {
          900: '#faf9f7',
          800: '#f0eeeb',
          700: '#e5e2dd',
          600: '#d4d0c8',
          500: '#a8a49e',
        },
        'copper': {
          400: '#c85050',
          500: '#b84545',
          600: '#a83a3a',
        },
        'bulb': {
          warm: '#c85050',
          hot: '#e06060',
          glow: '#f0a0a0',
        },
        'danger': {
          red: '#c85050',
          orange: '#d47040',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace'],
        industrial: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'bulb-red': '0 0 15px 8px rgba(200, 80, 80, 0.4), 0 0 30px 15px rgba(200, 80, 80, 0.2)',
        'bulb-green': '0 0 15px 8px rgba(74, 159, 90, 0.4), 0 0 30px 15px rgba(74, 159, 90, 0.2)',
        'bulb-off': '0 0 2px 1px rgba(0, 0, 0, 0.05)',
        'switch': 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'victory-pulse': 'victory-pulse 0.5s ease-out',
        'flicker': 'flicker 0.1s ease-in-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'victory-pulse': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
