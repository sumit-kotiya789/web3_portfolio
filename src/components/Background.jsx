import { useEffect, useRef } from 'react'

/* Subtle floating particle network — depth without noise. */
function ParticleNetwork() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf, w, h
    const particleRGB = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--particle').trim() || '80,230,190'
    let rgb = particleRGB()
    const nodes = []
    const COUNT = window.innerWidth < 768 ? 14 : 30
    const LINK = 150
    const LINK_SQ = LINK * LINK

    let resizeTimer
    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    for (let i = 0; i < COUNT; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
      })
    }

    const FRAME_MS = 1000 / 30
    let last = 0
    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (document.hidden) return
      if (now - last < FRAME_MS) return
      last = now
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},0.55)`
        ctx.fill()
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j]
          const dx = n.x - m.x, dy = n.y - m.y
          const dsq = dx * dx + dy * dy
          if (dsq < LINK_SQ) {
            const d = Math.sqrt(dsq)
            ctx.beginPath()
            ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y)
            ctx.strokeStyle = `rgba(${rgb},${0.1 * (1 - d / LINK)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
    }
    raf = requestAnimationFrame(draw)

    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 200) }
    window.addEventListener('resize', onResize)
    const obs = new MutationObserver(() => { rgb = particleRGB() })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      obs.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.5, pointerEvents: 'none' }}
    />
  )
}

/* Cursor-driven parallax — drifts the aurora layers for depth. */
function useParallax() {
  const ref = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    let raf
    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        el.style.setProperty('--px', String(nx))
        el.style.setProperty('--py', String(ny))
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])
  return ref
}

export default function Background() {
  const ref = useParallax()
  return (
    <div ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Base charcoal mesh */}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-mesh)' }} />

      {/* Aurora ribbons */}
      <div
        style={{
          position: 'absolute',
          top: '-25%', left: '-10%', width: '70vw', height: '70vw',
          maxWidth: 980, maxHeight: 980,
          background: 'radial-gradient(circle at 50% 50%, var(--orb-1), transparent 62%)',
          filter: 'blur(90px)',
          animation: 'orbDrift1 28s ease-in-out infinite',
          translate: 'calc(var(--px,0) * 50px) calc(var(--py,0) * 50px)',
          willChange: 'transform, translate',
          transition: 'translate .4s var(--ease-out)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%', right: '-12%', width: '66vw', height: '66vw',
          maxWidth: 920, maxHeight: 920,
          background: 'radial-gradient(circle at 50% 50%, var(--orb-2), transparent 62%)',
          filter: 'blur(100px)',
          animation: 'orbDrift2 34s ease-in-out infinite',
          translate: 'calc(var(--px,0) * -72px) calc(var(--py,0) * -72px)',
          willChange: 'transform, translate',
          transition: 'translate .4s var(--ease-out)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '34%', left: '52%', width: '46vw', height: '46vw',
          maxWidth: 640, maxHeight: 640,
          background: 'radial-gradient(circle at 50% 50%, var(--orb-3), transparent 64%)',
          filter: 'blur(100px)',
          animation: 'orbDrift3 26s ease-in-out infinite',
          translate: 'calc(var(--px,0) * 100px) calc(var(--py,0) * 100px)',
          willChange: 'transform, translate',
          transition: 'translate .4s var(--ease-out)',
        }}
      />

      <ParticleNetwork />

      {/* Fine grain noise — kills banding on the gradients, adds a premium texture */}
      <div
        style={{
          position: 'absolute', inset: 0,
          opacity: 0.04, mixBlendMode: 'overlay', pointerEvents: 'none',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-vignette)' }} />
    </div>
  )
}
