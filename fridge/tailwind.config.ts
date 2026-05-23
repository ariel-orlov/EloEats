import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F4F7F3',
        surface: '#FFFFFF',
        'surface-alt': '#F0F5F2',
        primary: {
          DEFAULT: '#1B6B45',
          mid: '#2E9060',
          light: '#D8EEE5',
          hover: '#155638',
          950: '#0A2E1E',
        },
        negative: '#DC2626',
        positive: '#16A34A',
        amber: '#D97706',
        text: {
          DEFAULT: '#0F1C14',
          muted: '#5C7268',
          faint: '#96AEA7',
        },
        border: '#DDE8E2',
        divider: '#ECF3EE',
        gold: '#F59E0B',
        silver: '#94A3B8',
        bronze: '#B45309',
      },
      fontFamily: {
        sans: ['Switzer', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'sans-serif'],
        mono: ['"Fira Code"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '16px', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
        pill: '999px',
        icon: '10px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 16px rgba(0,0,0,0.08)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.10)',
        inner: 'inset 0 1px 3px rgba(0,0,0,0.06)',
        score: '0 0 0 1px rgba(27,107,69,0.15)',
      },
      letterSpacing: {
        tight: '-0.02em',
        snug: '-0.01em',
        wide: '0.04em',
        wider: '0.10em',
      },
      keyframes: {
        'slide-up': {
          from: { transform: 'translateY(28px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'ring-fill': {
          from: { strokeDashoffset: '126' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.45s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.3s ease both',
        'ring-fill': 'ring-fill 0.8s cubic-bezier(0.4,0,0.2,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
