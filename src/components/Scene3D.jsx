import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Float, Icosahedron, Octahedron, TorusKnot, MeshDistortMaterial,
  OrbitControls, Sparkles, Edges,
} from '@react-three/drei'
import * as THREE from 'three'

/* Reads the active theme accent from --particle ("80, 230, 190") and reacts
   to data-theme flips, so every 3D centerpiece recolors with the site. */
function useThemeColor() {
  const read = () => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--particle').trim()
    const [r, g, b] = (raw || '80,230,190').split(',').map((n) => parseInt(n, 10) / 255)
    return new THREE.Color(r, g, b)
  }
  const [color, setColor] = useState(() => read())
  useEffect(() => {
    const obs = new MutationObserver(() => setColor(read()))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return color
}

/* Glowing nodes pinned to an icosahedron's vertices. */
function Nodes({ color, radius = 1.55 }) {
  const points = useRef(
    (() => {
      const geo = new THREE.IcosahedronGeometry(radius, 1)
      const pos = geo.attributes.position
      const seen = new Set()
      const pts = []
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i)
        const key = `${v.x.toFixed(2)}|${v.y.toFixed(2)}|${v.z.toFixed(2)}`
        if (seen.has(key)) continue
        seen.add(key)
        pts.push(v)
      }
      geo.dispose()
      return pts
    })(),
  )
  return (
    <group>
      {points.current.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/* network — node sphere (Home / generic) */
function NetworkObject({ color }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.12
    ref.current.rotation.x += dt * 0.04
  })
  return (
    <group ref={ref}>
      <Icosahedron args={[1.1, 6]}>
        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.45} roughness={0.15} metalness={0.9} distort={0.35} speed={1.6} />
      </Icosahedron>
      <Icosahedron args={[1.55, 1]}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.35} toneMapped={false} />
      </Icosahedron>
      <Nodes color={color} />
    </group>
  )
}

/* knot — interlocking torus knot (bridges / connection) */
function KnotObject({ color }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.25
    ref.current.rotation.z += dt * 0.08
  })
  return (
    <group ref={ref}>
      <TorusKnot args={[1, 0.32, 180, 24]}>
        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.1} metalness={0.95} distort={0.18} speed={1.2} />
      </TorusKnot>
      <TorusKnot args={[1, 0.34, 90, 12]}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.18} toneMapped={false} />
      </TorusKnot>
    </group>
  )
}

/* crystal — faceted octahedron with glowing edges (contracts / tokens) */
function CrystalObject({ color }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.3
    ref.current.rotation.x = Math.sin(performance.now() * 0.0003) * 0.4
  })
  return (
    <group ref={ref}>
      <Octahedron args={[1.4, 0]}>
        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.05} metalness={1} distort={0.12} speed={1} transparent opacity={0.92} />
        <Edges scale={1.001} threshold={15} color={color} />
      </Octahedron>
      <Octahedron args={[2.05, 0]}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.14} toneMapped={false} />
      </Octahedron>
      <Nodes color={color} radius={2.05} />
    </group>
  )
}

const VARIANTS = { network: NetworkObject, knot: KnotObject, crystal: CrystalObject }

function Scene({ variant, color }) {
  const Obj = VARIANTS[variant] || NetworkObject
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={60} color={color} />
      <pointLight position={[-5, -3, -4]} intensity={30} color={color} />
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.8}>
        <Obj color={color} />
      </Float>
      <Sparkles count={60} scale={6} size={2.4} speed={0.4} color={color} opacity={0.6} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
    </>
  )
}

/* Reusable theme-aware 3D centerpiece.
   <Scene3D variant="knot" height={420} /> */
export default function Scene3D({ variant = 'network', height = 360, interactive = true }) {
  const color = useThemeColor()
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div style={{ width: '100%', height, cursor: interactive ? 'grab' : 'default' }}>
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        frameloop={reduced ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <Scene variant={variant} color={color} />
        </Suspense>
      </Canvas>
    </div>
  )
}
