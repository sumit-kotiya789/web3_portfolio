import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react'
import { PROFILE } from '../lib/profile'

const nav = [
  ['About', 'about'], ['Work', 'work'], ['Experience', 'experience'],
  ['Stack', 'stack'], ['Open Source', 'opensource'], ['Contact', 'contact'],
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 1, marginTop: 40 }}>
      <div className="divider-grad" />
      <div
        style={{
          maxWidth: 1180, margin: '0 auto',
          padding: 'clamp(3rem, 6vw, 5rem) clamp(1.15rem, 5vw, 4rem) 2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: 40,
        }}
      >
        <div style={{ maxWidth: 360 }}>
          <h3 className="text-grad-premium" style={{ fontFamily: 'Sora', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, lineHeight: 1.1 }}>
            Let's build something<br />that lasts on-chain.
          </h3>
          <a href={`mailto:${PROFILE.email}`} className="footer-mail" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 22, color: 'var(--text-secondary)', fontSize: 15 }}>
            {PROFILE.email} <ArrowUpRight size={15} />
          </a>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <a href={PROFILE.socials.github} target="_blank" rel="noreferrer" className="footer-ico" aria-label="GitHub"><Github size={18} /></a>
            <a href={PROFILE.socials.linkedin} target="_blank" rel="noreferrer" className="footer-ico" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href={`mailto:${PROFILE.email}`} className="footer-ico" aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>

        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>Navigate</div>
          {nav.map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)} className="footer-link">{label}</button>
          ))}
        </div>

        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>On-chain</div>
          <Link to="/wallet" className="footer-link">Web3 Wallet</Link>
          <Link to="/lab" className="footer-link">On-chain Lab</Link>
          <Link to="/projects" className="footer-link">Verified contracts</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, color: 'var(--emerald-soft)', fontSize: 13 }}>
            <span className="live-dot" /> Taaqo L2 · chain 5566
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '1.4rem clamp(1.15rem, 5vw, 4rem)', borderTop: '1px solid var(--border-hair)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, color: 'var(--text-muted)', fontSize: 13 }}>
        <span>© {new Date().getFullYear()} Sumit Kotiya</span>
        <span>Designed & built from first principles · Uttarakhand, India 🇮🇳</span>
      </div>

      <style>{`
        .footer-ico {
          width: 44px; height: 44px; border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          background: var(--glass-bg); border: 1px solid var(--border-violet);
          color: var(--text-primary); transition: transform .3s, border-color .3s, background .3s;
        }
        .footer-ico:hover { transform: translateY(-3px); border-color: var(--border-cyan); background: var(--glass-bg-strong); }
        .footer-link {
          display: block; background: none; border: none; text-align: left;
          color: var(--text-secondary); font-size: 14.5px; padding: 0;
          margin-bottom: 11px; transition: color .2s;
        }
        .footer-link:hover { color: var(--text-primary); }
        .footer-mail:hover { color: var(--text-primary); }
      `}</style>
    </footer>
  )
}
