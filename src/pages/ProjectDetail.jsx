import { lazy, Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ArrowUpRight, ExternalLink, Check, Hexagon,
  Layers, Boxes, Search, GitBranch, Coins, Code2, Trophy, CreditCard, ShoppingCart, Landmark,
} from 'lucide-react'
import { Counter } from '../components/ui'
import { getProject, STATUS_LABEL } from '../lib/projects'

const Scene3D = lazy(() => import('../components/Scene3D'))

const ICONS = { Layers, Boxes, Search, GitBranch, Coins, Code2, Trophy, CreditCard, ShoppingCart, Landmark }
const EASE = [0.16, 1, 0.3, 1]

function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, paddingTop: 120 }}>
      <h1 style={{ fontFamily: 'Sora', fontSize: 28, color: 'var(--text-primary)' }}>Project not found</h1>
      <Link to="/projects" className="btn-ghost"><ArrowLeft size={16} /> Back to projects</Link>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const p = getProject(id)
  if (!p) return <NotFound />

  const Icon = ICONS[p.icon] || Layers
  const status = STATUS_LABEL[p.status] || STATUS_LABEL.live
  const overview = p.overview || [p.desc]

  return (
    <div className="section-wrap" style={{ paddingTop: 120, paddingBottom: 'var(--sp-9)' }}>
      {/* Back */}
      <Link
        to="/projects"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'JetBrains Mono', padding: '8px 14px', borderRadius: 999, border: '1px solid var(--border-violet)', background: 'var(--glass-bg)' }}
      >
        <ArrowLeft size={15} /> All projects
      </Link>

      {/* Hero */}
      <div className="pd-hero">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className="eyebrow" style={{ marginBottom: 0 }}>{p.cat}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, padding: '4px 12px', borderRadius: 999, color: status.color, background: `color-mix(in srgb, ${status.color} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${status.color} 38%, transparent)` }}>
              {p.status === 'live' && <span className="live-dot" style={{ width: 7, height: 7 }} />}
              {status.text}
            </span>
          </div>

          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(2.2rem, 6vw, 4rem)', letterSpacing: '-0.035em', lineHeight: 1.02, marginTop: 18 }}>
            <span className="text-grad-hero">{p.title}</span>
          </h1>
          {p.tagline && (
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-lead)', lineHeight: 1.6, marginTop: 18, maxWidth: 520 }}>{p.tagline}</p>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
            {p.to ? (
              <Link to={p.to} className="btn-primary">{p.cta || 'Open'} <ArrowUpRight size={18} /></Link>
            ) : null}
            {p.links?.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="btn-ghost">
                {l.label} <ExternalLink size={15} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* 3D centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="gradient-border pd-3d"
        >
          <div className="glass" style={{ borderRadius: 'var(--radius)', padding: 8, position: 'relative', overflow: 'hidden' }}>
            <Suspense fallback={<div style={{ height: 'clamp(280px, 34vw, 380px)' }} />}>
              <Scene3D variant={p.variant3d || 'network'} height="clamp(280px, 34vw, 380px)" />
            </Suspense>
            {p.chainId && (
              <div className="chip" style={{ position: 'absolute', top: 16, right: 16 }}>
                <Hexagon size={13} style={{ color: 'var(--blue)' }} /> chain {p.chainId}
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'inline-flex', alignItems: 'center', gap: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: 11.5 }}>
              <Icon size={14} style={{ color: 'var(--blue-soft)' }} /> {p.cat}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Metrics row */}
      {(p.tvl || p.counter || p.chainId) && (
        <div className="pd-metrics">
          {p.chainId && <Metric label="Chain ID" value={<>{p.chainId}</>} />}
          {p.tvl && <Metric label="TVL" value={<>$<Counter to={p.tvl} suffix="M" /></>} />}
          {p.counter && <Metric label="Contracts" value={<Counter to={p.counter} suffix="+" />} />}
          {p.stats?.slice(0, p.chainId ? 2 : 3).map((s) => <Metric key={s} label="Highlight" value={<span style={{ fontSize: 16 }}>{s}</span>} />)}
        </div>
      )}

      {/* Body */}
      <div className="pd-body">
        <div>
          <h2 style={{ fontFamily: 'Sora', fontSize: 'var(--fs-h3)', fontWeight: 700, marginBottom: 18 }}>Overview</h2>
          {overview.map((para, i) => (
            <p key={i} style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-body)', lineHeight: 1.8, marginBottom: 14, maxWidth: 640 }}>{para}</p>
          ))}

          {p.status !== 'live' && (
            <div className="glass" style={{ padding: '16px 20px', marginTop: 22, display: 'flex', alignItems: 'center', gap: 12, borderColor: 'var(--border-cyan)' }}>
              <span className="live-dot" style={{ width: 9, height: 9, background: status.color }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                This one is <strong style={{ color: status.color }}>{status.text.toLowerCase()}</strong> — full write-up, screenshots and links are on the way.
              </span>
            </div>
          )}
        </div>

        <div>
          {p.highlights && (
            <div className="glass" style={{ padding: 24, marginBottom: 18 }}>
              <h3 style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Highlights</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {p.highlights.map((h) => (
                  <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5 }}>
                    <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-cyan)', border: '1px solid var(--border-cyan)' }}>
                      <Check size={12} style={{ color: 'var(--blue-soft)' }} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {p.stats && (
            <div className="glass" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Stack & features</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {p.stats.map((s) => (
                  <span key={s} className="chip" style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .pd-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: clamp(2rem, 4vw, 3.5rem);
          align-items: center;
          margin-top: 30px;
        }
        .pd-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1px;
          background: var(--border-hair);
          border: 1px solid var(--border-hair);
          border-radius: 18px;
          overflow: hidden;
          margin-top: 56px;
        }
        .pd-body {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: clamp(2rem, 4vw, 3.5rem);
          margin-top: 64px;
          align-items: start;
        }
        @media (max-width: 880px) {
          .pd-hero, .pd-body { grid-template-columns: 1fr; }
          .pd-3d { order: -1; }
        }
      `}</style>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div style={{ background: 'var(--bg-card)', padding: '22px 20px' }}>
      <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</div>
      <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 24, color: 'var(--text-primary)', marginTop: 6 }}>{value}</div>
    </div>
  )
}
