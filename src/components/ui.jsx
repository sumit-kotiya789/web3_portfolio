import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'

const SPRING = { type: 'spring', stiffness: 260, damping: 28 }
const EASE = [0.16, 1, 0.3, 1]

/* Animated number counter, fires when scrolled into view. Tabular figures. */
export function Counter({ to, suffix = '', prefix = '', duration = 1.8, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration, ease: EASE, onUpdate: (v) => setVal(v) })
    return () => controls.stop()
  }, [inView, to, duration])

  const display = Number.isInteger(to) ? Math.round(val) : val.toFixed(1)
  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{display}{suffix}
    </span>
  )
}

/* Section wrapper with consistent rhythm. */
export function Section({ children, id, style }) {
  return (
    <section id={id} className="section-wrap" style={style}>
      {children}
    </section>
  )
}

/* Eyebrow label + big gradient heading. */
export function Heading({ eyebrow, title, gradient = 'text-grad-premium', center, sub, style }) {
  return (
    <div
      className="heading-wrap"
      style={{ textAlign: center ? 'center' : 'left', maxWidth: center ? 760 : 820, marginInline: center ? 'auto' : undefined, ...style }}
    >
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={center ? 'eyebrow center' : 'eyebrow'}
          style={{ marginBottom: 18, justifyContent: center ? 'center' : 'flex-start' }}
        >
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
        className={gradient}
        style={{ fontSize: 'var(--fs-h2)', fontWeight: 700 }}
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          style={{
            color: 'var(--text-secondary)',
            marginTop: 18,
            fontSize: 'var(--fs-lead)',
            lineHeight: 1.6,
            maxWidth: 620,
            marginLeft: center ? 'auto' : 0,
            marginRight: center ? 'auto' : 0,
          }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  )
}

/* Reveal-on-scroll wrapper with blur + lift. */
export function Reveal({ children, delay = 0, y = 28, style, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/* Magnetic — element drifts toward the cursor and springs back.
   Used on CTAs / icon buttons for a tactile, expensive feel. */
export function Magnetic({ children, strength = 0.35, className, style, as = 'div' }) {
  const ref = useRef(null)
  const Comp = motion[as] || motion.div

  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const fine =
    typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

  const onMove = (e) => {
    if (reduced || !fine || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const mx = e.clientX - (r.left + r.width / 2)
    const my = e.clientY - (r.top + r.height / 2)
    ref.current.style.transform = `translate(${mx * strength}px, ${my * strength}px)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0px, 0px)'
  }

  return (
    <Comp
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: 'transform .35s var(--ease)', willChange: 'transform', display: 'inline-flex', ...style }}
    >
      {children}
    </Comp>
  )
}

/* Animated gradient-border card. Pair with .glass content inside. */
export function GradientBorder({ children, className, style, radius }) {
  return (
    <div className={`gradient-border ${className || ''}`} style={{ borderRadius: radius, ...style }}>
      {children}
    </div>
  )
}

export { SPRING, EASE }
