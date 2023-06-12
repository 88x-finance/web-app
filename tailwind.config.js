const defaultTheme = require('tailwindcss/defaultTheme');

// Spacing are a multiple of 2
const spacing = {};
for (let i = 0; i <= 65; i++) {
  spacing[i * 2] = `${(i * 2) / 16}rem`;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      xsm: ['.75rem', '.9375rem'], // 12px - 15px
      sm: ['.875rem', '1.0625rem'], // 14px - 17px
      base: ['1rem', '1.1875rem'], // 16px - 19px
      lg: ['1.125rem', '1.375rem'], // 18px - 22px
      xl: ['1.25rem', '1.5rem'], // 20px - 24px
      h4: ['1.5rem', { lineHeight: '1.75rem', fontWeight: 300 }], // 24px - 28px
      h3: ['1.875rem', { lineHeight: '2.1875rem', fontWeight: 300 }], // 30px - 35px
      h2: ['2.25rem', { lineHeight: '2.625rem', fontWeight: 300 }], // 36px - 42px
      h1: ['3rem', { lineHeight: '3.5rem', fontWeight: 300 }], // 48px - 56px
    },
    spacing,
    extend: {
      spacing: {
        px: '1px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        'public-sans': ['var(--font-public-sans)', ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        desktop: '1157px',
      },
      boxShadow: {
        DEFAULT: '0px 4px 4px rgba(101, 104, 112, 0.03)',
      },
      colors: {
        blue: {
          1: '#1591EF',
        },
        dark: {
          1: '#000000',
          2: '#333333',
          3: '#666666',
          4: '#999999',
          5: '#cccccc',
          6: '#e6e6e6',
          7: '#f2f2f2',
        },
        green: {
          1: '#26a17b',
          2: '#51b495',
          3: '#7dc7b0',
          4: '#a8d9ca',
          5: '#d4ece5',
          6: '#e9f6f2',
          7: '#f4faf8',
        },
        gray: {
          1: '#657e9b',
          2: '#8498af',
          3: '#a3b2c3',
          4: '#c2cbd7',
          5: '#e0e5eb',
          6: '#f0f2f5',
          7: '#f7f9fa',
        },

        brand: '#1691EF', // Brand color of 88x project

        // Networks colors
        ethereum: '#627eea',
        bnb: '#f3ba2f',
        avalanche: '#e84142',
        polygon: '#8247e5',
        moonbeam: '#0d1126',
        arbitrum: '#2e439e',
      },
      borderRadius: {
        10: '0.625rem',
        20: '1.25rem',
        25: '1.5625rem',
        30: '1.875rem',
        50: '3.125rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'fade-out': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        'accordion-down': {
          '0%': { height: 0 },
          '100%': { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          '0%': { height: 'var(--radix-accordion-content-height)' },
          '100%': { height: 0 },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease',
        'fade-out': 'fade-out 150ms ease',
        'accordion-down': 'accordion-down 150ms ease-out',
        'accordion-up': 'accordion-up 150ms ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
};
