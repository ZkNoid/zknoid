/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme';
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './containers/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './games/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontSize: {
        'headline-1': ['32px', { lineHeight: '32px', fontWeight: '700' }],
        'headline-2': ['24px', { lineHeight: '24px', fontWeight: '700' }],
        'headline-3': ['24px', { lineHeight: '29px', fontWeight: '500' }],
        'big-uppercase': ['30px', { lineHeight: '30px', fontWeight: '500' }],
        filter: ['20px', { lineHeight: '26px', fontWeight: '400' }],
        main: ['16px', { lineHeight: '18px', fontWeight: '400' }],
        hashtag: ['14px', { lineHeight: '15px', fontWeight: '500' }],
        'second-menu': ['24px', { lineHeight: '29px', fontWeight: '500' }],
        'header-menu': ['16px', { lineHeight: '19px', fontWeight: '500' }],
        buttons: ['24px', { lineHeight: '29px', fontWeight: '500' }],
        'buttons-menu': ['16px', { lineHeight: '19px', fontWeight: '500' }],
        'filtration-buttons': [
          '16px',
          { lineHeight: '21px', fontWeight: '400' },
        ],
        'rating-numbers': ['16px', { lineHeight: '14px', fontWeight: '500' }],
      },
      colors: {
        'bg-dark': '#141414',
        'bg-grey': '#212121',
        foreground: '#F9F8F4',
        'left-accent': '#D2FF00',
        'middle-accent': '#FF5B23',
        'right-accent': '#DCB8FF',
        'dark-buttons-text': '#212121',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        museo: ['var(--museo-slab)'],
        plexmono: ['var(--plex-mono)'],
        plexsans: ['var(--plex-sans)'],
      },
      gridTemplateColumns: {
        '15': 'repeat(15, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }: { addUtilities: any }) {
      addUtilities(
        {
          '.no-scrollbar::-webkit-scrollbar': {
            display: 'none',
          },
          '.no-scrollbar': {
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
          },
        },
        ['responsive', 'hover']
      );
    }),
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
