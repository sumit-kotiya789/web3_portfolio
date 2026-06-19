/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-void': 'var(--bg-void)',
        'bg-deep': 'var(--bg-deep)',
        'bg-card': 'var(--bg-card)',
        'bg-elevated': 'var(--bg-elevated)',
        'violet-core': 'var(--violet-core)',
        'violet-bright': 'var(--violet-bright)',
        'violet-glow': 'var(--violet-glow)',
        'cyan-core': 'var(--cyan-core)',
        'cyan-soft': 'var(--cyan-soft)',
        'magenta-pop': 'var(--magenta-pop)',
        'magenta-soft': 'var(--magenta-soft)',
        'gold-premium': 'var(--gold-premium)',
        'gold-soft': 'var(--gold-soft)',
        'emerald-live': 'var(--emerald-live)',
        'emerald-soft': 'var(--emerald-soft)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-cyan': 'var(--text-cyan)',
        'text-violet': 'var(--text-violet)',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderColor: {
        subtle: 'var(--border-subtle)',
        violet: 'var(--border-violet)',
        cyan: 'var(--border-cyan)',
      },
    },
  },
  plugins: [],
}
