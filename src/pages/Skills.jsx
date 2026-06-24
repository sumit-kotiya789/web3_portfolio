import { useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Section, Heading, Reveal } from '../components/ui'

const Scene3D = lazy(() => import('../components/Scene3D'))

const categories = [
  { name: 'Smart Contracts', tone: 'a', skills: [
    { name: 'Solidity', pct: 95 }, { name: 'OpenZeppelin', pct: 90 }, { name: 'Hardhat', pct: 88 }, { name: 'Remix', pct: 85 },
  ] },
  { name: 'L2 / Infra', tone: 'a', skills: [
    { name: 'go-ethereum', pct: 86 }, { name: 'Geth', pct: 84 }, { name: 'IPFS', pct: 80 }, { name: 'Node.js', pct: 88 },
  ] },
  { name: 'Chains', tone: 'b', skills: [
    { name: 'Ethereum', pct: 92 }, { name: 'BSC', pct: 90 }, { name: 'Polygon', pct: 85 }, { name: 'Taaqo', pct: 98 }, { name: 'Tron', pct: 75 },
  ] },
  { name: 'Frontend', tone: 'a', skills: [
    { name: 'React', pct: 92 }, { name: 'Next.js', pct: 86 }, { name: 'Wagmi', pct: 90 }, { name: 'Viem', pct: 88 }, { name: 'Ethers.js', pct: 89 },
  ] },
  { name: 'Tooling', tone: 'c', skills: [
    { name: 'Git', pct: 90 }, { name: 'Postman', pct: 85 }, { name: 'Hardhat', pct: 88 }, { name: 'Web3.js', pct: 84 },
  ] },
]
const TONE = { a: 'var(--blue)', b: 'var(--gold-premium)', c: 'var(--blue-soft)' }

const chainMarquee = ['Ethereum', 'BSC', 'Polygon', 'Taaqo', 'Tron', 'Arbitrum', 'Optimism', 'Base']

function Hex({ skill, color, index }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 160 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileHover={{ scale: 1.12, zIndex: 5 }}
      className="hex cursor-grow"
      style={{
        width: 118, height: 132, margin: '-6px 6px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(150deg, color-mix(in srgb, ${color} 20%, transparent), color-mix(in srgb, ${color} 5%, transparent))`,
        border: `1px solid color-mix(in srgb, ${color} 40%, transparent)`,
        position: 'relative',
        boxShadow: hover ? `0 0 30px color-mix(in srgb, ${color} 55%, transparent)` : 'none',
        transition: 'box-shadow .3s',
      }}
    >
      <div style={{ width: 30, height: 30, borderRadius: 9, background: color, boxShadow: `0 0 16px ${color}`, marginBottom: 8 }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', padding: '0 6px' }}>{skill.name}</span>
      <motion.div animate={{ height: hover ? 'auto' : 0, opacity: hover ? 1 : 0 }} style={{ overflow: 'hidden' }}>
        <span style={{ fontSize: 12, color, fontFamily: 'JetBrains Mono', fontWeight: 700, marginTop: 4, display: 'block' }}>{skill.pct}%</span>
      </motion.div>
    </motion.div>
  )
}

export default function Skills() {
  let globalIndex = 0
  return (
    <Section style={{ paddingTop: 130 }}>
      <Heading eyebrow="Capabilities" title="TECH ARSENAL" center sub="A honeycomb of everything I build with — color-coded by domain. Hover a cell to reveal proficiency." />

      {/* 3D constellation centerpiece */}
      <Reveal>
        <div className="gradient-border" style={{ maxWidth: 560, margin: '0 auto 64px' }}>
          <div className="glass" style={{ borderRadius: 'var(--radius)', padding: 8, position: 'relative', overflow: 'hidden' }}>
            <Suspense fallback={<div style={{ height: 300 }} />}>
              <Scene3D variant="network" height={300} />
            </Suspense>
            <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: 'JetBrains Mono', fontSize: 11.5, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              fullstack · chain to browser
            </div>
          </div>
        </div>
      </Reveal>

      {categories.map((cat) => {
        const c = TONE[cat.tone]
        return (
          <div key={cat.name} style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, justifyContent: 'center' }}>
              <span style={{ width: 28, height: 3, borderRadius: 2, background: c, boxShadow: `0 0 10px ${c}` }} />
              <h3 style={{ color: c, fontSize: 18, fontWeight: 700, letterSpacing: 1, fontFamily: 'Sora' }}>{cat.name}</h3>
              <span style={{ width: 28, height: 3, borderRadius: 2, background: c, boxShadow: `0 0 10px ${c}` }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
              {cat.skills.map((s) => <Hex key={s.name} skill={s} color={c} index={globalIndex++} />)}
            </div>
          </div>
        )
      })}

      {/* Chain marquee */}
      <div style={{ marginTop: 30 }}>
        <div className="divider-grad" style={{ marginBottom: 30 }} />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 22s linear infinite' }}>
            {[...chainMarquee, ...chainMarquee].map((c, i) => (
              <div key={i} className="glass" style={{ margin: '0 12px', padding: '12px 28px', display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--blue)', boxShadow: '0 0 12px var(--blue)' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 15 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
