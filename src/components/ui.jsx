import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'

/* Animated number counter that fires when in view */
export function Counter({ to, suffix = '', prefix = '', duration = 1.8, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, duration])

  const display = Number.isInteger(to) ? Math.round(val) : val.toFixed(1)
  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

/* Section wrapper with consistent padding */
export function Section({ children, id, style }) {
  return (
    <section
      id={id}
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '5rem 1.5rem',
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </section>
  )
}

/* Eyebrow label + big gradient heading */
export function Heading({ eyebrow, title, gradient = 'text-grad-premium', center, sub }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 48 }}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text-cyan)',
            fontSize: 13,
            letterSpacing: 3,
            fontFamily: 'JetBrains Mono',
            marginBottom: 14,
            textTransform: 'uppercase',
          }}
        >
          <span style={{ width: 24, height: 1, background: 'var(--cyan-core)' }} />
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={gradient}
        style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 800, lineHeight: 1.05 }}
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            color: 'var(--text-secondary)',
            marginTop: 16,
            maxWidth: 560,
            marginLeft: center ? 'auto' : 0,
            marginRight: center ? 'auto' : 0,
            lineHeight: 1.7,
          }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  )
}

/* Reusable reveal-on-scroll wrapper with stagger support */
export function Reveal({ children, delay = 0, y = 24, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  )
}
