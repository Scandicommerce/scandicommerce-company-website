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

