import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/*
  Luffy sits on the hero name (anchored to the "YA"). The canvas is a full-screen,
  click-through overlay using a pixel-accurate orthographic camera, so:

  • Click ANYWHERE on the page  → his arm stretches to that exact spot + "GUM-GUM!"
    (limited to MAX_STRETCHES per page load — resets on reload).
  • Click ON Luffy              → he breaks into a big smile (no anger), unlimited.

  Pixel space: the orthographic camera maps 1 world unit = 1 CSS pixel, origin at
  screen center, +y up. That lets us aim the arm straight at the click coordinates.
*/

const MAX_STRETCHES = 3
const STRETCH_DUR = 0.95
const SMILE_DUR = 1.1
const K = 30            // pixels per figure-unit (overall size; bigger = larger Luffy)
const CHAR_W = 120      // his click bounding box (px)
const CHAR_H = 180
const ANCHOR_DX = 0     // nudge horizontally over the "YA"
const ANCHOR_DY = 0   // nudge so his seat rests on the letters

const SKIN = '#f6b27a'
const VEST = '#d2342c'
const SHORTS = '#2f63c0'
const STRAW = '#e3bd61'
const STRAW_DK = '#caa24b'
const BAND = '#c02626'
const DARK = '#1a1a1f'
const HAIR = '#161310'
const SANDAL = '#b9742f'

function Figure({ anim, anchorRef, bboxRef }) {
  const group = useRef()
  const armR = useRef()
  const armL = useRef()
  const smile = useRef()
  const { size } = useThree()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const g = group.current
    if (!g) return
    const a = anim.current

    if (a.request && !a.active) {
      a.active = a.request
      a.start = t
      a.request = null
    }

    // --- anchor Luffy to the "YA" on screen (follows layout + scroll) ---
    let ax = size.width * 0.62
    let ay = size.height * 0.32
    const el = anchorRef?.current
    if (el) {
      const r = el.getBoundingClientRect()
      ax = r.left + r.width / 2
      ay = r.top
    }
    // screen px → world (center origin, +y up)
    const wx = ax - size.width / 2 + ANCHOR_DX
    const wy = size.height / 2 - ay + ANCHOR_DY
    const bob = Math.sin(t * 2) * 2
    g.position.set(wx, wy + bob, 0)
    g.rotation.set(0, 0, 0)

    // update his screen bounding box (for click hit-testing)
    bboxRef.current = { x: ax - CHAR_W / 2, y: ay - CHAR_H + 30, w: CHAR_W, h: CHAR_H }

    let smileK = 1 + Math.sin(t * 2) * 0.03

    if (a.active === 'smile') {
      const p = (t - a.start) / SMILE_DUR
      if (p >= 1) a.active = null
      else smileK = 1 + Math.sin(p * Math.PI) * 1.1 // big grin
    }

    if (a.active === 'stretch' && armR.current) {
      const p = Math.min((t - a.start) / STRETCH_DUR, 1)
      if (p >= 1) {
        a.active = null
      } else {
        const e = Math.sin(p * Math.PI) // 0 → 1 → 0
        // shoulder position in world px
        const sx = g.position.x + 0.56 * K
        const sy = g.position.y + 0.55 * K
        const dx = a.target.x - sx
        const dy = a.target.y - sy
        const L = Math.hypot(dx, dy)
        // aim the limb (local -y) toward the click point
        armR.current.rotation.x = 0
        armR.current.rotation.z = Math.atan2(dx, -dy)
        // stretch length so the fist reaches the target at the apex
        const targetSy = Math.max(L / (0.78 * K), 1)
        armR.current.scale.y = 1 + (targetSy - 1) * e
        smileK = 1 + e * 0.9 // grins while stretching too
      }
    } else if (armR.current) {
      // friendly idle wave
      armR.current.rotation.x = 0
      armR.current.scale.y = 1
      armR.current.rotation.z = 2.4 + Math.sin(t * 9) * 0.3
    }

    if (smile.current) smile.current.scale.set(smileK, smileK, 1)
    if (armL.current) armL.current.rotation.z = -0.05 + Math.sin(t * 2) * 0.03
  })

  return (
    <group ref={group} scale={K}>
      {/* head */}
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.72, 40, 40]} />
        <meshStandardMaterial color={SKIN} roughness={0.65} />
      </mesh>
      <mesh position={[0, 1.35, -0.16]}>
        <sphereGeometry args={[0.74, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
        <meshStandardMaterial color={HAIR} roughness={0.9} />
      </mesh>
      {/* eyes */}
      <mesh position={[0.26, 1.22, 0.62]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={DARK} />
      </mesh>
      <mesh position={[-0.26, 1.22, 0.62]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={DARK} />
      </mesh>
      {/* under-eye scar */}
      <mesh position={[-0.26, 1.0, 0.66]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.04, 0.18, 0.02]} />
        <meshStandardMaterial color={BAND} />
      </mesh>
      <mesh position={[-0.33, 1.0, 0.66]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.04, 0.18, 0.02]} />
        <meshStandardMaterial color={BAND} />
      </mesh>
      {/* smile — scales into a big grin */}
      <mesh ref={smile} position={[0, 0.9, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.035, 12, 24, Math.PI]} />
        <meshStandardMaterial color={DARK} />
      </mesh>

      {/* straw hat */}
      <group position={[0, 1.6, 0]} rotation={[-0.08, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[1.05, 1.05, 0.07, 32]} />
          <meshStandardMaterial color={STRAW} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.52, 0.6, 0.5, 32]} />
          <meshStandardMaterial color={STRAW_DK} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.16, 32]} />
          <meshStandardMaterial color={BAND} roughness={0.6} />
        </mesh>
      </group>

      {/* neck + torso */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.18, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.45, 0.52, 0.85, 24]} />
        <meshStandardMaterial color={VEST} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.3, 0.42]}>
        <boxGeometry args={[0.16, 0.7, 0.04]} />
        <meshStandardMaterial color={SKIN} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.52, 0.5, 0.34, 24]} />
        <meshStandardMaterial color={SHORTS} roughness={0.6} />
      </mesh>

      {/* arms (pivot at shoulder) */}
      <group ref={armR} position={[0.56, 0.55, 0]}>
        <mesh position={[0, -0.38, 0]}>
          <capsuleGeometry args={[0.14, 0.55, 8, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.78, 0]}>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
      </group>
      <group ref={armL} position={[-0.56, 0.55, 0]}>
        <mesh position={[0, -0.38, 0]}>
          <capsuleGeometry args={[0.14, 0.55, 8, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.78, 0]}>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
      </group>

      {/* legs folded forward — seated pose */}
      <group position={[0.24, -0.5, 0.1]} rotation={[-1.25, 0, 0]}>
        <mesh position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.17, 0.5, 8, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.64, 0.02]}>
          <boxGeometry args={[0.34, 0.5, 0.12]} />
          <meshStandardMaterial color={SANDAL} roughness={0.8} />
        </mesh>
      </group>
      <group position={[-0.24, -0.5, 0.1]} rotation={[-1.25, 0, 0]}>
        <mesh position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.17, 0.5, 8, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.64, 0.02]}>
          <boxGeometry args={[0.34, 0.5, 0.12]} />
          <meshStandardMaterial color={SANDAL} roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

export default function LuffyMascot({ anchorRef }) {
  const [pop, setPop] = useState(null) // { id, text, x, y, kind }
  // Skip the full-screen 3D overlay on phones/tablets: it's a decorative
  // easter egg and a continuous WebGL canvas is wasteful on small/touch devices.
  const [enabled, setEnabled] = useState(false)
  const anim = useRef({ request: null, active: null, start: 0, target: new THREE.Vector3() })
  const bboxRef = useRef({ x: 0, y: 0, w: 0, h: 0 })
  const countRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const onClick = (e) => {
      const cx = e.clientX
      const cy = e.clientY
      const b = bboxRef.current
      const onLuffy = cx >= b.x && cx <= b.x + b.w && cy >= b.y && cy <= b.y + b.h

      // clicking Luffy → big smile (unlimited)
      if (onLuffy) {
        if (!anim.current.active) {
          anim.current.request = 'smile'
          setPop({ id: Date.now(), text: '♥', x: cx, y: cy - 24, kind: 'smile' })
          window.setTimeout(() => setPop((p) => (p && Date.now() - p.id >= 900 ? null : p)), 950)
        }
        return
      }

      // clicking elsewhere → stretch to that point (max 3 per reload)
      if (anim.current.active) return
      if (countRef.current >= MAX_STRETCHES) return
      anim.current.target.set(cx - window.innerWidth / 2, window.innerHeight / 2 - cy, 0)
      anim.current.request = 'stretch'
      countRef.current += 1
      setPop({ id: Date.now(), text: 'GUM-GUM!', x: cx, y: cy, kind: 'hit' })
      window.setTimeout(() => setPop((p) => (p && Date.now() - p.id >= 1000 ? null : p)), 1050)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [enabled])

  if (!enabled) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
      {pop && (
        <span
          key={pop.id}
          style={{
            position: 'fixed',
            left: pop.x,
            top: pop.y,
            transform: 'translate(-50%, -120%)',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 900,
            fontSize: pop.kind === 'hit' ? 22 : 26,
            letterSpacing: 1,
            color: pop.kind === 'hit' ? '#ffd23f' : '#ff5d8f',
            WebkitTextFillColor: pop.kind === 'hit' ? '#ffd23f' : '#ff5d8f',
            WebkitTextStroke: pop.kind === 'hit' ? '1.5px #c02626' : '0',
            textShadow: '0 2px 6px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            zIndex: 4,
            animation: 'gumPop 1s cubic-bezier(.22,1.4,.36,1) forwards',
          }}
        >
          {pop.text}
        </span>
      )}

      <Canvas
        orthographic
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 100], zoom: 1 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 5, 5]} intensity={1.4} />
        <directionalLight position={[-4, 2, 3]} intensity={0.4} color="#9ec5ff" />
        <Figure anim={anim} anchorRef={anchorRef} bboxRef={bboxRef} />
      </Canvas>

      <style>{`
        @keyframes gumPop {
          0%   { opacity: 0; transform: translate(-50%, -120%) scale(.3) rotate(-8deg); }
          35%  { opacity: 1; transform: translate(-50%, -120%) scale(1.15) rotate(4deg); }
          70%  { opacity: 1; transform: translate(-50%, -130%) scale(1) rotate(-2deg); }
          100% { opacity: 0; transform: translate(-50%, -160%) scale(.9); }
        }
      `}</style>
    </div>
  )
}
