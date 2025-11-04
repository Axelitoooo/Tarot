import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          lightest: '#F5E6D3',
          light: '#D4A574',
          DEFAULT: '#8B6F47',
          dark: '#5C4A32',
          darker: '#3E2F1F',
          darkest: '#2A1F14',
        },
        green: {
          felt: '#2C5F2D',
          'felt-dark': '#1F4620',
          'felt-darker': '#16330F',
        },
        gold: {
          light: '#FFD700',
          DEFAULT: '#FFA500',
          dark: '#FF8C00',
        },
      },
      backgroundImage: {
        'wood-grain': "linear-gradient(90deg, transparent, rgba(0,0,0,0.1) 50%, transparent)",
        'felt-texture': "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)",
      },
      boxShadow: {
        'wood': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
        'inner-wood': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
