import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          dark: '#1a1a1a',
          charcoal: '#2d2d2d',
          silver: '#6b7280',
          light: '#f8fafc',
        },
        action: {
          orange: '#f97316',
          'orange-dark': '#ea580c',
          red: '#dc2626',
          yellow: '#eab308',
        },
        brand: {
          maroon: '#8B2E2E',
          purple: '#6B21A8',
        },
      },
      fontFamily: {
        bengali: ['Noto Sans Bengali', 'SolaimanLipi', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
export default config;
