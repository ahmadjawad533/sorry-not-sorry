/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--color-ink)',
          light: 'var(--color-ink-light)',
          faint: 'var(--color-ink-faint)',
          rich: 'var(--color-ink-rich)',
        },
        paper: {
          DEFAULT: 'var(--color-paper)',
          card: 'var(--color-paper-card)',
          dark: 'var(--color-paper-dark)',
          edge: 'var(--color-paper-edge)',
        },
        manila: {
          DEFAULT: 'var(--color-manila)',
          light: 'var(--color-manila-light)',
          tab: 'var(--color-manila-tab)',
          dark: 'var(--color-manila-dark)',
          shadow: 'var(--color-manila-shadow)',
        },
        evidence: {
          DEFAULT: 'var(--color-evidence-red)',
          stamp: 'var(--color-evidence-stamp)',
          glow: 'var(--color-evidence-glow)',
          bg: 'var(--color-evidence-bg)',
        },
        brass: {
          DEFAULT: 'var(--color-brass)',
          light: 'var(--color-brass-light)',
          dark: 'var(--color-brass-dark)',
        },
        smoke: {
          DEFAULT: 'var(--color-smoke)',
          light: 'var(--color-smoke-light)',
          dark: 'var(--color-smoke-dark)',
          fog: 'var(--color-smoke-fog)',
        },
      },
      fontFamily: {
        typewriter: ['"Special Elite"', '"Courier Prime"', 'Courier', 'monospace'],
        mono: ['"Courier Prime"', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'noir-sm': '0 2px 4px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.6)',
        'noir': '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.8)',
        'noir-lg': '0 20px 35px -10px rgba(0, 0, 0, 0.8), 0 12px 16px -8px rgba(0, 0, 0, 0.9)',
        'folder': '0 15px 30px -5px rgba(10, 8, 6, 0.7), 0 0 0 1px rgba(180, 140, 80, 0.15)',
        'folder-light': '0 10px 25px -5px rgba(80, 60, 40, 0.25), 0 0 0 1px rgba(180, 140, 80, 0.3)',
        'lamp': '0 0 80px 30px rgba(230, 200, 130, 0.08)',
        'stamp': '0 0 15px rgba(190, 30, 30, 0.4)',
      },
      keyframes: {
        stampSlam: {
          '0%': { transform: 'scale(2.5) rotate(-12deg)', opacity: '0' },
          '60%': { transform: 'scale(0.95) rotate(-6deg)', opacity: '1' },
          '80%': { transform: 'scale(1.05) rotate(-8deg)' },
          '100%': { transform: 'scale(1) rotate(-7deg)', opacity: '0.95' },
        },
        screenShake: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(-3px, 2px)' },
          '40%': { transform: 'translate(3px, -2px)' },
          '60%': { transform: 'translate(-2px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '41%': { opacity: '0.92' },
          '42%': { opacity: '0.4' },
          '43%': { opacity: '0.95' },
          '78%': { opacity: '1' },
          '79%': { opacity: '0.6' },
          '80%': { opacity: '1' },
        },
      },
      animation: {
        stamp: 'stampSlam 0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        shake: 'screenShake 0.35s ease-out',
        flicker: 'flicker 6s infinite',
      },
    },
  },
  plugins: [],
};
