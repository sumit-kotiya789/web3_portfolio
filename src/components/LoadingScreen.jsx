import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: 'var(--bg-void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      {/* Assembling hex logo */}
      <div style={{ position: 'relative', width: 120, height: 134 }}>
        <motion.div
          className="hex"
          initial={{ scale: 0.2, opacity: 0, rotate: -90 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: 0,
            background: ['#d6d9e3', '#2dd4bf', '#2dd4bf', '#ecedf2'],
          }}
          transition={{ duration: 2.2, ease: 'easeOut', times: [0, 0.4, 0.7, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 60px rgba(45,212,191,0.6)',
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 800,
              fontSize: 44,
              color: '#08080c',
              letterSpacing: 1,
            }}
          >
            SK
          </motion.span>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.6, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--text-secondary)',
          fontSize: 14,
          letterSpacing: 1,
        }}
      >
        Initializing on-chain experience<span className="dots">...</span>
      </motion.p>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 3,
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
          style={{ height: '100%', background: 'var(--grad-hero)' }}
        />
      </div>
    </motion.div>
  )
}
