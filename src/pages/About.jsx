import { motion } from 'framer-motion'
import { Section, Heading, Reveal } from '../components/ui'
import Terminal from '../components/Terminal'

const skills = [
  { name: 'Solidity', pct: 95 },
  { name: 'Go-Ethereum / Geth', pct: 88 },
  { name: 'EVM Internals', pct: 90 },
  { name: 'L2 Infrastructure', pct: 85 },
  { name: 'React / Wagmi / Viem', pct: 92 },
  { name: 'DeFi Protocol Design', pct: 87 },
]

const stack = [
  { name: 'Solidity', color: '#2dd4bf' },
  { name: 'React', color: '#2dd4bf' },
  { name: 'Hardhat', color: '#d6d9e3' },
  { name: 'Go', color: '#2dd4bf' },
  { name: 'Wagmi', color: '#2dd4bf' },
  { name: 'Viem', color: '#99f6e4' },
  { name: 'Ethers', color: '#5eead4' },
  { name: 'IPFS', color: '#2dd4bf' },
  { name: 'Node', color: '#2dd4bf' },
  { name: 'Next.js', color: '#ecedf2' },
  { name: 'OZ', color: '#2dd4bf' },
  { name: 'Geth', color: '#5eead4' },
]

const timeline = [
  { year: '2025', title: 'Zanthium Technosoft', desc: 'Blockchain Developer — building production L2 & DeFi systems.', badge: 'Current', badgeColor: 'var(--magenta-pop)' },
  { year: '2024', title: 'Taaqo L2 Launch', desc: 'Architected & launched custom EVM L2 (chain ID 5566) with 3 validators.', badge: 'Shipped', badgeColor: 'var(--cyan-core)' },
  { year: '2024', title: 'GlobalStaken Live', desc: '6-tier staking protocol with Uniswap v3 LP & 10-level referral engine.', badge: 'Live', badgeColor: 'var(--emerald-live)' },
  { year: '2023–25', title: 'Diploma — CSE', desc: 'Computer Science & Engineering. Deep systems & cryptography focus.', badge: 'Edu', badgeColor: 'var(--gold-premium)' },
  { year: '2019–22', title: 'BSc', desc: 'Bachelor of Science — foundation in mathematics & logic.', badge: 'Edu', badgeColor: 'var(--violet-glow)' },
]

function SkillBar({ name, pct, delay }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 14 }}>{name}</span>
        <span style={{ color: 'var(--gold-premium)', fontWeight: 600, fontSize: 14, fontFamily: 'JetBrains Mono' }}>{pct}%</span>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--violet-core), var(--cyan-core))',
            borderRadius: 999,
            boxShadow: '0 0 14px rgba(45,212,191,0.5)',
          }}
        />
      </div>
    </div>
  )
}

export default function About() {
  return (
    <Section style={{ paddingTop: 130 }}>
      <Heading eyebrow="Who I Am" title="The Developer Behind The Chain" sub="Solidity-first engineer with a systems mindset — I write contracts, run validators, and ship the frontends that talk to them." />

      {/* Terminal + bio */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'start' }}>
        <Reveal>
          <Terminal />
        </Reveal>
        <Reveal delay={0.15}>
          <div style={{ color: 'var(--text-primary)', fontSize: 16.5, lineHeight: 1.85 }}>
            <p>
              I'm <span className="text-violet" style={{ color: 'var(--violet-glow)', fontWeight: 600 }}>Sumit Kotiya</span>, a
              blockchain developer from Uttarakhand, India, specializing in{' '}
              <span style={{ color: 'var(--violet-glow)' }}>Solidity</span>,{' '}
              <span style={{ color: 'var(--cyan-soft)' }}>Go-Ethereum</span>, the{' '}
              <span style={{ color: 'var(--violet-glow)' }}>EVM</span> and{' '}
              <span style={{ color: 'var(--cyan-soft)' }}>custom Layer-2 infrastructure</span>.
            </p>
            <p style={{ marginTop: 16 }}>
              I designed and launched <span style={{ color: 'var(--gold-soft)' }}>Taaqo L2</span> — a fully
              EVM-compatible chain running three independent validator nodes — and built the explorer,
              RPC layer and cross-chain bridges around it. On the protocol side I shipped{' '}
              <span style={{ color: 'var(--gold-soft)' }}>GlobalStaken</span>, a six-tier staking system with
              Uniswap v3 liquidity and a ten-level referral engine.
            </p>
            <p style={{ marginTop: 16 }}>
              I care about <span style={{ color: 'var(--emerald-soft)' }}>trustless design</span>, clean
              contract architecture, and making decentralized systems feel effortless to use.
            </p>
          </div>

          <div style={{ marginTop: 32 }}>
            {skills.map((s, i) => (
              <SkillBar key={s.name} {...s} delay={i * 0.08} />
            ))}
          </div>
        </Reveal>
      </div>

      {/* Tech stack hex grid */}
      <div style={{ marginTop: 90 }}>
        <Heading eyebrow="Toolbox" title="Tech Stack" gradient="text-grad-ocean" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center' }}>
          {stack.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 180 }}
              whileHover={{ y: -6, scale: 1.08 }}
              className="hex"
              style={{
                width: 96,
                height: 108,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(145deg, ${t.color}22, ${t.color}08)`,
                border: `1px solid ${t.color}55`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: t.color,
                  boxShadow: `0 0 18px ${t.color}`,
                  marginBottom: 8,
                }}
              />
              <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{t.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ marginTop: 90 }}>
        <Heading eyebrow="The Journey" title="Timeline" gradient="text-grad-violet" />
        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', paddingLeft: 40 }}>
          <div
            style={{
              position: 'absolute',
              left: 11,
              top: 6,
              bottom: 6,
              width: 2,
              background: 'var(--grad-violet)',
              boxShadow: '0 0 12px rgba(45,212,191,0.5)',
            }}
          />
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ position: 'relative', marginBottom: 30 }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: -36,
                  top: 4,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'var(--violet-core)',
                  boxShadow: '0 0 16px var(--violet-core)',
                  border: '3px solid var(--bg-void)',
                }}
              />
              <div className="glass" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-cyan)', fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600 }}>
                    {item.year}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: `${item.badgeColor}22`,
                      color: item.badgeColor,
                      border: `1px solid ${item.badgeColor}55`,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                    }}
                  >
                    {item.badge}
                  </span>
                </div>
                <h4 style={{ fontSize: 18, color: 'var(--text-primary)', fontWeight: 700 }}>{item.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 6, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
