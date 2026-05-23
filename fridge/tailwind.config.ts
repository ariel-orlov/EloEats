import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f4faf6',
        surface: '#ffffff',
        primary: {
          DEFAULT: '#2d6a4f',
          mid: '#52b788',
          light: '#d8f3dc',
          hover: '#245a41',
        },
        negative: '#e63946',
        text: {
          DEFAULT: '#1b2d22',
          muted: '#6b7c72',
        },
        border: '#e4ede8',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
        pill: '24px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(27,45,34,0.07)',
        'card-hover': '0 4px 16px rgba(27,45,34,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
