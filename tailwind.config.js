/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        orbitron: ['Orbitron', 'monospace'],
        share: ['"Share Tech Mono"', 'monospace'],
      },
      colors: {
        green: {
          DEFAULT: '#00ff41',
          dim: '#00cc33',
          dark: '#003311',
          faint: 'rgba(0,255,65,0.06)',
          glow: 'rgba(0,255,65,0.3)',
        },
        bg: {
          DEFAULT: '#050a05',
          2: '#080f08',
          3: '#0a140a',
        },
        terminal: '#c8ffc8',
        muted: '#5a8a5a',
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s infinite',
        'blink': 'blink 1s step-end infinite',
        'fadeIn': 'fadeIn 0.5s ease both',
      },
      keyframes: {
        'pulse-dot': {
          '0%,100%': { opacity: '1', boxShadow: '0 0 4px #00ff41' },
          '50%': { opacity: '0.4', boxShadow: 'none' },
        },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        fadeIn: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
