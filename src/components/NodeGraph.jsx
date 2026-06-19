import { motion } from 'framer-motion'

/* Animated blockchain node visualization — violet nodes, cyan links */
export default function NodeGraph({ height = 320, count = 7 }) {
  // deterministic positions for a pleasing constellation
  const base = [
    { x: 20, y: 30 },
    { x: 50, y: 15 },
    { x: 80, y: 32 },
    { x: 35, y: 60 },
    { x: 65, y: 62 },
    { x: 18, y: 82 },
    { x: 85, y: 78 },
    { x: 50, y: 45 },
  ].slice(0, count)

  const links = [
    [0, 1], [1, 2], [0, 3], [1, 7], [2, 4], [3, 7], [4, 7],
    [3, 5], [4, 6], [5, 7], [6, 7], [0, 7], [2, 7],
  ]

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {links.map(([a, b], i) => {
          if (!base[a] || !base[b]) return null
          return (
            <motion.line
              key={i}
              x1={base[a].x}
              y1={base[a].y}
              x2={base[b].x}
              y2={base[b].y}
              stroke="url(#linkGrad)"
              strokeWidth="0.4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: i * 0.08 }}
            />
          )
        })}
        <defs>
          <linearGradient id="linkGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
      </svg>

      {base.map((n, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 200 }}
          style={{
            position: 'absolute',
            left: `${n.x}%`,
            top: `${n.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.25, 1], boxShadow: [
              '0 0 8px rgba(45,212,191,0.6)',
              '0 0 20px rgba(45,212,191,0.8)',
              '0 0 8px rgba(45,212,191,0.6)',
            ] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
            style={{
              width: i === count - 1 ? 16 : 11,
              height: i === count - 1 ? 16 : 11,
              borderRadius: '50%',
              background: i === count - 1 ? 'var(--cyan-core)' : 'var(--violet-core)',
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
