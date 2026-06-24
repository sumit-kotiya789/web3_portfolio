import { useBlockNumber } from 'wagmi'
import { mainnet, bsc, polygon } from 'wagmi/chains'
import { motion } from 'framer-motion'
import { taaqo, CHAIN_META } from '../lib/wagmi'

const GRID = [mainnet.id, bsc.id, polygon.id, taaqo.id]

function ChainCard({ id, delay }) {
  const meta = CHAIN_META[id]
  const { data: block } = useBlockNumber({ chainId: id, watch: true })

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass"
      style={{ padding: '18px 20px', border: `1px solid ${meta?.color}33`, position: 'relative', overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'absolute', top: -40, right: -40, width: 120, height: 120,
          borderRadius: '50%', background: meta?.color, filter: 'blur(60px)', opacity: 0.16,
        }}
      />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontWeight: 700, fontFamily: 'Sora', fontSize: 15, color: 'var(--text-primary)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: meta?.color, boxShadow: `0 0 10px ${meta?.color}` }} />
            {meta?.label}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{meta?.short}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="live-dot" style={{ width: 7, height: 7, background: meta?.color }} />
          <span style={{ fontSize: 11, letterSpacing: 1.5, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Latest block</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)', lineHeight: 1.2, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {block != null ? `#${block.toLocaleString()}` : '…'}
        </div>
      </div>
    </motion.div>
  )
}

export default function LiveChainStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: 28 }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          color: 'var(--text-muted)', fontFamily: 'JetBrains Mono',
        }}
      >
        <span className="live-dot" style={{ width: 8, height: 8 }} />
        Live multi-chain block height · read on demand
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 14 }}>
        {GRID.map((id, i) => (
          <ChainCard key={id} id={id} delay={i * 0.06} />
        ))}
      </div>
    </motion.div>
  )
}
