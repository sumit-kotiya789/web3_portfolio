import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Wallet, ChevronDown, Cpu, Layers, GitBranch, Server } from 'lucide-react'
import Typewriter from '../components/Typewriter'
import NodeGraph from '../components/NodeGraph'
import TaaqoProof from '../components/TaaqoProof'
import { Counter, Section, Reveal } from '../components/ui'

const stats = [
  { value: 1, suffix: '', label: 'Custom L2', icon: Layers },
  { value: 3, suffix: '', label: 'Live Bridges', icon: GitBranch },
  { value: 10, suffix: '+', label: 'EVM Contracts', icon: Cpu },
  { value: 3, suffix: '', label: 'Independent Nodes', icon: Server },
]

const roles = [
  'Blockchain Developer',
  'Solidity Engineer',
  'L2 Architect',
  'DeFi Protocol Builder',
  'Custom L2 Creator',
]

const marquee = ['Solidity', 'Go-Ethereum', 'EVM', 'Hardhat', 'Wagmi', 'Viem', 'IPFS', 'Uniswap v3', 'OpenZeppelin']

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8rem 1.5rem 4rem',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 18px',
            borderRadius: 999,
            marginBottom: 32,
            border: '1px solid var(--border-violet)',
          }}
        >
          <span className="live-dot" />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', letterSpacing: 1 }}>
            Available for Web3 builds · Uttarakhand, India
          </span>
        </motion.div>

        {/* Massive name with glitch */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-grad-hero"
          style={{
            fontSize: 'clamp(2.8rem, 11vw, 9rem)',
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            fontFamily: 'Sora',
            position: 'relative',
            animation: 'glitchTop 6s infinite',
          }}
        >
          SUMIT KOTIYA
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: 22,
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            fontFamily: 'Space Grotesk',
            minHeight: '2.4em',
          }}
        >
          <Typewriter words={roles} className="glow-cyan" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', marginTop: 8, maxWidth: 600 }}
        >
          Building the decentralized infrastructure of tomorrow.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link to="/projects" className="btn-magenta cursor-grow">
            Explore Work <ArrowRight size={18} />
          </Link>
          <Link to="/wallet" className="btn-ghost cursor-grow">
            <Wallet size={18} /> Connect Wallet
          </Link>
        </motion.div>

        {/* Node visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{ width: 'min(680px, 90vw)', marginTop: 56 }}
        >
          <NodeGraph height={220} count={8} />
        </motion.div>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 16,
            marginTop: 40,
            width: 'min(900px, 95vw)',
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="glass stat-card"
              style={{ padding: '1.4rem 1rem', textAlign: 'center' }}
            >
              <s.icon size={20} style={{ color: 'var(--cyan-core)', marginBottom: 8 }} />
              <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: 'var(--gold-premium)', fontFamily: 'Sora' }}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-violet)', letterSpacing: 1, marginTop: 4, textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll arrow */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ marginTop: 50, color: 'var(--cyan-core)' }}
        >
          <ChevronDown size={30} className="glow-cyan" />
        </motion.div>
      </section>

      {/* Marquee strip */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '20px 0', position: 'relative' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 26s linear infinite' }}>
          {[...marquee, ...marquee].map((m, i) => (
            <span
              key={i}
              style={{
                margin: '0 32px',
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--text-violet)',
                fontFamily: 'Sora',
                opacity: 0.7,
                whiteSpace: 'nowrap',
              }}
            >
              {m} <span style={{ color: 'var(--magenta-pop)' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Intro band */}
      <Section style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, alignItems: 'center' }}>
          <Reveal>
            <div
              style={{
                display: 'inline-flex',
                gap: 8,
                color: 'var(--text-cyan)',
                fontFamily: 'JetBrains Mono',
                fontSize: 13,
                letterSpacing: 3,
                marginBottom: 16,
              }}
            >
              <span style={{ width: 24, height: 1, background: 'var(--cyan-core)', alignSelf: 'center' }} /> THE MISSION
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.1, fontFamily: 'Sora' }}>
              I architect <span className="text-grad-violet">on-chain systems</span> that move value{' '}
              <span className="text-grad-ocean">trustlessly</span> across chains.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.8 }}>
              From a fully custom EVM-compatible Layer 2 (Taaqo, chain ID 5566) running three independent
              validators, to live cross-chain bridges and a multi-tier DeFi staking protocol — I build the
              rails that the decentralized economy runs on. Every contract audited in spirit, every node
              battle-tested in production.
            </p>
            <div style={{ display: 'flex', gap: 24, marginTop: 28, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--gold-premium)', fontFamily: 'Sora' }}>
                  <Counter to={6} suffix=" Tiers" />
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Staking protocol</div>
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--gold-premium)', fontFamily: 'Sora' }}>
                  <Counter to={5566} duration={2.2} />
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Taaqo chain ID</div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Live, verifiable proof from my own chain */}
      <TaaqoProof />

      <style>{`
        .stat-card { transition: transform .3s, box-shadow .3s, border-color .3s; }
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-violet);
          box-shadow: 0 0 30px rgba(45,212,191,0.35);
        }
      `}</style>
    </div>
  )
}
