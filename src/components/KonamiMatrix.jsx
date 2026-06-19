import { useEffect, useRef, useState } from 'react'

const SEQ = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export default function KonamiMatrix() {
  const [active, setActive] = useState(false)
  const canvasRef = useRef(null)
  const idx = useRef(0)

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (key === SEQ[idx.current]) {
        idx.current++
        if (idx.current === SEQ.length) {
          idx.current = 0
          setActive(true)
        }
      } else {
        idx.current = key === SEQ[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const fontSize = 16
    const cols = Math.floor(canvas.width / fontSize)
    const drops = Array(cols).fill(1)
    const chars = '0xABCDEF0123456789ΞⒷ⟠SOLIDITYEVML2'

    const draw = () => {
      ctx.fillStyle = 'rgba(3,1,10,0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#2dd4bf'
      ctx.font = `${fontSize}px JetBrains Mono, monospace`
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    const stop = setTimeout(() => setActive(false), 8000)
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(stop)
      window.removeEventListener('keydown', onKey)
    }
  }, [active])

  if (!active) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99000, background: '#08080c' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          width: '100%',
          textAlign: 'center',
          color: 'var(--cyan-core)',
          fontFamily: 'JetBrains Mono',
          fontSize: 13,
          letterSpacing: 2,
        }}
      >
        ⟠ KONAMI UNLOCKED — press ESC to exit ⟠
      </div>
    </div>
  )
}
