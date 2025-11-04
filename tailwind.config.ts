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
          light: '#D4A574',
          DEFAULT: '#8B6F47',
          dark: '#5C4A32',
          darker: '#3E2F1F',
        },
        green: {
          felt: '#2C5F2D',
          'felt-dark': '#1F4620',
        }
      },
      backgroundImage: {
        'wood-texture': "url('/wood-texture.jpg')",
        'felt-texture': "url('/felt-texture.jpg')",
      },
    },
  },
  plugins: [],
};

export default config;
