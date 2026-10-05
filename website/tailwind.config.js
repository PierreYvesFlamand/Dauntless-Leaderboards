/** @type {import('tailwindcss').Config} */

// Colors are CSS variables (RGB triplets) defined in src/styles.scss,
// redefined per theme on body.light-mode / body.dark-mode.
const token = name => `rgb(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  // Built dynamically in templates (rank-{{rank}})
  safelist: ['rank-1', 'rank-2', 'rank-3'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        line: token('line'),
        fg: token('fg'),
        muted: token('muted'),
        accent: token('accent'),
        'accent-fg': token('accent-fg'),
        chart: token('chart'),
        me: token('me'),
        fav: token('fav'),
        gold: token('gold'),
        silver: token('silver'),
        bronze: token('bronze')
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'Georgia', 'serif']
      },
      boxShadow: {
        card: '0 1px 2px rgb(0 0 0 / 0.12), 0 8px 24px -12px rgb(0 0 0 / 0.25)'
      }
    }
  },
  plugins: []
};
