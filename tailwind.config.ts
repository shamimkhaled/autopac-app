import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        industrial: {
          dark: '#1C1917',
          charcoal: '#44403C',
          silver: '#A8A29E',
          light: '#F7F4EF',
          accent: '#6D1A2D',
        },
        action: {
          orange: '#6D1A2D',
          'orange-dark': '#4A1220',
          'orange-light': '#F3E8EA',
          red: '#6D1A2D',
          yellow: '#A16207',
        },
        brand: {
          maroon: '#6D1A2D',
          'maroon-hover': '#551624',
          'maroon-mid': '#8B2E2E',
          paper: '#F7F4EF',
          purple: '#6B21A8',
        },
      },
      fontFamily: {
        sans: ['var(--font-ibm)', 'var(--font-hind)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-hind)', 'sans-serif'],
        bengali: ['var(--font-hind)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgb(0 0 0 / 0.07), 0 10px 20px -2px rgb(0 0 0 / 0.04)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;
