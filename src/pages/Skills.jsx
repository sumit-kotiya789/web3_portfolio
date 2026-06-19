import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, Heading } from '../components/ui'

const categories = [
  {
    name: 'Smart Contracts',
    color: '#2dd4bf',
    skills: [
      { name: 'Solidity', pct: 95 },
      { name: 'OpenZeppelin', pct: 90 },
      { name: 'Hardhat', pct: 88 },
      { name: 'Remix', pct: 85 },
    ],
  },
  {
    name: 'L2 / Infra',
    color: '#2dd4bf',
    skills: [
      { name: 'go-ethereum', pct: 86 },
      { name: 'Geth', pct: 84 },
      { name: 'IPFS', pct: 80 },
      { name: 'Node.js', pct: 88 },
    ],
  },
  {
    name: 'Chains',
    color: '#d6d9e3',
    skills: [
      { name: 'Ethereum', pct: 92 },
      { name: 'BSC', pct: 90 },
      { name: 'Polygon', pct: 85 },
      { name: 'Taaqo', pct: 98 },
      { name: 'Tron', pct: 75 },
    ],
  },
  {
    name: 'Frontend',
    color: '#2dd4bf',
    skills: [
      { name: 'React', pct: 92 },
      { name: 'Next.js', pct: 86 },
      { name: 'Wagmi', pct: 90 },
      { name: 'Viem', pct: 88 },
      { name: 'Ethers.js', pct: 89 },
    ],
  },
  {
    name: 'Tooling',
    color: '#2dd4bf',
    skills: [
      { name: 'Git', pct: 90 },
      { name: 'Postman', pct: 85 },
      { name: 'Hardhat', pct: 88 },
      { name: 'Web3.js', pct: 84 },
    ],
  },
]

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
        width: 118,
        height: 132,
        margin: '-6px 6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(150deg, ${color}33, ${color}0d)`,
        border: `1px solid ${color}66`,
        position: 'relative',
        cursor: 'none',
        boxShadow: hover ? `0 0 30px ${color}88` : 'none',
        transition: 'box-shadow .3s',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          background: color,
          boxShadow: `0 0 16px ${color}`,
          marginBottom: 8,
        }}
      />
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', padding: '0 6px' }}>
        {skill.name}
      </span>
      <motion.div
        animate={{ height: hover ? 'auto' : 0, opacity: hover ? 1 : 0 }}
        style={{ overflow: 'hidden' }}
      >
        <span style={{ fontSize: 12, color, fontFamily: 'JetBrains Mono', fontWeight: 700, marginTop: 4, display: 'block' }}>
          {skill.pct}%
        </span>
      </motion.div>
    </motion.div>
  )
}

export default function Skills() {
  let globalIndex = 0
  return (
    <Section style={{ paddingTop: 130 }}>
      <Heading eyebrow="Capabilities" title="TECH ARSENAL" center sub="A honeycomb of everything I build with — color-coded by domain. Hover a cell to reveal proficiency." />

      {categories.map((cat) => (
        <div key={cat.name} style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, justifyContent: 'center' }}>
            <span style={{ width: 28, height: 3, borderRadius: 2, background: cat.color, boxShadow: `0 0 10px ${cat.color}` }} />
            <h3 style={{ color: cat.color, fontSize: 18, fontWeight: 700, letterSpacing: 1, fontFamily: 'Sora' }}>
              {cat.name}
            </h3>
            <span style={{ width: 28, height: 3, borderRadius: 2, background: cat.color, boxShadow: `0 0 10px ${cat.color}` }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
            {cat.skills.map((s) => (
              <Hex key={s.name} skill={s} color={cat.color} index={globalIndex++} />
            ))}
          </div>
        </div>
      ))}

      {/* Chain marquee */}
      <div style={{ marginTop: 30 }}>
        <div className="divider-grad" style={{ marginBottom: 30 }} />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 22s linear infinite' }}>
            {[...chainMarquee, ...chainMarquee].map((c, i) => (
              <div
                key={i}
                className="glass"
                style={{
                  margin: '0 12px',
                  padding: '12px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: 'var(--violet-core)',
                    boxShadow: '0 0 12px var(--violet-core)',
                  }}
                />
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 15 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
