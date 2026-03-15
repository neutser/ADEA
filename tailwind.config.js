/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          'neon-blue': '#00f0ff',
          'neon-purple': '#b026ff',
          amber: '#fbbf24',
          red: '#ef4444',
          green: '#10b981',
        },
        bg: {
          DEFAULT: '#0a0a0a',
          surface: '#121212',
          elevated: '#1e1e1e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 15px rgba(0, 240, 255, 0.5)',
        'glow-purple': '0 0 15px rgba(176, 38, 255, 0.4)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
