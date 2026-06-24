import { useEffect, useMemo, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { motion, AnimatePresence } from 'framer-motion'
import { Boxes, Server, Hash, Activity } from 'lucide-react'
import { taaqo } from '../lib/wagmi'
import { Section } from './ui'

/* Three independent validator nodes, each with its own RPC. */
const NODES = [
  { label: 'rpc.taaqo.com', url: 'https://rpc.taaqo.com' },
  { label: 'rpc2.taaqo.com', url: 'https://rpc2.taaqo.com' },
  { label: 'rpc3.taaqo.com', url: 'https://rpc3.taaqo.com' },
]

const POLL_MS = 10_000 // fetch the latest block every 10s

function Metric({ icon: Icon, label, value, sub, live }) {
  return (
    <div className="glass" style={{ padding: '18px 20px', border: '1px solid var(--border-cyan)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Icon size={16} style={{ color: 'var(--cyan-core)' }} />
        <span style={{ fontSize: 11, letterSpacing: 1.5, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</span>
        {live && <span className="live-dot" style={{ width: 7, height: 7 }} />}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)', lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export default function TaaqoProof() {
  const primary = usePublicClient({ chainId: taaqo.id })
  // One client per node so we can read each RPC's height independently.
  const clients = useMemo(() => NODES.map((n) => createPublicClient({ chain: taaqo, transport: http(n.url) })), [])
  const [nodes, setNodes] = useState(NODES.map((n) => ({ ...n, height: null, ok: null, latency: null })))
  const [blocks, setBlocks] = useState([])
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))

  // Poll all three RPCs every 10s for their current block height + latency.
  useEffect(() => {
    let cancelled = false
    const poll = async () => {
      const results = await Promise.all(
        clients.map(async (c, i) => {
          const t0 = performance.now()
          try {
            const h = await c.getBlockNumber()
            return { ...NODES[i], height: h, ok: true, latency: Math.round(performance.now() - t0) }
          } catch {
            return { ...NODES[i], height: null, ok: false, latency: null }
          }
        }),
      )
      if (!cancelled) setNodes(results)
    }
    poll()
    const id = setInterval(poll, POLL_MS)
    return () => { cancelled = true; clearInterval(id) }
  }, [clients])

  // Highest height across nodes = chain tip.
  const heights = nodes.map((n) => n.height).filter((h) => h != null)
  const latest = heights.length ? heights.reduce((a, b) => (a > b ? a : b)) : null
  const online = nodes.filter((n) => n.ok).length

  // When a new tip appears, pull its timestamp for the recent-blocks feed.
  useEffect(() => {
    if (!latest || !primary) return
    let cancelled = false
    primary
      .getBlock({ blockNumber: latest })
      .then((b) => {
        if (cancelled) return
        setBlocks((prev) => {
          if (prev[0]?.number === b.number) return prev
          return [{ number: b.number, ts: Number(b.timestamp) }, ...prev].slice(0, 5)
        })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [latest, primary])

  // Tick the "age" labels.
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <Section style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
        <span className="live-dot" />
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, fontFamily: 'Sora' }}>
          Taaqo L2 — <span className="text-grad-ocean">live proof</span>
        </h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, maxWidth: 640, marginBottom: 28 }}>
        Not a screenshot. The block height below is polled every 10s from three independent nodes I built and run —{' '}
        <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--cyan-soft)' }}>rpc.taaqo.com</span>,{' '}
        <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--cyan-soft)' }}>rpc2</span> and{' '}
        <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--cyan-soft)' }}>rpc3</span>.
      </p>

      {/* Headline metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 14, marginBottom: 16 }}>
        <Metric icon={Boxes} label="Latest block" live value={latest != null ? `#${latest.toLocaleString()}` : '…'} sub="chain tip" />
        <Metric icon={Hash} label="Chain ID" value="5566" sub="TAAQO · EVM" />
        <Metric icon={Server} label="Nodes online" live value={`${online} / 3`} sub="independent RPCs" />
      </div>

      {/* 3-node panel */}
      <div className="glass" style={{ padding: 20, marginBottom: 16, border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, color: 'var(--text-cyan)' }}>
          <Server size={15} />
          <span style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>Validator nodes</span>
        </div>
        {nodes.map((n) => (
          <div
            key={n.url}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              padding: '11px 0',
              borderBottom: '1px solid var(--border-subtle)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13.5,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <span
                className={n.ok ? 'live-dot' : ''}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: n.ok ? 'var(--emerald-live)' : n.ok === false ? 'var(--magenta-soft)' : 'var(--text-muted)',
                }}
              />
              <span style={{ color: 'var(--text-primary)' }}>{n.label}</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
              <span style={{ color: 'var(--cyan-soft)' }}>{n.height != null ? `#${n.height.toLocaleString()}` : n.ok === false ? 'offline' : '…'}</span>
              <span style={{ color: 'var(--text-muted)', minWidth: 64, textAlign: 'right' }}>{n.latency != null ? `${n.latency}ms` : '—'}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Recent blocks (number + age only) */}
      <div className="glass" style={{ padding: 20, border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, color: 'var(--text-cyan)' }}>
          <Activity size={15} />
          <span style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>Recent blocks</span>
        </div>
        <AnimatePresence initial={false}>
          {blocks.map((b) => (
            <motion.div
              key={b.number.toString()}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '10px 0',
                borderBottom: '1px solid var(--border-subtle)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 13.5,
              }}
            >
              <span style={{ color: 'var(--cyan-soft)' }}>#{b.number.toLocaleString()}</span>
              <span style={{ color: 'var(--text-muted)' }}>{Math.max(0, now - b.ts)}s ago</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {blocks.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'JetBrains Mono' }}>Connecting to the Taaqo nodes…</div>
        )}
      </div>
    </Section>
  )
}
