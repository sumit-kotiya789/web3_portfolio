import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ArrowUpRight, Hexagon } from 'lucide-react'
import { Section, Heading, Counter } from '../components/ui'
import NodeGraph from '../components/NodeGraph'
import TiltCard from '../components/TiltCard'
import DeployedContracts from '../components/DeployedContracts'
import { PROJECTS, PROJECT_FILTERS, projectHref } from '../lib/projects'

function ProjectCard({ p, onOpen }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className={p.size === 'large' ? 'proj-wide' : undefined}
    >
      <TiltCard
        max={7}
        onClick={() => onOpen(p)}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onOpen(p) }}
        className="proj-card glass cursor-grow"
        style={{
          height: '100%',
          padding: 24,
          position: 'relative',
          overflow: 'hidden',
          minHeight: p.size === 'large' ? 300 : p.size === 'small' ? 200 : 240,
          '--accent': p.accent,
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: p.accent, filter: 'blur(60px)', opacity: 0.25 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, position: 'relative' }}>
          <div>
            {p.badge && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, padding: '4px 12px', borderRadius: 999, background: `color-mix(in srgb, ${p.badge.color} 12%, transparent)`, color: p.badge.color, border: `1px solid color-mix(in srgb, ${p.badge.color} 40%, transparent)`, marginBottom: 12 }}>
                {p.badge.pulse && <span className="live-dot" style={{ width: 7, height: 7 }} />}
                {p.badge.text}
              </span>
            )}
            <h3 style={{ fontSize: p.size === 'large' ? 26 : 19, fontWeight: 800, fontFamily: 'Sora', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {p.title}
            </h3>
          </div>
          {p.chainId && (
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Hexagon size={56} style={{ color: 'var(--blue)', fill: 'color-mix(in srgb, var(--blue) 14%, transparent)' }} />
              <span style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--blue-soft)', fontFamily: 'JetBrains Mono' }}>
                ID<strong style={{ fontSize: 12, color: 'var(--text-cyan)' }}>{p.chainId}</strong>
              </span>
            </div>
          )}
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginTop: 12, maxWidth: 480 }}>{p.desc}</p>

        {p.counter && (
          <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--gold-premium)', fontFamily: 'Sora', marginTop: 8 }}>
            <Counter to={p.counter} suffix="+" />
          </div>
        )}

        {p.tvl && (
          <div style={{ marginTop: 14 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: 1 }}>TVL</span>
            <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--gold-premium)', fontFamily: 'Sora' }}>$<Counter to={p.tvl} suffix="M" /></div>
          </div>
        )}

        {p.graph && (
          <div style={{ height: 110, marginTop: 8 }}><NodeGraph height={110} count={4} /></div>
        )}

        {p.stats && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {p.stats.map((s) => (
              <span key={s} style={{ fontSize: 12, padding: '5px 11px', borderRadius: 8, background: 'var(--glass-white)', border: '1px solid var(--border-subtle)', color: 'var(--text-violet)', fontFamily: 'JetBrains Mono' }}>{s}</span>
            ))}
          </div>
        )}

        {p.links && (
          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            {p.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="proj-link"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-cyan)', padding: '7px 14px', borderRadius: 999, border: '1px solid var(--border-cyan)', background: 'var(--glass-cyan)', transition: 'all .25s' }}>
                {l.label} <ExternalLink size={13} />
              </a>
            ))}
          </div>
        )}

        {/* Open affordance */}
        <div className="proj-overlay">
          <div className="glass" style={{ padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{p.to ? (p.cta || 'Open') : 'View case study'}</span>
            <ArrowUpRight size={16} style={{ color: 'var(--text-cyan)' }} />
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

export default function Projects() {
  const [active, setActive] = useState('All')
  const navigate = useNavigate()
  const filtered = active === 'All' ? PROJECTS : PROJECTS.filter((p) => p.cat === active)
  const open = (p) => navigate(projectHref(p))

  return (
    <Section style={{ paddingTop: 130 }}>
      <Heading eyebrow="Portfolio" title="SELECTED WORK" sub="Production systems across Web3, mobile and the web — a custom L2, live DeFi & bridges, plus apps in fantasy sports, payments and more." />

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 36 }}>
        {PROJECT_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className="cursor-grow"
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              border: active === f ? '1px solid transparent' : '1px solid var(--border-violet)',
              background: active === f ? 'var(--grad-accent)' : 'var(--glass-violet)',
              color: active === f ? '#04130d' : 'var(--text-violet)',
              boxShadow: active === f ? '0 0 22px rgba(45,226,166,0.4)' : 'none',
              transition: 'all .25s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bento grid */}
      <motion.div
        layout
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 18, gridAutoFlow: 'dense' }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => <ProjectCard key={p.id} p={p} onOpen={open} />)}
        </AnimatePresence>
      </motion.div>

      {/* Deployed & verified contracts */}
      <div style={{ marginTop: 90 }}>
        <Heading eyebrow="On BscScan" title="DEPLOYED CONTRACTS" gradient="text-grad-ocean" sub="Live, verified contracts on BNB Smart Chain. Tap a card to see exactly what each one does — with an on-chain flow diagram." />
        <DeployedContracts />
      </div>

      <style>{`
        .proj-wide { grid-column: span 2; }
        @media (max-width: 720px) { .proj-wide { grid-column: auto; } }
        .proj-card {
          transition: transform .35s, box-shadow .35s, border-color .35s;
          border: 1px solid var(--border-subtle);
          cursor: pointer;
        }
        .proj-card:hover {
          transform: translateY(-6px);
          border-color: var(--accent);
          box-shadow: 0 10px 40px -10px var(--accent);
        }
        .proj-overlay {
          position: absolute; inset: 0;
          display: flex; align-items: flex-end; justify-content: flex-end;
          padding: 20px; opacity: 0; transition: opacity .3s; pointer-events: none;
        }
        .proj-card:hover .proj-overlay { opacity: 1; }
        .proj-link:hover { box-shadow: 0 0 18px var(--cyan-glow); color: var(--cyan-soft); }
      `}</style>
    </Section>
  )
}
