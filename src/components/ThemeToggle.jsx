import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'

/* Persists to localStorage and flips the data-theme attribute on <html>.
   The CSS variable overrides in index.css do the rest. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => (typeof window !== 'undefined' && localStorage.getItem('theme')) || 'dark',
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="cursor-grow"
      style={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        background: 'var(--glass-violet)',
        border: '1px solid var(--border-violet)',
        color: 'var(--text-cyan)',
        cursor: 'none',
        transition: 'border-color .25s, box-shadow .25s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--cyan-core)'
        e.currentTarget.style.boxShadow = '0 0 18px var(--cyan-glow)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-violet)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'inline-flex' }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </motion.span>
    </button>
  )
}
