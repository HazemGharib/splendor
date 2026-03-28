/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gem: {
          ruby: '#D32F2F',
          sapphire: '#1976D2',
          emerald: '#388E3C',
          diamond: '#FFFFFF',
          onyx: '#424242',
          gold: '#FFD700',
        },
        player: {
          red: '#EF5350',
          blue: '#42A5F5',
          green: '#66BB6A',
          yellow: '#FFEB3B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'card-flip': 'flip 0.6s ease-in-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
      },
    },
  },
  plugins: [],
}

