import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, Play, Boxes, Layers, GitBranch } from 'lucide-react'
import { Section, Heading, Reveal, Counter } from '../components/ui'

const NodeGraph = lazy(() => import('../components/NodeGraph'))

const EASE = [0.16, 1, 0.3, 1]

const showcases = [
  {
    n: '01',
    kind: 'Layer-2 Infrastructure',
    title: 'Taaqo L2',
    accent: '#2de2a6',
    chainId: '5566',
    desc: 'A fully custom EVM-compatible Layer-2 built on Go-Ethereum — three independent validator nodes, a bespoke RPC layer and a full block explorer. The chain I architected, deployed and operate in production.',
    metrics: [{ k: 'Validators', v: '3' }, { k: 'RPC nodes', v: '3' }, { k: 'Chain ID', v: '5566' }],
    tags: ['Go-Ethereum', 'EVM', 'Consensus', 'RPC', 'Explorer'],
    links: [{ label: 'taaqo.com', url: 'https://taaqo.com' }, { label: 'taaqoscan.com', url: 'https://taaqoscan.com' }],
    graph: true,
    icon: Layers,
  },
  {
    n: '02',
    kind: 'DeFi Protocol',
    title: 'GlobalStaken',
    accent: '#14b8a6',
    desc: 'A six-tier staking protocol with Uniswap v3 concentrated liquidity, a ten-level referral engine and eight achievement ranks — economic design and contracts shipped end to end.',
    metrics: [{ k: 'Tiers', v: '6' }, { k: 'Referral levels', v: '10' }, { k: 'TVL', v: '$2.4M' }],
    tags: ['Solidity', 'Uniswap v3', 'Referral engine', 'Staking'],
    links: [{ label: 'globalstaken.io', url: 'https://globalstaken.io' }],
    icon: Boxes,
  },
  {
    n: '03',
    kind: 'Cross-chain Bridges',
    title: 'Three live bridges',
    accent: '#5fd0c0',
    desc: 'Lock-and-mint, on-ramp and liquidity-vault bridges moving value between BNB Chain and Taaqo — relayer-backed, with replay guards, live quotes and a full owner admin panel. All demoable on-chain.',
    metrics: [{ k: 'Bridges', v: '3' }, { k: 'Direction', v: 'Bi' }, { k: 'Settlement', v: '~30s' }],
    tags: ['Relayers', 'Lock & Mint', 'Vault liquidity', 'Replay guards'],
    demo: true,
    icon: GitBranch,
  },
]

function Visual({ s }) {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        minHeight: 'clamp(240px, 30vw, 340px)',
        border: '1px solid var(--border-subtle)',
        background: `radial-gradient(120% 120% at 20% 0%, ${s.accent}26, transparent 55%), linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.005))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* glow */}
      <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: 320, height: 320, borderRadius: '50%', background: s.accent, filter: 'blur(90px)', opacity: 0.22 }} />

      {s.graph ? (
        <div style={{ width: '100%', height: 220, position: 'relative', zIndex: 1 }}>
          <Suspense fallback={null}><NodeGraph height={220} count={5} /></Suspense>
        </div>
      ) : (
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 24 }}>
          <s.icon size={46} style={{ color: s.accent }} strokeWidth={1.3} />
          <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
            {s.metrics.map((m) => (
              <div key={m.k}>
                <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 26, color: 'var(--text-primary)' }}>{m.v}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>{m.k}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {s.chainId && (
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }} className="chip">
          <span className="live-dot" style={{ width: 6, height: 6 }} /> id {s.chainId}
        </div>
      )}
    </div>
  )
}

function Showcase({ s, flip }) {
  return (
    <Reveal y={40}>
      <div
        className="show-row"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(1.6rem, 3.5vw, 3.4rem)',
          alignItems: 'center',
          padding: 'clamp(1.4rem, 3vw, 2.4rem)',
        }}
      >
        <div style={{ order: flip ? 2 : 1 }} className="show-text">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: s.accent, letterSpacing: '0.1em' }}>{s.n}</span>
            <span style={{ fontSize: 12.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{s.kind}</span>
          </div>
          <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', marginTop: 12, letterSpacing: '-0.03em' }}>
            {s.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-body)', lineHeight: 1.7, marginTop: 16, maxWidth: 480 }}>
            {s.desc}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22 }}>
            {s.tags.map((t) => <span key={t} className="chip" style={{ fontFamily: 'JetBrains Mono', fontSize: 11.5 }}>{t}</span>)}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 26 }}>
            {s.links?.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="btn-ghost" style={{ padding: '10px 18px', fontSize: 14 }}>
                {l.label} <ExternalLink size={14} />
              </a>
            ))}
            {s.demo && (
              <Link to="/bridges" className="btn-primary" style={{ padding: '10px 18px', fontSize: 14 }}>
                <Play size={14} fill="currentColor" /> Launch live demos
              </Link>
            )}
          </div>
        </div>

        <div style={{ order: flip ? 1 : 2 }}><Visual s={s} /></div>
      </div>
    </Reveal>
  )
}

export default function WorkSection() {
  return (
    <Section id="work" style={{ paddingTop: 'var(--sp-9)' }}>
      <Heading
        eyebrow="Selected Work"
        title="Production systems, shipped end to end"
        gradient="text-grad-premium"
        sub="Not demos — a live chain, live protocols and live bridges I designed, built and operate."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.4rem, 3vw, 2.4rem)', marginTop: 12 }}>
        {showcases.map((s, i) => (
          <div key={s.title} className="glass show-card">
            <Showcase s={s} flip={i % 2 === 1} />
          </div>
        ))}
      </div>

      <Reveal style={{ textAlign: 'center', marginTop: 44 }}>
        <Link to="/projects" className="btn-ghost">
          See all projects & verified contracts <ArrowUpRight size={17} />
        </Link>
      </Reveal>

      <style>{`
        .show-card { transition: border-color .4s var(--ease), transform .4s var(--ease); }
        .show-card:hover { border-color: var(--border-cyan); transform: translateY(-3px); }
        @media (max-width: 860px) {
          .show-row { grid-template-columns: 1fr !important; }
          .show-text { order: 1 !important; }
          .show-row > div:last-child { order: 2 !important; }
        }
      `}</style>
    </Section>
  )
}
