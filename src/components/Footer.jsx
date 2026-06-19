import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail } from 'lucide-react'

const chains = ['Ethereum', 'BSC', 'Polygon', 'Taaqo', 'Tron']

export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'var(--bg-deep)',
        borderTop: '1px solid transparent',
        borderImage: 'var(--grad-violet) 1',
        marginTop: 80,
        paddingTop: 1,
      }}
    >
      <div style={{ height: 1, background: 'var(--grad-violet)' }} />
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '3rem 1.5rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 32,
        }}
      >
        <div>
          <h3 className="text-grad-premium" style={{ fontSize: 24, fontWeight: 800 }}>
            Built on the blockchain.
          </h3>
          <p className="text-grad-premium" style={{ fontSize: 24, fontWeight: 800, marginTop: 2 }}>
            Designed for the future.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginTop: 16, maxWidth: 320, lineHeight: 1.6 }}>
            Sumit Kotiya — Blockchain Developer crafting custom L2 infrastructure, DeFi protocols and
            cross-chain bridges.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-cyan)', fontSize: 13, letterSpacing: 2, marginBottom: 14 }}>
            NAVIGATE
          </h4>
          {['Home:/', 'About:/about', 'Projects:/projects', 'Skills:/skills', 'Wallet:/wallet', 'Contact:/contact'].map(
            (l) => {
              const [label, to] = l.split(':')
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: 'block',
                    color: 'var(--text-secondary)',
                    marginBottom: 9,
                    fontSize: 14,
                    transition: 'color .2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan-soft)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {label}
                </Link>
              )
            }
          )}
        </div>

        <div>
          <h4 style={{ color: 'var(--text-cyan)', fontSize: 13, letterSpacing: 2, marginBottom: 14 }}>
            CONNECT
          </h4>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-ico social-violet">
              <Github size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-ico social-cyan">
              <Linkedin size={18} />
            </a>
            <a href="mailto:hello@sumitkotiya.dev" className="social-ico social-magenta">
              <Mail size={18} />
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--emerald-live)', fontSize: 13 }}>
            <span className="live-dot" /> Open to opportunities
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 10 }}>Uttarakhand, India 🇮🇳</p>
        </div>
      </div>

      {/* chain logos row */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 22,
          opacity: 0.6,
        }}
      >
        {chains.map((c) => (
          <span
            key={c}
            style={{ color: 'var(--text-violet)', fontSize: 13, fontFamily: 'JetBrains Mono', letterSpacing: 1 }}
          >
            ◆ {c}
          </span>
        ))}
      </div>

      <div className="divider-grad" style={{ margin: '24px 0 0' }} />
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '1.2rem 1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: 13,
        }}
      >
        © {new Date().getFullYear()} Sumit Kotiya · All rights reserved · Crafted with ⚡ on-chain
      </div>

      <style>{`
        .social-ico {
          width: 42px; height: 42px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 12px;
          background: var(--glass-violet);
          transition: all .3s;
        }
        .social-violet { color: var(--violet-glow); border: 1px solid var(--border-violet); }
        .social-violet:hover { box-shadow: 0 0 22px rgba(45,212,191,.5); transform: translateY(-3px); }
        .social-cyan { color: var(--cyan-core); border: 1px solid var(--border-cyan); }
        .social-cyan:hover { box-shadow: 0 0 22px rgba(45,212,191,.5); transform: translateY(-3px); }
        .social-magenta { color: var(--magenta-pop); border: 1px solid rgba(45,212,191,.35); }
        .social-magenta:hover { box-shadow: 0 0 22px rgba(45,212,191,.5); transform: translateY(-3px); }
      `}</style>
    </footer>
  )
}
