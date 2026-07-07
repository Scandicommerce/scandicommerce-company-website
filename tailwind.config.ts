import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '450px',
        'narrow': '320px',
      },
      colors: {
        teal: {
          DEFAULT: '#03C1CA',
          light: '#5EEAD4',
          dark: '#0D9488',
          
        },
        defaultText: {
          DEFAULT: '#03C1CA',
        },
        badge: {
          DEFAULT: '#1DEFFA1A',
        },
        // Scandicommerce design system 2026 (see globals.css tokens)
        'sc-cyan': {
          50: '#e6fbfc', 100: '#b8f2f5', 200: '#7ee5eb', 300: '#3fd4dc',
          400: '#1ec4cf', 500: '#16a7b3', 600: '#118792', 700: '#0e6a73',
          800: '#0b4e55', 900: '#07343a',
        },
        'sc-ink': {
          50: '#f6f7f8', 100: '#eceef0', 200: '#d6dade', 300: '#b5bcc4',
          400: '#8a95a0', 500: '#5a6670', 600: '#3a444a', 700: '#262e32',
          800: '#1a2124', 900: '#12181a', 950: '#0a0d0f',
        },
        'sc-accent': '#16a7b3',
      },
      boxShadow: {
        'button': '0px 8px 14px 0px rgba(141, 141, 141, 0.2)',
        'header': '0px 4px 18px 0px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'var(--font-grotesque)', 'sans-serif'],
        mono: ['JetBrains Mono', 'var(--font-mono)', 'monospace'],
        grotesque: ['Space Grotesk', 'var(--font-grotesque)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

