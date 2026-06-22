import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FileCode2, ExternalLink, Copy, Check, X, ShieldCheck, Zap, Radio, ArrowUpRight,
} from 'lucide-react'
import { CONTRACTS } from '../lib/contracts'
import FlowDiagram from './FlowDiagram'
import SolidityCode from './SolidityCode'

function short(addr) {
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`
}

function LaminatedCard({ c, onOpen }) {
  return (
    <motion.button
      onClick={() => onOpen(c)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      className="laminate cursor-grow"
      style={{ '--accent': c.accent, textAlign: 'left', cursor: 'none' }}
    >
      {/* laminated sheen */}
      <span className="laminate-sheen" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: '5px 11px',
              borderRadius: 999, background: `${c.chainColor}1a`, color: c.chainColor,
              border: `1px solid ${c.chainColor}55`,
            }}
          >
            <Radio size={12} /> {c.chain}
          </span>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: '5px 11px',
              borderRadius: 999, background: 'rgba(45,212,191,0.14)', color: 'var(--emerald-live)',
              border: '1px solid var(--border-cyan)',
            }}
          >
            <ShieldCheck size={12} /> VERIFIED
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div
            style={{
              width: 46, height: 46, borderRadius: 13, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${c.accent}1f`, border: `1px solid ${c.accent}66`, color: c.accent,
            }}
          >
            <FileCode2 size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Sora', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {c.name}
            </h3>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{c.kind} · {c.compiler}</div>
          </div>
        </div>

        <code style={{ fontSize: 12, color: 'var(--text-cyan)', fontFamily: 'JetBrains Mono' }}>{short(c.address)}</code>

        <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.6, marginTop: 12 }}>
          {c.summary.length > 130 ? c.summary.slice(0, 130) + '…' : c.summary}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 14 }}>
          {c.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 11.5, padding: '4px 10px', borderRadius: 8,
                background: 'var(--glass-white)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-violet)', fontFamily: 'JetBrains Mono',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 16, color: c.accent, fontSize: 13, fontWeight: 700 }}>
          <Zap size={14} /> See how it works <ArrowUpRight size={15} />
        </div>
      </div>
    </motion.button>
  )
}

function ContractModal({ c, onClose }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(c.address)
    setCopied(true)
    toast.success('Address copied')
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <AnimatePresence>
      {c && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(3,1,10,0.62)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '6vh 16px', overflowY: 'auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass"
            style={{
              width: 'min(880px, 100%)', padding: 0, overflow: 'hidden',
              border: `1px solid ${c.accent}55`,
            }}
          >
            {/* Header */}
            <div
              style={{
                position: 'sticky', top: 0, zIndex: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '16px 22px', borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${c.accent}1f`, border: `1px solid ${c.accent}66`, color: c.accent,
                  }}
                >
                  <FileCode2 size={20} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Sora', color: 'var(--text-primary)' }}>{c.name}</h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.kind} · {c.chain}</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="cursor-grow"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
                  border: '1px solid var(--border-cyan)', background: 'var(--glass-cyan)',
                  color: 'var(--text-cyan)', borderRadius: 10, padding: '7px 12px',
                  fontSize: 13, fontWeight: 700, cursor: 'none',
                }}
              >
                <X size={14} /> Close
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Address bar */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
                  padding: '10px 14px', borderRadius: 12,
                  background: 'var(--glass-white)', border: '1px solid var(--border-subtle)', marginBottom: 20,
                }}
              >
                <code style={{ fontSize: 12.5, color: 'var(--text-cyan)', fontFamily: 'JetBrains Mono', wordBreak: 'break-all', flex: '1 1 240px' }}>
                  {c.address}
                </code>
                <button onClick={copy} className="cursor-grow" style={{ background: 'none', border: 'none', color: 'var(--cyan-core)', cursor: 'none', display: 'inline-flex' }}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <a href={c.explorer} target="_blank" rel="noreferrer" className="cursor-grow" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-cyan)' }}>
                  BscScan <ExternalLink size={13} />
                </a>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.75, marginBottom: 24 }}>
                {c.summary}
              </p>

              {/* Two columns: walkthrough + diagram */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 26, alignItems: 'start' }}>
                <div>
                  <h4 style={{ fontSize: 12, letterSpacing: 2, color: 'var(--text-cyan)', marginBottom: 14 }}>WHAT HAPPENS, STEP BY STEP</h4>
                  <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {c.steps.map((s, i) => (
                      <li key={i} style={{ display: 'flex', gap: 12 }}>
                        <span
                          style={{
                            width: 24, height: 24, flexShrink: 0, borderRadius: 7,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: `${c.accent}22`, color: c.accent, border: `1px solid ${c.accent}55`,
                            fontSize: 12, fontWeight: 800, fontFamily: 'JetBrains Mono',
                          }}
                        >
                          {i + 1}
                        </span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.6 }}>{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 style={{ fontSize: 12, letterSpacing: 2, color: 'var(--text-cyan)', marginBottom: 14 }}>ON-CHAIN FLOW</h4>
                  <FlowDiagram flow={c.flow} />
                </div>
              </div>

              {/* Stats (token) */}
              {c.stats && (
                <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', marginTop: 24 }}>
                  {c.stats.map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>{k.toUpperCase()}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gold-premium)', fontFamily: 'Sora' }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Functions + events */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22, marginTop: 26 }}>
                <div>
                  <h4 style={{ fontSize: 12, letterSpacing: 2, color: 'var(--text-cyan)', marginBottom: 12 }}>KEY FUNCTIONS</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {c.functions.map((f) => (
                      <code key={f} style={{ fontSize: 11.5, padding: '4px 9px', borderRadius: 7, background: 'var(--glass-white)', border: '1px solid var(--border-subtle)', color: 'var(--text-violet)', fontFamily: 'JetBrains Mono' }}>
                        {f}()
                      </code>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: 12, letterSpacing: 2, color: 'var(--text-cyan)', marginBottom: 12 }}>EVENTS</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {c.events.map((e) => (
                      <code key={e} style={{ fontSize: 11.5, padding: '4px 9px', borderRadius: 7, background: 'rgba(45,212,191,0.10)', border: '1px solid var(--border-cyan)', color: 'var(--cyan-soft)', fontFamily: 'JetBrains Mono' }}>
                        {e}
                      </code>
                    ))}
                  </div>
                </div>
              </div>

              {/* Security */}
              {c.security && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ fontSize: 12, letterSpacing: 2, color: 'var(--text-cyan)', marginBottom: 12 }}>SAFETY MEASURES</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {c.security.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.55 }}>
                        <ShieldCheck size={15} style={{ color: 'var(--emerald-live)', flexShrink: 0, marginTop: 2 }} /> {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Laminated, verified Solidity source */}
              {c.source && (
                <div style={{ marginTop: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                    <h4 style={{ fontSize: 12, letterSpacing: 2, color: 'var(--text-cyan)' }}>VERIFIED SOLIDITY SOURCE</h4>
                    <a href={c.explorer} target="_blank" rel="noreferrer" className="cursor-grow" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-cyan)' }}>
                      Verify on BscScan <ExternalLink size={13} />
                    </a>
                  </div>
                  <SolidityCode source={c.source} file={c.file} compiler={c.compiler} accent={c.accent} />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function DeployedContracts() {
  const [open, setOpen] = useState(null)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 20 }}>
        {CONTRACTS.map((c) => (
          <LaminatedCard key={c.id} c={c} onOpen={setOpen} />
        ))}
      </div>

      {createPortal(<ContractModal c={open} onClose={() => setOpen(null)} />, document.body)}

      <style>{`
        .laminate {
          position: relative;
          overflow: hidden;
          padding: 24px;
          border-radius: 20px;
          background:
            linear-gradient(160deg, var(--glass-white), transparent 60%),
            var(--glass-violet);
          border: 1.5px solid var(--accent);
          box-shadow:
            0 10px 40px -16px var(--accent),
            inset 0 1px 0 rgba(255,255,255,0.10),
            var(--glass-shadow);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: box-shadow .35s, transform .35s, border-color .35s;
        }
        .laminate:hover {
          box-shadow:
            0 18px 60px -18px var(--accent),
            inset 0 1px 0 rgba(255,255,255,0.18);
        }
        /* Glossy diagonal sheen — the "laminated" look */
        .laminate-sheen {
          position: absolute;
          top: -60%;
          left: -30%;
          width: 70%;
          height: 220%;
          background: linear-gradient(105deg, transparent, rgba(255,255,255,0.16), transparent);
          transform: rotate(8deg);
          transition: left .6s ease;
          pointer-events: none;
        }
        .laminate:hover .laminate-sheen { left: 130%; }
      `}</style>
    </div>
  )
}
