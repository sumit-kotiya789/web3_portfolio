import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Icosahedron, MeshDistortMaterial, OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/* Reads the active theme's accent colour from the --particle CSS var (e.g. "45, 212, 191")
   and re-reads it whenever the data-theme attribute flips. */
function useThemeColor() {
  const read = () => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--particle').trim()
    const [r, g, b] = (raw || '45,212,191').split(',').map((n) => parseInt(n, 10) / 255)
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

/* Small glowing spheres pinned to the vertices of an icosahedron — the "nodes". */
function Nodes({ color, radius = 1.55 }) {
  const positions = useRef(
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
      {positions.current.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function NetworkSphere({ color }) {
  const wire = useRef()
  useFrame((_, dt) => {
    if (wire.current) {
      wire.current.rotation.y += dt * 0.12
      wire.current.rotation.x += dt * 0.04
    }
  })
  return (
    <group ref={wire}>
      {/* Distorted glowing core */}
      <Icosahedron args={[1.1, 6]}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.15}
          metalness={0.9}
          distort={0.35}
          speed={1.6}
        />
      </Icosahedron>
      {/* Wireframe shell */}
      <Icosahedron args={[1.55, 1]}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.35} toneMapped={false} />
      </Icosahedron>
      <Nodes color={color} />
    </group>
  )
}

function Scene() {
  const color = useThemeColor()
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={60} color={color} />
      <pointLight position={[-5, -3, -4]} intensity={30} color={color} />
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.8}>
        <NetworkSphere color={color} />
      </Float>
      <Sparkles count={60} scale={6} size={2.4} speed={0.4} color={color} opacity={0.6} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
    </>
  )
}

export default function Hero3D({ height = 360 }) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div style={{ width: '100%', height, cursor: 'grab' }}>
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        frameloop={reduced ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
