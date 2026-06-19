import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Send, MapPin, CheckCircle2 } from 'lucide-react'
import { Section, Heading, Reveal } from '../components/ui'

const availableFor = [
  { label: 'DeFi Protocols', color: 'var(--violet-core)' },
  { label: 'L2 Infrastructure', color: 'var(--cyan-core)' },
  { label: 'Smart Contracts', color: 'var(--magenta-pop)' },
  { label: 'Bridge Architecture', color: 'var(--emerald-live)' },
]

const socials = [
  { icon: Github, label: 'GitHub', url: 'https://github.com', cls: 'social-violet' },
  { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com', cls: 'social-cyan' },
  { icon: Mail, label: 'Email', url: 'mailto:hello@sumitkotiya.dev', cls: 'social-magenta' },
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', building: '', message: '' })

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', building: '', message: '' })
  }

  return (
    <Section style={{ paddingTop: 130 }}>
      <Heading eyebrow="Get In Touch" title="LET'S BUILD" gradient="text-grad-ocean" center sub="Have a protocol, an L2, or a bridge in mind? Let's architect it together." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
        {/* Form */}
        <Reveal>
          <form onSubmit={submit} className="glass" style={{ padding: 30 }}>
            {[
              { k: 'name', label: 'Name', type: 'text', ph: 'Satoshi Nakamoto' },
              { k: 'email', label: 'Email', type: 'email', ph: 'you@protocol.xyz' },
              { k: 'building', label: 'What are you building?', type: 'text', ph: 'A cross-chain DEX…' },
            ].map((field) => (
              <div key={field.k} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, letterSpacing: 0.5 }}>
                  {field.label}
                </label>
                <input
                  required
                  type={field.type}
                  value={form[field.k]}
                  onChange={handle(field.k)}
                  placeholder={field.ph}
                  className="contact-input"
                />
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, letterSpacing: 0.5 }}>
                Message
              </label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={handle('message')}
                placeholder="Tell me about your project…"
                className="contact-input"
                style={{ resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="btn-fire cursor-grow" style={{ width: '100%', justifyContent: 'center', fontSize: 16 }}>
              {sent ? <><CheckCircle2 size={18} /> Message Sent!</> : <><Send size={18} /> Send Message</>}
            </button>
          </form>
        </Reveal>

        {/* Side panel */}
        <Reveal delay={0.15}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div className="glass" style={{ padding: 26 }}>
              <h4 style={{ fontSize: 13, letterSpacing: 2, color: 'var(--text-cyan)', marginBottom: 16 }}>AVAILABLE FOR</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {availableFor.map((t) => (
                  <span
                    key={t.label}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 600,
                      background: `${t.color}1a`,
                      color: t.color,
                      border: `1px solid ${t.color}55`,
                    }}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass" style={{ padding: 26 }}>
              <h4 style={{ fontSize: 13, letterSpacing: 2, color: 'var(--text-cyan)', marginBottom: 16 }}>SOCIALS</h4>
              <div style={{ display: 'flex', gap: 14 }}>
                {socials.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className={`social-ico ${s.cls} cursor-grow`}>
                    <s.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div className="glass" style={{ padding: 26, border: '1px solid rgba(45,212,191,0.35)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="live-dot" style={{ width: 12, height: 12 }} />
                <div>
                  <div style={{ color: 'var(--emerald-live)', fontWeight: 700, fontSize: 16 }}>Open to opportunities</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                    Currently accepting freelance & full-time roles
                  </div>
                </div>
              </div>
            </div>

            <div className="glass" style={{ padding: 26, display: 'flex', alignItems: 'center', gap: 12 }}>
              <MapPin size={22} style={{ color: 'var(--magenta-pop)' }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Uttarakhand, India 🇮🇳</span>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        .contact-input {
          width: 100%;
          background: var(--glass-violet);
          border: 1px solid var(--border-violet);
          border-radius: 14px;
          padding: 13px 16px;
          color: var(--text-primary);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color .25s, box-shadow .25s;
        }
        .contact-input::placeholder { color: var(--text-muted); }
        .contact-input:focus {
          border-color: var(--cyan-core);
          box-shadow: 0 0 18px var(--cyan-glow);
        }
        .social-ico {
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 14px;
          background: var(--glass-violet);
          transition: all .3s;
        }
        .social-violet { color: var(--violet-glow); border: 1px solid var(--border-violet); }
        .social-violet:hover { box-shadow: 0 0 22px rgba(45,212,191,.5); transform: translateY(-3px); }
        .social-cyan { color: var(--cyan-core); border: 1px solid var(--border-cyan); }
        .social-cyan:hover { box-shadow: 0 0 22px rgba(45,212,191,.5); transform: translateY(-3px); }
        .social-magenta { color: var(--magenta-pop); border: 1px solid rgba(45,212,191,.35); }
        .social-magenta:hover { box-shadow: 0 0 22px rgba(45,212,191,.5); transform: translateY(-3px); }
      `}</style>
    </Section>
  )
}
