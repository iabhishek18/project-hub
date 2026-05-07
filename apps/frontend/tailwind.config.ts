import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#050507',
          50: '#0a0a12',
          100: '#0f0f1a',
          200: '#161625',
          300: '#1e1e33',
          400: '#2a2a42',
        },
        accent: {
          cyan: 'rgb(var(--color-accent-cyan) / <alpha-value>)',
          violet: 'rgb(var(--color-accent-violet) / <alpha-value>)',
          pink: 'rgb(var(--color-accent-pink) / <alpha-value>)',
          blue: 'rgb(var(--color-accent-blue) / <alpha-value>)',
          gold: '#ffd60a',
        },
        neon: {
          cyan: 'rgb(var(--color-neon-cyan) / <alpha-value>)',
          purple: 'rgb(var(--color-neon-purple) / <alpha-value>)',
          blue: 'rgb(var(--color-neon-blue) / <alpha-value>)',
          green: 'rgb(var(--color-neon-green) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-x': 'gradient-x 3s ease infinite',
        'gradient-y': 'gradient-y 3s ease infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgb(var(--color-accent-cyan)), 0 0 10px rgb(var(--color-accent-cyan)), 0 0 20px rgb(var(--color-accent-cyan))' },
          '100%': { boxShadow: '0 0 10px rgb(var(--color-accent-cyan)), 0 0 20px rgb(var(--color-accent-cyan)), 0 0 40px rgb(var(--color-accent-cyan))' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        'gradient-y': {
          '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'center top' },
          '50%': { 'background-size': '400% 400%', 'background-position': 'center bottom' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #0a0a0f 50%, #12121a 75%, #0a0a0f 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
