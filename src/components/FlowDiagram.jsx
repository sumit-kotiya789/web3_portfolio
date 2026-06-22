import { motion } from 'framer-motion'
import { ArrowDown, LogIn, Box, ArrowLeftRight, LogOut, Share2 } from 'lucide-react'

const TONES = {
  in:   { color: '#2dd4bf', icon: LogIn },
  core: { color: '#d6d9e3', icon: Box },
  move: { color: '#5eead4', icon: ArrowLeftRight },
  out:  { color: '#F3BA2F', icon: LogOut },
  fan:  { color: '#2dd4bf', icon: Share2 },
}

export default function FlowDiagram({ flow = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      {flow.map((step, i) => {
        const tone = TONES[step.tone] || TONES.core
        const Icon = tone.icon
        const isCore = step.tone === 'core'
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              style={{
                width: '100%',
                maxWidth: 420,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                borderRadius: 14,
                background: isCore ? `${tone.color}1f` : 'var(--glass-violet)',
                border: `1px solid ${tone.color}${isCore ? '88' : '44'}`,
                boxShadow: isCore ? `0 0 28px -8px ${tone.color}` : 'var(--glass-shadow)',
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `${tone.color}22`,
                  border: `1px solid ${tone.color}55`,
                  color: tone.color,
                }}
              >
                <Icon size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Sora' }}>
                  {step.actor}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>
                  {step.action}
                </div>
              </div>
            </motion.div>
            {i < flow.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 + 0.1 }}
                style={{ color: 'var(--text-muted)', padding: '4px 0' }}
              >
                <ArrowDown size={18} />
              </motion.div>
            )}
          </div>
        )
      })}
    </div>
  )
}
