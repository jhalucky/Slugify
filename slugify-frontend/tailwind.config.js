/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        purple: {
          DEFAULT: '#9333ea',
          dim: '#7c22d4',
          glow: 'rgba(147,51,234,0.15)',
          faint: 'rgba(147,51,234,0.06)',
        },
        surface: '#0f0f0f',
        border: '#1c1c1c',
        'border-lit': '#2e2e2e',
      },
      backgroundImage: {
        'grid-purple': "linear-gradient(rgba(147,51,234,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '64px 64px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fadeUp 0.6s ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
