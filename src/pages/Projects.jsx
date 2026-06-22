import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ArrowUpRight, Hexagon, Play, X, Loader2 } from 'lucide-react'
import { Section, Heading, Counter } from '../components/ui'
import NodeGraph from '../components/NodeGraph'
import DeployedContracts from '../components/DeployedContracts'

/* Live bridge demos — the real, relayer-backed bridges I built */
const TaaqoWusdtBridge = lazy(() => import('../bridges/TaaqoWusdtBridge'))
const BuyTaaqoBridge   = lazy(() => import('../bridges/BuyTaaqoBridge'))
const UsdtVaultBridge  = lazy(() => import('../bridges/UsdtVaultBridge'))

const DEMOS = {
  wusdt:    { title: 'TAAQO wUSDT Bridge',  Comp: TaaqoWusdtBridge },
  buytaaqo: { title: 'Buy TAAQO (USDT → TAAQO)', Comp: BuyTaaqoBridge },
  vault:    { title: 'USDT Vault Bridge',   Comp: UsdtVaultBridge },
}

function BridgeDemoModal({ demo, onClose }) {
  const entry = demo ? DEMOS[demo] : null
  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            overflowY: 'auto',
            background: 'var(--bg-void)',
          }}
        >
          {/* Close bar */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              background: 'rgba(10,10,15,0.72)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-cyan)', fontFamily: 'JetBrains Mono' }}>
              LIVE DEMO · {entry.title}
            </span>
            <button
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                border: '1px solid var(--border-cyan)',
                background: 'var(--cyan-core)',
                color: '#06231f',
                borderRadius: 10,
                padding: '7px 14px',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <X size={14} /> Close
            </button>
          </div>

          <Suspense
            fallback={
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--cyan-core)' }}>
                <Loader2 size={28} className="animate-spin" />
              </div>
            }
          >
            <entry.Comp />
          </Suspense>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const filters = ['All', 'DeFi', 'Infrastructure', 'Bridges', 'Tokens']

const projects = [
  {
    id: 'taaqo',
    title: 'TAAQO L2 BLOCKCHAIN',
    cat: 'Infrastructure',
    size: 'large',
    badge: { text: 'FLAGSHIP', color: 'var(--gold-premium)' },
    chainId: '5566',
    accent: 'var(--violet-core)',
    desc: 'A fully custom EVM-compatible Layer-2 built on Go-Ethereum, running three independent validator nodes with its own RPC layer and block explorer.',
    stats: ['3 RPCs', '3 Nodes', 'Go-Ethereum', 'EVM Compatible'],
    links: [
      { label: 'taaqo.com', url: 'https://taaqo.com' },
      { label: 'taaqoscan.com', url: 'https://taaqoscan.com' },
    ],
    graph: true,
  },
  {
    id: 'globalstaken',
    title: 'GLOBALSTAKEN PROTOCOL',
    cat: 'DeFi',
    size: 'large',
    badge: { text: 'LIVE', color: 'var(--emerald-live)', pulse: true },
    accent: 'var(--emerald-live)',
    desc: 'A six-tier DeFi staking protocol with Uniswap v3 concentrated liquidity, a ten-level referral engine and eight achievement ranks.',
    stats: ['6 Tiers', 'Uniswap v3 LP', '10-Level Referral', '8 Ranks'],
    tvl: 2.4,
    links: [{ label: 'globalstaken.io', url: 'https://globalstaken.io' }],
  },
  {
    id: 'taaqoscan',
    title: 'TAAQOSCAN EXPLORER',
    cat: 'Infrastructure',
    size: 'medium',
    accent: 'var(--cyan-core)',
    desc: 'Full block explorer for Taaqo L2 — transactions, blocks, validators & contract verification.',
    stats: ['Block Indexer', 'Tx Tracer', 'Contract Verify'],
    links: [{ label: 'taaqoscan.com', url: 'https://taaqoscan.com' }],
  },
  {
    id: 'bridge1',
    title: 'TAAQO wUSDT BRIDGE',
    cat: 'Bridges',
    size: 'medium',
    accent: 'var(--magenta-pop)',
    badge: { text: 'LIVE', color: 'var(--emerald-live)', pulse: true },
    demo: 'wusdt',
    desc: 'Lock-and-mint bridge: deposit BSC-Peg USDT and a relayer mints wUSDT on TAAQO. Burn wUSDT to withdraw back to BSC. Custom-recipient routing + on-chain replay guards.',
    stats: ['BSC ↔ TAAQO', 'Lock & Mint', 'Relayer', 'Deposit / Burn'],
  },
  {
    id: 'bridge2',
    title: 'BUY TAAQO BRIDGE',
    cat: 'Bridges',
    size: 'medium',
    accent: 'var(--violet-bright)',
    badge: { text: 'LIVE', color: 'var(--emerald-live)', pulse: true },
    demo: 'buytaaqo',
    desc: 'On-ramp that converts USDT on BNB Chain into native TAAQO gas. Live on-chain quote, approve + deposit flow, and a relayer that delivers native TAAQO in ~30s.',
    stats: ['USDT → TAAQO', 'Live Quote', '0.10% Fee', 'Relayer'],
  },
  {
    id: 'bridge3',
    title: 'USDT VAULT BRIDGE',
    cat: 'Bridges',
    size: 'large',
    accent: 'var(--cyan-core)',
    gradient: 'var(--grad-ocean)',
    badge: { text: 'LIVE', color: 'var(--emerald-live)', pulse: true },
    demo: 'vault',
    desc: 'Liquidity-vault bridge moving USDT both ways between BSC and TAAQO. Bi-directional flow, vault liquidity tracking, relayer-gas health monitoring and a full owner admin panel (add/remove liquidity, pause, fees, ownership).',
    stats: ['Bi-Directional', 'Vault Liquidity', 'Admin Panel', 'Relayer Health'],
  },
  {
    id: 'arc',
    title: 'ARC TOKEN',
    cat: 'Tokens',
    size: 'small',
    accent: 'var(--gold-premium)',
    desc: 'BSC BEP-20 token with on-chain tokenomics & vesting.',
    stats: ['BSC', 'BEP-20'],
  },
  {
    id: 'evm',
    title: 'EVM CONTRACTS',
    cat: 'DeFi',
    size: 'small',
    accent: 'var(--violet-glow)',
    desc: 'A growing suite of audited-in-spirit Solidity contracts.',
    counter: 10,
  },
]

function ProjectCard({ p, onLaunch }) {
  const span = p.size === 'large' ? 'span 2' : 'span 1'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="proj-card glass"
      style={{
        gridColumn: span,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        minHeight: p.size === 'large' ? 300 : p.size === 'small' ? 200 : 240,
        '--accent': p.accent,
      }}
    >
      {/* accent glow corner */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: p.accent,
          filter: 'blur(60px)',
          opacity: 0.25,
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, position: 'relative' }}>
        <div>
          {p.badge && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                padding: '4px 12px',
                borderRadius: 999,
                background: `${p.badge.color}1a`,
                color: p.badge.color,
                border: `1px solid ${p.badge.color}55`,
                marginBottom: 12,
              }}
            >
              {p.badge.pulse && <span className="live-dot" style={{ width: 7, height: 7 }} />}
              {p.badge.text}
            </span>
          )}
          <h3
            style={{
              fontSize: p.size === 'large' ? 26 : 19,
              fontWeight: 800,
              fontFamily: 'Sora',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          >
            {p.title}
          </h3>
        </div>
        {p.chainId && (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Hexagon size={56} style={{ color: 'var(--violet-core)', fill: 'rgba(45,212,191,0.15)' }} />
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                color: 'var(--violet-glow)',
                fontFamily: 'JetBrains Mono',
              }}
            >
              ID
              <strong style={{ fontSize: 12, color: 'var(--cyan-core)' }}>{p.chainId}</strong>
            </span>
          </div>
        )}
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginTop: 12, maxWidth: 480 }}>
        {p.desc}
      </p>

      {p.counter && (
        <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--gold-premium)', fontFamily: 'Sora', marginTop: 8 }}>
          <Counter to={p.counter} suffix="+" />
        </div>
      )}

      {p.tvl && (
        <div style={{ marginTop: 14 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: 1 }}>TVL</span>
          <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--gold-premium)', fontFamily: 'Sora' }}>
            $<Counter to={p.tvl} suffix="M" />
          </div>
        </div>
      )}

      {p.graph && (
        <div style={{ height: 110, marginTop: 8 }}>
          <NodeGraph height={110} count={4} />
        </div>
      )}

      {p.stats && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {p.stats.map((s) => (
            <span
              key={s}
              style={{
                fontSize: 12,
                padding: '5px 11px',
                borderRadius: 8,
                background: 'var(--glass-white)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-violet)',
                fontFamily: 'JetBrains Mono',
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {p.links && (
        <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
          {p.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="proj-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: 'var(--cyan-core)',
                padding: '7px 14px',
                borderRadius: 999,
                border: '1px solid var(--border-cyan)',
                background: 'var(--glass-cyan)',
                transition: 'all .25s',
              }}
            >
              {l.label} <ExternalLink size={13} />
            </a>
          ))}
        </div>
      )}

      {/* Launch live demo */}
      {p.demo && (
        <button
          onClick={() => onLaunch(p.demo)}
          className="cursor-grow"
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 18,
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            padding: '9px 18px',
            borderRadius: 999,
            border: 'none',
            cursor: 'pointer',
            background: p.accent,
            boxShadow: `0 0 22px -4px ${p.accent}`,
          }}
        >
          <Play size={14} fill="#fff" /> Launch Live Demo
        </button>
      )}

      {/* hover overlay */}
      <div className="proj-overlay">
        <div className="glass" style={{ padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>View Details</span>
          <ArrowUpRight size={16} style={{ color: 'var(--cyan-core)' }} />
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [active, setActive] = useState('All')
  const [demo, setDemo] = useState(null)
  const filtered = active === 'All' ? projects : projects.filter((p) => p.cat === active)

  return (
    <Section style={{ paddingTop: 130 }}>
      <BridgeDemoModal demo={demo} onClose={() => setDemo(null)} />
      <Heading eyebrow="Portfolio" title="BUILT ON CHAIN" sub="Production blockchain systems — a custom L2, live DeFi protocols, cross-chain bridges and tokens." />

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 36 }}>
        {filters.map((f) => (
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
              background: active === f ? 'var(--magenta-pop)' : 'var(--glass-violet)',
              color: active === f ? '#fff' : 'var(--text-violet)',
              boxShadow: active === f ? '0 0 22px rgba(45,212,191,0.45)' : 'none',
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
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: 18,
          gridAutoFlow: 'dense',
        }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <ProjectCard key={p.id} p={p} onLaunch={setDemo} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Deployed & verified contracts */}
      <div style={{ marginTop: 90 }}>
        <Heading
          eyebrow="On BscScan"
          title="DEPLOYED CONTRACTS"
          gradient="text-grad-ocean"
          sub="Live, verified contracts on BNB Smart Chain. Tap a card to see exactly what each one does — with an on-chain flow diagram."
        />
        <DeployedContracts />
      </div>

      <style>{`
        .proj-card {
          transition: transform .35s, box-shadow .35s, border-color .35s;
          border: 1px solid var(--border-subtle);
        }
        .proj-card:hover {
          transform: translateY(-6px);
          border-color: var(--accent);
          box-shadow: 0 10px 40px -10px var(--accent);
        }
        .proj-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: 20px;
          opacity: 0;
          transition: opacity .3s;
          pointer-events: none;
        }
        .proj-card:hover .proj-overlay { opacity: 1; }
        .proj-link:hover {
          box-shadow: 0 0 18px var(--cyan-glow);
          color: var(--cyan-soft);
        }
      `}</style>
    </Section>
  )
}
