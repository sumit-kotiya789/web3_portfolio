import { useRef, useState } from 'react'

/* A dependency-free 3D tilt wrapper. The element rotates toward the cursor in
   real perspective space and lifts a subtle glare highlight. Respects reduced-motion.
   Drop it around any card/panel:  <TiltCard className="glass">…</TiltCard> */
export default function TiltCard({
  children,
  className,
  style,
  max = 10,          // max rotation in degrees
  scale = 1.02,      // hover lift scale
  glare = true,
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null)
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false })

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onMove = (e) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width   // 0..1
    const py = (e.clientY - r.top) / r.height   // 0..1
    setT({
      rx: (0.5 - py) * 2 * max,
      ry: (px - 0.5) * 2 * max,
      gx: px * 100,
      gy: py * 100,
      active: true,
    })
  }

  const onLeave = () => setT({ rx: 0, ry: 0, gx: 50, gy: 50, active: false })

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        transform: `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.active ? scale : 1})`,
        transformStyle: 'preserve-3d',
        transition: t.active ? 'transform .08s ease-out' : 'transform .5s cubic-bezier(.22,1,.36,1)',
        position: 'relative',
        willChange: 'transform',
        ...style,
      }}
      {...rest}
    >
      {children}
      {glare && !reduced && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            opacity: t.active ? 1 : 0,
            transition: 'opacity .4s ease',
            background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.18), transparent 55%)`,
          }}
        />
      )}
    </Tag>
  )
}
