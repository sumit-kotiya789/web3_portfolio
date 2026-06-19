import { useEffect, useRef } from 'react'

function ParticleNetwork() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Respect users who prefer reduced motion — skip the loop entirely.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let w, h
    const nodes = []
    const COUNT = window.innerWidth < 768 ? 18 : 38
    const LINK_DIST = 130
    const LINK_DIST_SQ = LINK_DIST * LINK_DIST

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
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      })
    }

    // Throttle to ~30fps — visually identical for this effect, half the CPU.
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
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1

        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(45,212,191,0.7)'
        ctx.fill()

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j]
          const dx = n.x - m.x
          const dy = n.y - m.y
          const distSq = dx * dx + dy * dy
          if (distSq < LINK_DIST_SQ) {
            const dist = Math.sqrt(distSq)
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(m.x, m.y)
            ctx.strokeStyle = `rgba(45,212,191,${0.14 * (1 - dist / LINK_DIST)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
    }
    raf = requestAnimationFrame(draw)

    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 200)
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.55,
        pointerEvents: 'none',
      }}
    />
  )
}

export default function Background() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Static mesh gradient (motion comes from the orbs below — cheaper than
          animating a full-screen background-position every frame). */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(120deg, #08080c 0%, #0b0b11 30%, #0d0d14 55%, #0a0a10 80%, #08080c 100%)',
        }}
      />
      {/* Floating orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '45vw',
          height: '45vw',
          maxWidth: 620,
          maxHeight: 620,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.38), transparent 65%)',
          filter: 'blur(80px)',
          animation: 'orbDrift1 26s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-8%',
          width: '42vw',
          height: '42vw',
          maxWidth: 580,
          maxHeight: 580,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.20), transparent 65%)',
          filter: 'blur(90px)',
          animation: 'orbDrift2 30s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '55%',
          width: '34vw',
          height: '34vw',
          maxWidth: 460,
          maxHeight: 460,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 65%)',
          filter: 'blur(90px)',
          animation: 'orbDrift3 24s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <ParticleNetwork />
      {/* Vignette + grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 40%, transparent 40%, rgba(8,8,12,0.7) 100%)',
        }}
      />
    </div>
  )
}
