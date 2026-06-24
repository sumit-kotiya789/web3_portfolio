import { useEffect, useRef } from 'react'

/* A soft radial "lighting" that follows the cursor — premium mouse-follow glow.
   Pure GPU transform on every mousemove (no easing lag), desktop pointers only.
   It tightens + brightens over interactive elements. */
export default function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2

    const render = () => {
      raf = 0
      if (el) el.style.transform = `translate3d(${x - 250}px, ${y - 250}px, 0)`
    }
    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(render)
    }
    const onOver = (e) => {
      if (!el) return
      const interactive = e.target.closest('a, button, [role="button"], input, textarea, .cursor-grow')
      el.style.opacity = interactive ? '0.9' : '0.6'
      el.style.scale = interactive ? '0.55' : '1'
    }

    el.style.opacity = '0.6'
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 500,
        height: 500,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0,
        background:
          'radial-gradient(circle, rgba(45,226,166,0.18) 0%, rgba(20,184,166,0.09) 35%, transparent 70%)',
        mixBlendMode: 'screen',
        transition: 'opacity .4s ease, scale .35s var(--ease)',
        willChange: 'transform',
      }}
    />
  )
}
