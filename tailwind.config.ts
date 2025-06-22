import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Importante para incluir componentes na pasta src
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        piloto: {
          blue: {
            DEFAULT: '#0D6EFD',
            light: '#6BBEFF',
            dark: '#0A3D62',
          },
        },
        accent: {
          orange: '#FF6F00',
          yellow: '#FFD600',
        },
        neutral: {
          '900': '#121212',
          '800': '#1A1D24',
          '700': '#242933',
          '200': '#A0AEC0',
          '100': '#F0F0F0',
        },
        background: '#0a0a0a',
        foreground: '#ededed',
      },
      fontFamily: {
        // As fontes serão configuradas via next/font no layout principal
        // e acessadas aqui via CSS variables, por isso as strings vazias são removidas.
        sans: [
          'var(--font-inter)',
          'system-ui',
          'Avenir',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        heading: [
          'var(--font-rajdhani)',
          'system-ui',
          'Avenir',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
};

export default config;
