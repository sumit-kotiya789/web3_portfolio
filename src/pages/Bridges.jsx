import { useState, lazy, Suspense } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader2, GitBranch, ArrowRightLeft, Vault } from 'lucide-react'

/* The real, relayer-backed bridges. Rendered one at a time in a dark
   "trading console" surface that stays dark in both site themes. */
const TaaqoWusdtBridge = lazy(() => import('../bridges/TaaqoWusdtBridge'))
const BuyTaaqoBridge = lazy(() => import('../bridges/BuyTaaqoBridge'))
const UsdtVaultBridge = lazy(() => import('../bridges/UsdtVaultBridge'))

const BRIDGES = [
  { id: 'wusdt', label: 'wUSDT Bridge', sub: 'Lock & mint', icon: GitBranch, Comp: TaaqoWusdtBridge,
    desc: 'Deposit BSC-Peg USDT and a relayer mints wUSDT on TAAQO. Burn to withdraw back to BSC.' },
  { id: 'buytaaqo', label: 'Buy TAAQO', sub: 'USDT → TAAQO', icon: ArrowRightLeft, Comp: BuyTaaqoBridge,
    desc: 'On-ramp that converts USDT on BNB Chain into native TAAQO gas, delivered in ~30s.' },
  { id: 'vault', label: 'USDT Vault', sub: 'Bi-directional', icon: Vault, Comp: UsdtVaultBridge,
    desc: 'Liquidity-vault bridge moving USDT both ways between BSC and TAAQO, with an owner admin panel.' },
]

export default function Bridges() {
  const [params, setParams] = useSearchParams()
  const initial = BRIDGES.some((b) => b.id === params.get('b')) ? params.get('b') : 'wusdt'
  const [active, setActive] = useState(initial)
  const current = BRIDGES.find((b) => b.id === active)
  const Comp = current.Comp

  const select = (id) => {
    setActive(id)
    setParams({ b: id }, { replace: true })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(130% 100% at 50% -8%, #0a1512 0%, #05080b 55%, #03060a 100%)',
        colorScheme: 'dark',
        paddingTop: 96,
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2.5rem) 80px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
          <Link
            to="/projects"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#8fb3a8', fontSize: 14, fontFamily: 'JetBrains Mono', padding: '8px 14px', borderRadius: 999, border: '1px solid rgba(45,226,166,0.2)', background: 'rgba(45,226,166,0.06)' }}
          >
            <ArrowLeft size={15} /> Back to projects
          </Link>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono', fontSize: 12.5, color: '#2de2a6', letterSpacing: '0.12em' }}>
            <span className="live-dot" style={{ width: 7, height: 7 }} /> LIVE BRIDGE CONSOLE
          </span>
        </div>

        <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', letterSpacing: '-0.03em', color: '#e9fff7', marginTop: 18 }}>
          Cross-Chain Bridges
        </h1>
        <p style={{ color: '#8fb3a8', fontSize: 16, lineHeight: 1.6, marginTop: 12, maxWidth: 640 }}>
          Three real, relayer-backed bridges between BNB Chain and TAAQO. Pick one to run it live —
          connect a wallet and move value across chains.
        </p>

        {/* Selector */}
        <div className="bridge-selector">
          {BRIDGES.map((b) => {
            const on = b.id === active
            return (
              <button
                key={b.id}
                onClick={() => select(b.id)}
                className="bridge-tab"
                data-on={on}
                style={{
                  borderColor: on ? 'rgba(45,226,166,0.55)' : 'rgba(255,255,255,0.08)',
                  background: on ? 'linear-gradient(160deg, rgba(45,226,166,0.14), rgba(20,184,166,0.04))' : 'rgba(255,255,255,0.02)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? '#2de2a6' : 'rgba(255,255,255,0.05)', color: on ? '#04130d' : '#8fb3a8', flexShrink: 0, transition: 'all .25s' }}>
                    <b.icon size={18} />
                  </span>
                  <span style={{ textAlign: 'left' }}>
                    <span style={{ display: 'block', fontFamily: 'Sora', fontWeight: 700, fontSize: 15, color: on ? '#e9fff7' : '#c3d6cf' }}>{b.label}</span>
                    <span style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: 11.5, color: '#6f9085', marginTop: 2 }}>{b.sub}</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <p style={{ color: '#6f9085', fontSize: 13.5, fontFamily: 'JetBrains Mono', margin: '14px 2px 0' }}>{current.desc}</p>

        {/* Active bridge */}
        <div
          style={{
            marginTop: 26,
            borderRadius: 22,
            border: '1px solid rgba(45,226,166,0.16)',
            background: 'rgba(4,9,8,0.55)',
            overflow: 'hidden',
            minHeight: 420,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Suspense
                fallback={
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 420, color: '#2de2a6' }}>
                    <Loader2 size={28} className="animate-spin" />
                  </div>
                }
              >
                <Comp />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .bridge-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 34px;
        }
        .bridge-tab {
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid;
          cursor: pointer;
          transition: border-color .25s, background .25s, transform .25s;
        }
        .bridge-tab:hover { transform: translateY(-2px); }
        @media (max-width: 720px) {
          .bridge-selector { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
