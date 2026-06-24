import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import WalletPill from './WalletPill'
import ThemeToggle from './ThemeToggle'

const sections = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
]

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <div style={{ position: 'relative', width: 36, height: 36 }}>
        <div
          className="hex"
          style={{
            position: 'absolute', inset: 0,
            background: 'var(--grad-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 22px -8px rgba(45,226,166,0.6)',
          }}
        >
          <span style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 14, color: '#04130d' }}>SK</span>
        </div>
      </div>
      <div style={{ lineHeight: 1.05 }}>
        <div className="nav-brand-name" style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Sumit Kotiya
        </div>
        <div className="nav-brand-sub" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--text-muted)', marginTop: 3, textTransform: 'uppercase' }}>
          Blockchain Engineer
        </div>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const go = (id) => {
    setOpen(false)
    if (pathname !== '/') {
      navigate('/')
      setTimeout(() => scrollTo(id), 90)
    } else {
      scrollTo(id)
    }
  }

  return (
    <>
      {/* Scroll progress */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 9100,
          transformOrigin: '0%', scaleX: progress,
          background: 'var(--grad-accent)',
        }}
      />

      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000, padding: '14px 0' }}
      >
        <div
          className="nav-shell"
          style={{
            maxWidth: scrolled ? 940 : 1180,
            margin: '0 auto',
            padding: scrolled ? '10px 14px 10px 18px' : '8px 10px 8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            borderRadius: 999,
            background: scrolled ? 'var(--nav-bg-scrolled)' : 'transparent',
            border: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
            backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
            boxShadow: scrolled ? '0 18px 50px -24px rgba(0,0,0,0.8)' : 'none',
            transition: 'max-width .5s var(--ease), background .4s, border-color .4s, box-shadow .4s, padding .4s',
          }}
        >
          <Link to="/" onClick={(e) => { if (pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}>
            <Logo />
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            {sections.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} className="nav-link-text">
                {l.label}
              </button>
            ))}
            <Link to="/lab" className="nav-link-text" style={{ color: 'var(--text-cyan)' }}>Lab</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle />
            <div className="nav-wallet-desktop"><WalletPill /></div>
            <button
              className="nav-burger"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              style={{
                display: 'none',
                background: 'var(--glass-bg)',
                border: '1px solid var(--border-violet)',
                borderRadius: 12, padding: 9, color: 'var(--text-primary)',
              }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 8999,
              background: 'rgba(4,8,7,0.94)',
              backdropFilter: 'blur(26px)', WebkitBackdropFilter: 'blur(26px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
            }}
          >
            {sections.map((l, i) => (
              <motion.button
                key={l.id}
                onClick={() => go(l.id)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06 }}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontFamily: 'Sora', fontWeight: 600, fontSize: 30, letterSpacing: '-0.02em' }}
              >
                {l.label}
              </motion.button>
            ))}
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + sections.length * 0.06 }}>
              <Link to="/lab" style={{ color: 'var(--text-cyan)', fontFamily: 'Sora', fontWeight: 600, fontSize: 30 }}>Lab</Link>
            </motion.div>
            <div style={{ marginTop: 18 }}><WalletPill /></div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link-text {
          position: relative;
          background: none; border: none;
          color: var(--text-secondary);
          font-family: 'Inter', sans-serif;
          font-weight: 500; font-size: 14.5px;
          padding: 8px 14px; border-radius: 999px;
          transition: color .25s, background .25s;
        }
        .nav-link-text:hover { color: var(--text-primary); background: var(--glass-white); }

        @media (max-width: 940px) {
          .nav-links { display: none; }
          .nav-wallet-desktop { display: none; }
          .nav-burger { display: inline-flex !important; }
          .nav-shell { max-width: none !important; }
        }
        @media (max-width: 400px) {
          .nav-brand-sub { display: none; }
        }
      `}</style>
    </>
  )
}
