import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      setHidden(true)
      return
    }

    const dot = dotRef.current
    const ring = ringRef.current
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let raf

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
    }

    const onOver = (e) => {
      const t = e.target
      if (t.closest('a, button, input, textarea, [role="button"], .cursor-grow')) {
        ring.classList.add('cursor-ring--active')
      } else {
        ring.classList.remove('cursor-ring--active')
      }
    }

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    loop()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (hidden) return null

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--violet-core)',
          boxShadow: '0 0 12px var(--violet-core)',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'screen',
        }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid var(--cyan-core)',
          boxShadow: '0 0 16px rgba(45,212,191,0.4)',
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width .25s, height .25s, background .25s, border-color .25s',
        }}
      />
      <style>{`
        .cursor-ring--active {
          width: 56px !important;
          height: 56px !important;
          background: rgba(45,212,191,0.08);
          border-color: var(--magenta-pop) !important;
        }
      `}</style>
    </>
  )
}
