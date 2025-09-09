/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        'DEFAULT': '4px',
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0, 0, 0, 0.3)',
        'pixel-inset': 'inset 2px 2px 0px 0px rgba(0, 0, 0, 0.2)',
        'pixel-button': '-2px -2px 0px 0px rgba(255, 255, 255, 0.3), 2px -2px 0px 0px rgba(255, 255, 255, 0.3), -2px 2px 0px 0px rgba(0, 0, 0, 0.3), 2px 2px 0px 0px rgba(0, 0, 0, 0.3), 4px 4px 0px 0px rgba(0, 0, 0, 0.2)',
      },
      colors: {
        'success': '#00ff88',
        'error': '#ff3333',
        'bg-dark': '#000000',
        'bg-card': '#111111',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'screen-shake': 'screenShake 0.5s',
        'pixel-flash': 'pixelFlash 0.3s ease-in-out 3',
        'combo-glow': 'comboGlow 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        screenShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        pixelFlash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        comboGlow: {
          '0%, 100%': { filter: 'brightness(1) drop-shadow(0 0 0px rgba(44, 232, 162, 0))' },
          '50%': { filter: 'brightness(1.2) drop-shadow(0 0 10px rgba(44, 232, 162, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}