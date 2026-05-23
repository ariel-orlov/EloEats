import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f7f8f7',          // almost white, barely any tint — not obviously green
        surface: '#ffffff',
        primary: {
          DEFAULT: '#1a6b45',   // deeper, richer forest green
          mid: '#4aab73',
          light: '#e8f5ee',     // cooler, less saturated mint
          hover: '#14573a',
          950: '#0b2e1e',       // for heavy display text on green bg
        },
        negative: '#d93025',    // less orange, more true red
        positive: '#1a6b45',
        text: {
          DEFAULT: '#111b14',   // near-black with very slight green undertone
          muted: '#6a7870',     // warm grey-green
          faint: '#9eada8',     // for timestamps, tertiary info
        },
        border: '#e8ece9',      // neutral, barely visible
        divider: '#eef1ef',     // hairline
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '16px', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        card: '14px',
        btn: '10px',
        pill: '999px',
        icon: '10px',
      },
      boxShadow: {
        // Neutral, not greenish
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 12px rgba(0,0,0,0.08)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.10)',
        inner: 'inset 0 1px 3px rgba(0,0,0,0.06)',
      },
      letterSpacing: {
        tight: '-0.02em',
        snug: '-0.01em',
      },
    },
  },
  plugins: [],
};

export default config;
