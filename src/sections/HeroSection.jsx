import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, FileDown, Sparkles } from 'lucide-react'
import { Counter, Magnetic } from '../components/ui'
import { PROFILE } from '../lib/profile'

const Hero3D = lazy(() => import('../components/Hero3D'))

const EASE = [0.16, 1, 0.3, 1]
const rise = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: (i = 0) => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, delay: 0.15 + i * 0.09, ease: EASE } }),
}

const stats = [
  { v: 1, s: '', label: 'Custom L2 chain' },
  { v: 3, s: '', label: 'Live bridges' },
  { v: 10, s: '+', label: 'EVM contracts' },
  { v: 3, s: '', label: 'Validator nodes' },
]

const ticker = ['Solidity', 'Go-Ethereum', 'EVM', 'L2 Architecture', 'DeFi', 'Cross-chain Bridges', 'Validators', 'Wagmi · Viem', 'Uniswap v3', 'Consensus']

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(7rem, 13vh, 9.5rem) clamp(1.15rem, 5vw, 4rem) 0',
      }}
    >
      {/* Editorial side-rail — vertical mono label */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
        className="hero-rail"
        aria-hidden
      >
        <span>PORTFOLIO</span>
        <span className="hero-rail-line" />
        <span>EST. 2024</span>
      </motion.div>

      <div
        style={{
          width: '100%',
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.12fr) minmax(0, 0.88fr)',
          gap: 'clamp(2rem, 4vw, 4rem)',
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        {/* LEFT — editorial copy */}
        <div>
          <motion.div
            variants={rise} initial="hidden" animate="show" custom={0}
            className="chip"
            style={{ borderColor: 'var(--border-cyan)', background: 'var(--glass-cyan)' }}
          >
            <span className="live-dot" />
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', fontSize: 12.5, letterSpacing: '0.04em' }}>
              Available for senior Web3 roles
            </span>
          </motion.div>

          <motion.div variants={rise} initial="hidden" animate="show" custom={1} className="eyebrow" style={{ marginTop: 26 }}>
            Blockchain Engineer · L2 Architect
          </motion.div>

          {/* Oversized editorial name */}
          <h1 style={{ marginTop: 14, maxWidth: '100%' }}>
            <motion.span
              variants={rise} initial="hidden" animate="show" custom={2}
              className="text-grad-hero hero-name"
              style={{ display: 'block' }}
            >
              Sumit
            </motion.span>
            <motion.span
              variants={rise} initial="hidden" animate="show" custom={2.6}
              className="hero-name hero-name-outline"
              style={{ display: 'block' }}
            >
              Kotiya
            </motion.span>
          </h1>

          <motion.p
            variants={rise} initial="hidden" animate="show" custom={3.4}
            style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-lead)', lineHeight: 1.6, marginTop: 26, maxWidth: 520 }}
          >
            I design and run <span style={{ color: 'var(--text-primary)' }}>custom Layer-2 infrastructure</span>,
            DeFi protocols and cross-chain bridges — from the Solidity up to the validators that secure them.
          </motion.p>

          <motion.div
            variants={rise} initial="hidden" animate="show" custom={4}
            style={{ display: 'flex', gap: 14, marginTop: 34, flexWrap: 'wrap' }}
          >
            <Magnetic strength={0.4}>
              <button className="btn-primary" onClick={() => scrollTo('work')}>
                View selected work <ArrowUpRight size={18} />
              </button>
            </Magnetic>
            <Magnetic strength={0.4}>
              <a className="btn-ghost" href={PROFILE.resumeUrl} download target="_blank" rel="noreferrer">
                <FileDown size={17} /> Résumé
              </a>
            </Magnetic>
          </motion.div>

          {/* Stats — editorial with hairline dividers */}
          <motion.div
            variants={rise} initial="hidden" animate="show" custom={5}
            className="hero-stats"
          >
            {stats.map((s) => (
              <div key={s.label} className="hero-stat">
                <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)', color: 'var(--text-primary)' }}>
                  <Counter to={s.v} suffix={s.s} />
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — 3D + live proof */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
          style={{ position: 'relative' }}
          className="hero-visual"
        >
          <Suspense fallback={<div style={{ height: 'clamp(320px, 42vw, 460px)' }} />}>
            <Hero3D height="clamp(320px, 42vw, 460px)" />
          </Suspense>

          {/* Floating live-proof card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            className="glass float-anim"
            style={{
              position: 'absolute', bottom: 6, left: -6,
              padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
              maxWidth: 'min(82%, 320px)',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-cyan)', border: '1px solid var(--border-cyan)' }}>
              <Sparkles size={18} style={{ color: 'var(--blue-soft)' }} />
            </div>
            {/* <div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>Taaqo L2 · chain 5566</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span className="live-dot" style={{ width: 6, height: 6 }} /> Live · 3 nodes · EVM
              </div>
            </div> */}
          </motion.div>
        </motion.div>
      </div>

      {/* Tech marquee strip — editorial ticker */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }}
        className="hero-marquee"
        aria-hidden
      >
        <div className="hero-marquee-track">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="hero-marquee-item">
              <span className="hero-marquee-dot" /> {t}
            </span>
          ))}
        </div>
      </motion.div>

      <style>{`
        .hero-name {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: clamp(3.2rem, 11vw, 9rem);
          line-height: 0.9;
          letter-spacing: -0.04em;
        }
        .hero-name-outline {
          color: transparent;
          -webkit-text-stroke: 1.4px var(--border-cyan);
          text-stroke: 1.4px var(--border-cyan);
        }
        .hero-rail {
          position: absolute;
          left: clamp(0.7rem, 2.2vw, 1.8rem);
          top: 50%;
          transform: translateY(-50%) rotate(180deg);
          writing-mode: vertical-rl;
          display: flex; align-items: center; gap: 18px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: 0.32em;
          color: var(--text-muted);
          z-index: 2;
        }
        .hero-rail-line { width: 1px; height: 60px; background: linear-gradient(var(--border-cyan), transparent); }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(4, auto);
          gap: clamp(1.2rem, 3vw, 2.6rem);
          margin-top: 52px;
        }
        .hero-stat { position: relative; padding-left: clamp(1.2rem, 3vw, 2.6rem); }
        .hero-stat:first-child { padding-left: 0; }
        .hero-stat:not(:first-child)::before {
          content: ''; position: absolute; left: 0; top: 6px; bottom: 6px; width: 1px;
          background: var(--border-subtle);
        }

        .hero-marquee {
          max-width: 1240px;
          margin: clamp(3rem, 7vh, 5.5rem) auto 0;
          width: 100%;
          overflow: hidden;
          position: relative;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
          padding: 16px 0;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .hero-marquee-track {
          display: inline-flex; align-items: center; gap: 0;
          white-space: nowrap;
          animation: marquee 32s linear infinite;
        }
        .hero-marquee-item {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px; letter-spacing: 0.06em;
          color: var(--text-secondary);
          padding: 0 clamp(1.4rem, 3vw, 2.6rem);
        }
        .hero-marquee-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--blue); box-shadow: 0 0 8px var(--blue); }

        @media (max-width: 1100px) { .hero-rail { display: none; } }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { order: -1; }
        }
        @media (max-width: 520px) {
          .hero-stats { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .hero-stat { padding-left: 0; }
          .hero-stat::before { display: none !important; }
        }
      `}</style>
    </section>
  )
}
