import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Github, Linkedin, Mail, ArrowUpRight, MapPin, Cpu, ShieldCheck, GitBranch,
  Boxes, Terminal, Server, FileCode2, Star, GitFork, Send,
} from 'lucide-react'
import { Section, Heading, Reveal, Counter, Magnetic } from '../components/ui'
import { PROFILE } from '../lib/profile'

const EASE = [0.16, 1, 0.3, 1]

/* ============================================================ ABOUT */
const facts = [
  { k: 'Based in', v: 'Uttarakhand, India' },
  { k: 'Focus', v: 'L2 · DeFi · Bridges' },
  { k: 'Currently', v: 'Zanthium Technosoft' },
  { k: 'Stack', v: 'Solidity · Go · React' },
]

export function AboutSection() {
  return (
    <Section id="about">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(2rem, 4vw, 4rem)', alignItems: 'center' }}>
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 20 }}>About</div>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 'var(--fs-h2)' }}>
            I build the <span className="text-grad-violet">rails</span> the<br className="hide-sm" /> decentralised economy runs on.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-lead)', lineHeight: 1.7, marginTop: 24, maxWidth: 540 }}>
            I'm a Solidity-first engineer with a systems mindset. I write the contracts,
            run the validators, and ship the frontends that talk to them — so the whole
            stack, from consensus to UI, is something I understand and own.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-body)', lineHeight: 1.7, marginTop: 16, maxWidth: 540 }}>
            I care about trustless design, clean contract architecture, and making
            decentralised systems feel effortless to use.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="glass" style={{ padding: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border-hair)', borderRadius: 16, overflow: 'hidden' }}>
              {facts.map((f) => (
                <div key={f.k} style={{ background: 'var(--bg-card)', padding: '20px 18px' }}>
                  <div style={{ fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{f.k}</div>
                  <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 7 }}>{f.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, color: 'var(--emerald-soft)', fontSize: 13.5 }}>
              <span className="live-dot" /> Open to senior & founding engineer roles
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

/* ============================================================ SKILLS */
const domains = [
  { name: 'Smart Contracts', icon: FileCode2, skills: [['Solidity', 95], ['OpenZeppelin', 90], ['Hardhat', 88], ['Foundry', 82]] },
  { name: 'L2 & Infra', icon: Server, skills: [['Go-Ethereum', 88], ['Geth / Nodes', 86], ['EVM internals', 90], ['IPFS', 80]] },
  { name: 'Frontend', icon: Cpu, skills: [['React', 92], ['Wagmi / Viem', 90], ['Ethers.js', 89], ['Next.js', 86]] },
]

function Bar({ name, pct, i }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{name}</span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{pct}</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.1 + i * 0.05, ease: EASE }}
          style={{ height: '100%', borderRadius: 999, background: 'var(--grad-accent)' }}
        />
      </div>
    </div>
  )
}

export function SkillsSection() {
  return (
    <Section id="skills">
      <Heading eyebrow="Capabilities" title="What I'm fluent in" gradient="text-grad-premium" sub="Full-stack across the chain — from the bytecode to the browser." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 18 }}>
        {domains.map((d, di) => (
          <Reveal key={d.name} delay={di * 0.08}>
            <div className="glass skill-card" style={{ padding: 'clamp(1.4rem, 2.5vw, 2rem)', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-cyan)', border: '1px solid var(--border-cyan)' }}>
                  <d.icon size={19} style={{ color: 'var(--blue-soft)' }} />
                </div>
                <h3 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700 }}>{d.name}</h3>
              </div>
              {d.skills.map(([n, p], i) => <Bar key={n} name={n} pct={p} i={i} />)}
            </div>
          </Reveal>
        ))}
      </div>
      <style>{`.skill-card{transition:border-color .4s,transform .4s}.skill-card:hover{border-color:var(--border-cyan);transform:translateY(-4px)}`}</style>
    </Section>
  )
}

/* ============================================================ EXPERIENCE */
const timeline = [
  { year: '2025', title: 'Blockchain Developer · Zanthium Technosoft', desc: 'Building production L2 and DeFi systems — contracts, infrastructure and the dapps on top.', tag: 'Current' },
  { year: '2024', title: 'Taaqo L2 — Launch', desc: 'Architected and launched a custom EVM L2 (chain 5566) with three independent validators, RPC layer and explorer.', tag: 'Shipped' },
  { year: '2024', title: 'GlobalStaken — Live', desc: 'Six-tier staking protocol with Uniswap v3 LP and a ten-level referral engine.', tag: 'Live' },
  { year: '2023–25', title: 'Diploma — Computer Science & Engineering', desc: 'Deep systems and cryptography focus.', tag: 'Edu' },
  { year: '2019–22', title: 'BSc — Bachelor of Science', desc: 'Foundation in mathematics and logic.', tag: 'Edu' },
]

export function ExperienceSection() {
  return (
    <Section id="experience">
      <Heading eyebrow="Trajectory" title="Experience" gradient="text-grad-violet" />
      <div style={{ position: 'relative', maxWidth: 760, marginInline: 'auto', paddingLeft: 28 }}>
        <div style={{ position: 'absolute', left: 5, top: 8, bottom: 8, width: 1, background: 'linear-gradient(var(--blue), var(--violet), transparent)' }} />
        {timeline.map((t, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div style={{ position: 'relative', marginBottom: 26 }}>
              <div style={{ position: 'absolute', left: -27, top: 6, width: 11, height: 11, borderRadius: '50%', background: 'var(--blue)', boxShadow: '0 0 0 4px var(--bg-void), 0 0 14px var(--blue)' }} />
              <div className="glass exp-card" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 7 }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--text-cyan)' }}>{t.year}</span>
                  <span className="chip" style={{ fontSize: 11, padding: '3px 10px' }}>{t.tag}</span>
                </div>
                <h4 style={{ fontFamily: 'Sora', fontSize: 17, fontWeight: 700 }}>{t.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 6, lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <style>{`.exp-card{transition:border-color .35s,transform .35s}.exp-card:hover{border-color:var(--border-cyan);transform:translateX(4px)}`}</style>
    </Section>
  )
}

/* ============================================================ TECH STACK */
const stack = ['Solidity', 'Go-Ethereum', 'EVM', 'Hardhat', 'Foundry', 'OpenZeppelin', 'Wagmi', 'Viem', 'Ethers.js', 'React', 'Next.js', 'Node.js', 'IPFS', 'Uniswap v3', 'BNB Chain', 'Ethereum', 'Polygon', 'Taaqo']

export function StackSection() {
  return (
    <Section id="stack">
      <Heading eyebrow="Toolbox" title="Tech stack" gradient="text-grad-ocean" center sub="The tools I reach for, every day." />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', maxWidth: 880, marginInline: 'auto' }}>
        {stack.map((t, i) => (
          <motion.span
            key={t}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.025, type: 'spring', stiffness: 200, damping: 18 }}
            whileHover={{ y: -4 }}
            className="chip stack-pill"
            style={{ fontSize: 14, padding: '10px 18px', fontFamily: 'JetBrains Mono' }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', boxShadow: '0 0 8px var(--blue)' }} />
            {t}
          </motion.span>
        ))}
      </div>
      <style>{`.stack-pill{transition:border-color .3s,color .3s}.stack-pill:hover{border-color:var(--border-cyan);color:var(--text-primary)}`}</style>
    </Section>
  )
}

/* ============================================================ OPEN SOURCE */
const repos = [
  { name: 'taaqo-l2', icon: Boxes, desc: 'Go-Ethereum fork & node tooling powering the Taaqo Layer-2 — consensus config, RPC and genesis.', lang: 'Go', tags: ['L2', 'Geth'] },
  { name: 'globalstaken-contracts', icon: ShieldCheck, desc: 'Six-tier staking protocol — Uniswap v3 LP, referral engine and achievement ranks. Verified on-chain.', lang: 'Solidity', tags: ['DeFi', 'Audited-in-spirit'] },
  { name: 'taaqo-bridges', icon: GitBranch, desc: 'Lock-and-mint, on-ramp and vault bridges with relayers, replay guards and admin tooling.', lang: 'Solidity', tags: ['Bridges', 'Relayers'] },
  { name: 'web3-portfolio', icon: Terminal, desc: 'This site — React, Wagmi, Viem & Three.js, with live on-chain reads and an on-chain guestbook.', lang: 'JavaScript', tags: ['React', 'Wagmi'] },
]

export function OpenSourceSection() {
  return (
    <Section id="opensource">
      <Heading
        eyebrow="In the open"
        title="Open source & on-chain"
        gradient="text-grad-premium"
        sub="Contracts you can read, chains you can query, and tooling that's out in the world."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
        {repos.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.06}>
            <a href={PROFILE.socials.github} target="_blank" rel="noreferrer" className="glass repo-card" style={{ display: 'block', padding: 22, height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <r.icon size={19} style={{ color: 'var(--blue-soft)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</span>
                </div>
                <ArrowUpRight size={17} style={{ color: 'var(--text-muted)' }} className="repo-arrow" />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.6, marginTop: 14 }}>{r.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18, color: 'var(--text-muted)', fontSize: 12.5 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--blue)' }} /> {r.lang}
                </span>
                {r.tags.map((t) => <span key={t} className="chip" style={{ fontSize: 11, padding: '3px 9px' }}>{t}</span>)}
              </div>
            </a>
          </Reveal>
        ))}
      </div>
      <Reveal style={{ textAlign: 'center', marginTop: 40 }}>
        <a href={PROFILE.socials.github} target="_blank" rel="noreferrer" className="btn-ghost">
          <Github size={17} /> View GitHub profile
        </a>
      </Reveal>
      <style>{`.repo-card{transition:border-color .35s,transform .35s}.repo-card:hover{border-color:var(--border-cyan);transform:translateY(-4px)}.repo-card:hover .repo-arrow{color:var(--blue-soft)}`}</style>
    </Section>
  )
}

/* ============================================================ CONTACT */
const socials = [
  { icon: Github, label: 'GitHub', url: PROFILE.socials.github },
  { icon: Linkedin, label: 'LinkedIn', url: PROFILE.socials.linkedin },
  { icon: Mail, label: 'Email', url: `mailto:${PROFILE.email}` },
]

export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`
  }

  return (
    <Section id="contact" style={{ paddingBottom: 'var(--sp-9)' }}>
      <div className="gradient-border" style={{ borderRadius: 28 }}>
        <div
          className="glass"
          style={{
            borderRadius: 28,
            padding: 'clamp(1.8rem, 4vw, 3.4rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(2rem, 4vw, 3.4rem)',
            alignItems: 'center',
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>Let's talk</div>
            <h2 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 'var(--fs-h2)' }}>
              Have a protocol,<br />an L2 or a bridge<br />in mind?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-lead)', lineHeight: 1.6, marginTop: 20, maxWidth: 420 }}>
              I'm open to senior and founding-engineer roles, and select freelance builds. Let's architect it together.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 26, flexWrap: 'wrap' }}>
              {socials.map((s) => (
                <Magnetic key={s.label} strength={0.4}>
                  <a href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}
                    className="social-btn"
                    style={{ width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', border: '1px solid var(--border-violet)', color: 'var(--text-primary)' }}>
                    <s.icon size={19} />
                  </a>
                </Magnetic>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 24, color: 'var(--text-muted)', fontSize: 14 }}>
              <MapPin size={15} /> {PROFILE.location}
            </div>
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input required className="glass-input" placeholder="Your name" value={form.name} onChange={handle('name')} style={{ fontFamily: 'Inter' }} />
            <input required type="email" className="glass-input" placeholder="you@protocol.xyz" value={form.email} onChange={handle('email')} style={{ fontFamily: 'Inter' }} />
            <textarea required rows={4} className="glass-input" placeholder="What are you building?" value={form.message} onChange={handle('message')} style={{ fontFamily: 'Inter', resize: 'vertical' }} />
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
              <Send size={17} /> Send message
            </button>
          </form>
        </div>
      </div>
      <style>{`.social-btn{transition:transform .3s,border-color .3s,background .3s}.social-btn:hover{border-color:var(--border-cyan);background:var(--glass-bg-strong)}`}</style>
    </Section>
  )
}
