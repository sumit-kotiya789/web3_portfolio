import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Cpu, ShieldCheck, Boxes } from 'lucide-react'
import { Section, Heading, Reveal } from '../components/ui'
import TiltCard from '../components/TiltCard'
import Terminal from '../components/Terminal'

const Scene3D = lazy(() => import('../components/Scene3D'))

const skills = [
  { name: 'Solidity', pct: 95 },
  { name: 'Go-Ethereum / Geth', pct: 88 },
  { name: 'EVM Internals', pct: 90 },
  { name: 'L2 Infrastructure', pct: 85 },
  { name: 'React / Wagmi / Viem', pct: 92 },
  { name: 'DeFi Protocol Design', pct: 87 },
]

const stack = [
  { name: 'Solidity', tone: 'a' }, { name: 'React', tone: 'a' }, { name: 'Hardhat', tone: 'b' },
  { name: 'Go', tone: 'a' }, { name: 'Wagmi', tone: 'a' }, { name: 'Viem', tone: 'c' },
  { name: 'Ethers', tone: 'c' }, { name: 'IPFS', tone: 'a' }, { name: 'Node', tone: 'a' },
  { name: 'Next.js', tone: 'b' }, { name: 'OZ', tone: 'a' }, { name: 'Geth', tone: 'c' },
]
const TONE = { a: 'var(--blue)', b: 'var(--gold-premium)', c: 'var(--blue-soft)' }

const facts = [
  { icon: MapPin, k: 'Based in', v: 'Uttarakhand, India' },
  { icon: Cpu, k: 'Focus', v: 'L2 · DeFi · Bridges' },
  { icon: ShieldCheck, k: 'Currently', v: 'Zanthium Technosoft' },
  { icon: Boxes, k: 'Stack', v: 'Solidity · Go · React' },
]

const timeline = [
  { year: '2025', title: 'Zanthium Technosoft', desc: 'Blockchain Developer — building production L2 & DeFi systems.', badge: 'Current', badgeColor: 'var(--blue)' },
  { year: '2024', title: 'Taaqo L2 Launch', desc: 'Architected & launched custom EVM L2 (chain ID 5566) with 3 validators.', badge: 'Shipped', badgeColor: 'var(--blue-soft)' },
  { year: '2024', title: 'GlobalStaken Live', desc: '6-tier staking protocol with Uniswap v3 LP & 10-level referral engine.', badge: 'Live', badgeColor: 'var(--emerald-live)' },
  { year: '2023–25', title: 'Diploma — CSE', desc: 'Computer Science & Engineering. Deep systems & cryptography focus.', badge: 'Edu', badgeColor: 'var(--gold-premium)' },
  { year: '2019–22', title: 'BSc', desc: 'Bachelor of Science — foundation in mathematics & logic.', badge: 'Edu', badgeColor: 'var(--violet-soft)' },
]

function SkillBar({ name, pct, delay }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 14 }}>{name}</span>
        <span style={{ color: 'var(--text-cyan)', fontWeight: 600, fontSize: 14, fontFamily: 'JetBrains Mono' }}>{pct}%</span>
      </div>
      <div style={{ height: 8, background: 'var(--glass-white)', borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', background: 'var(--grad-accent)', borderRadius: 999, boxShadow: '0 0 14px var(--cyan-glow)' }}
        />
      </div>
    </div>
  )
}

export default function About() {
  return (
    <Section style={{ paddingTop: 130 }}>
      <Heading eyebrow="Who I Am" title="The Developer Behind The Chain" sub="Solidity-first engineer with a systems mindset — I write contracts, run validators, and ship the frontends that talk to them." />

      {/* Intro — bio + 3D crystal centerpiece */}
      <div className="about-intro">
        <Reveal>
          <div style={{ color: 'var(--text-primary)', fontSize: 16.5, lineHeight: 1.85 }}>
            <p>
              I'm <span style={{ color: 'var(--text-cyan)', fontWeight: 600 }}>Sumit Kotiya</span>, a
              blockchain developer from Uttarakhand, India, specializing in{' '}
              <span style={{ color: 'var(--text-cyan)' }}>Solidity</span>,{' '}
              <span style={{ color: 'var(--blue-soft)' }}>Go-Ethereum</span>, the{' '}
              <span style={{ color: 'var(--text-cyan)' }}>EVM</span> and{' '}
              <span style={{ color: 'var(--blue-soft)' }}>custom Layer-2 infrastructure</span>.
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

          {/* Fact grid */}
          <div className="about-facts">
            {facts.map((f) => (
              <div key={f.k} className="glass" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-cyan)', border: '1px solid var(--border-cyan)' }}>
                  <f.icon size={17} style={{ color: 'var(--blue-soft)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{f.k}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 3 }}>{f.v}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="about-3d gradient-border">
            <div className="glass" style={{ borderRadius: 'var(--radius)', padding: 8, position: 'relative', overflow: 'hidden' }}>
              <Suspense fallback={<div style={{ height: 'clamp(320px, 38vw, 440px)' }} />}>
                <Scene3D variant="crystal" height="clamp(320px, 38vw, 440px)" />
              </Suspense>
              <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'JetBrains Mono', fontSize: 11.5, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                <span>EVM · L2 · DeFi</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span className="live-dot" style={{ width: 6, height: 6 }} /> drag to rotate</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Skills + Terminal */}
      <div className="about-skills">
        <Reveal>
          <h3 style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 700, marginBottom: 22 }}>Proficiency</h3>
          {skills.map((s, i) => <SkillBar key={s.name} {...s} delay={i * 0.08} />)}
        </Reveal>
        <Reveal delay={0.12}><Terminal /></Reveal>
      </div>

      {/* Tech stack hex grid */}
      <div style={{ marginTop: 90 }}>
        <Heading eyebrow="Toolbox" title="Tech Stack" gradient="text-grad-ocean" center />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center' }}>
          {stack.map((t, i) => {
            const c = TONE[t.tone]
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 180 }}
                whileHover={{ y: -6, scale: 1.08 }}
                className="hex"
                style={{
                  width: 96, height: 108,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: `linear-gradient(145deg, color-mix(in srgb, ${c} 14%, transparent), transparent)`,
                  border: `1px solid color-mix(in srgb, ${c} 34%, transparent)`,
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 10, background: c, boxShadow: `0 0 18px ${c}`, marginBottom: 8 }} />
                <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{t.name}</span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ marginTop: 90 }}>
        <Heading eyebrow="The Journey" title="Timeline" gradient="text-grad-violet" center />
        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', paddingLeft: 40 }}>
          <div style={{ position: 'absolute', left: 11, top: 6, bottom: 6, width: 2, background: 'var(--grad-violet)', boxShadow: '0 0 12px var(--cyan-glow)' }} />
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ position: 'relative', marginBottom: 30 }}
            >
              <div style={{ position: 'absolute', left: -36, top: 4, width: 16, height: 16, borderRadius: '50%', background: 'var(--blue)', boxShadow: '0 0 16px var(--blue)', border: '3px solid var(--bg-void)' }} />
              <TiltCard max={6} className="glass" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-cyan)', fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600 }}>{item.year}</span>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, background: `color-mix(in srgb, ${item.badgeColor} 16%, transparent)`, color: item.badgeColor, border: `1px solid color-mix(in srgb, ${item.badgeColor} 40%, transparent)`, fontWeight: 600, letterSpacing: 0.5 }}>{item.badge}</span>
                </div>
                <h4 style={{ fontSize: 18, color: 'var(--text-primary)', fontWeight: 700 }}>{item.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 6, lineHeight: 1.6 }}>{item.desc}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .about-intro {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: clamp(2rem, 4vw, 3.5rem);
          align-items: start;
          margin-top: 8px;
        }
        .about-3d { position: sticky; top: 110px; }
        .about-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 30px; }
        .about-skills {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: clamp(2rem, 4vw, 3.5rem);
          align-items: start;
          margin-top: 72px;
        }
        @media (max-width: 880px) {
          .about-intro, .about-skills { grid-template-columns: 1fr; }
          .about-3d { position: static; }
        }
        @media (max-width: 460px) {
          .about-facts { grid-template-columns: 1fr; }
        }
      `}</style>
    </Section>
  )
}
