import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import WalletPill from './WalletPill'
import ThemeToggle from './ThemeToggle'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/wallet', label: 'Wallet' },
  { to: '/lab', label: 'Lab' },
  { to: '/contact', label: 'Contact' },
]

function HexLogo() {
  return (
    <div style={{ position: 'relative', width: 40, height: 44 }}>
      <div
        className="hex"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--grad-premium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 18px rgba(45,212,191,0.5)',
        }}
      >
        <span
          style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 800,
            fontSize: 15,
            color: '#08080c',
          }}
        >
          SK
        </span>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9000,
          background: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg-top)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
          transition: 'background .3s, border-color .3s',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0.8rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <HexLogo />
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
                SUMIT KOTIYA
              </div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text-secondary)', marginTop: 3 }}>
                BLOCKCHAIN DEV
              </div>
            </div>
          </NavLink>

          {/* Desktop links */}
          <div className="nav-links">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className="nav-link">
                {({ isActive }) => (
                  <span className={isActive ? 'nav-link-text active' : 'nav-link-text'}>{l.label}</span>
                )}
              </NavLink>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ThemeToggle />
            <div className="nav-wallet-desktop">
              <WalletPill />
            </div>
            <button
              className="nav-burger"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              style={{
                background: 'var(--glass-violet)',
                border: '1px solid var(--border-violet)',
                borderRadius: 12,
                padding: 8,
                color: 'var(--text-cyan)',
                display: 'none',
              }}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 90% 5%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 90% 5%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 90% 5%)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 8999,
              background: 'rgba(3,1,10,0.96)',
              backdropFilter: 'blur(24px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
            }}
          >
            {links.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
              >
                <NavLink
                  to={l.to}
                  className="nav-link"
                  style={{ fontSize: 30, fontFamily: 'Sora', fontWeight: 600 }}
                >
                  {({ isActive }) => (
                    <span className={isActive ? 'nav-link-text active' : 'nav-link-text'}>{l.label}</span>
                  )}
                </NavLink>
              </motion.div>
            ))}
            <div style={{ marginTop: 16 }}>
              <WalletPill />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-links { display: flex; align-items: center; gap: 30px; }
        .nav-link-text {
          position: relative;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 15px;
          transition: color .25s;
          padding-bottom: 4px;
        }
        .nav-link-text::after {
          content: '';
          position: absolute;
          left: 0; bottom: 0;
          width: 0; height: 2px;
          background: var(--cyan-core);
          box-shadow: 0 0 10px var(--cyan-core);
          transition: width .3s;
        }
        .nav-link-text:hover { color: var(--text-cyan); }
        .nav-link-text:hover::after { width: 100%; }
        .nav-link-text.active { color: var(--text-cyan); }
        .nav-link-text.active::after { width: 100%; }

        @media (max-width: 920px) {
          .nav-links { display: none; }
          .nav-wallet-desktop { display: none; }
          .nav-burger { display: inline-flex !important; }
        }
      `}</style>
    </>
  )
}
