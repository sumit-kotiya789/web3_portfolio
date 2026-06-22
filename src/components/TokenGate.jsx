import { useAccount, useBalance } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, LockOpen, ShieldCheck, ArrowRight, Wallet as WalletIcon, FileDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { taaqo } from '../lib/wagmi'
import { PROFILE } from '../lib/profile'

/* Minimum native TAAQO required to unlock. Set to 0n to gate on "holds any". */
const MIN_BALANCE = 0n

export default function TokenGate() {
  const { address, isConnected } = useAccount()
  const { data: bal, isLoading } = useBalance({ address, chainId: taaqo.id, query: { enabled: !!address } })

  const held = bal?.value ?? 0n
  const unlocked = isConnected && held > MIN_BALANCE

  return (
    <div
      className="glass"
      style={{
        padding: 28,
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${unlocked ? 'var(--border-cyan)' : 'var(--border-violet)'}`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: unlocked ? 'var(--emerald-live)' : 'var(--violet-core)',
          filter: 'blur(80px)',
          opacity: 0.16,
        }}
      />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--glass-cyan)',
              border: '1px solid var(--border-cyan)',
              color: unlocked ? 'var(--emerald-live)' : 'var(--text-cyan)',
            }}
          >
            {unlocked ? <LockOpen size={22} /> : <Lock size={22} />}
          </div>
          <div>
            <h4 style={{ fontSize: 13, letterSpacing: 2, color: 'var(--text-cyan)' }}>TOKEN-GATED AREA</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: 12.5, marginTop: 3 }}>
              Unlocks for wallets holding TAAQO on chain 5566
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div key="connect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
                Connect a wallet that holds TAAQO to reveal a members-only panel. The check runs entirely on-chain
                against your live balance — nothing is stored.
              </p>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button onClick={openConnectModal} className="btn-magenta cursor-grow">
                    <WalletIcon size={16} /> Connect to unlock
                  </button>
                )}
              </ConnectButton.Custom>
            </motion.div>
          ) : isLoading ? (
            <motion.p key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Checking your TAAQO balance…
            </motion.p>
          ) : unlocked ? (
            <motion.div key="unlocked" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--emerald-live)', fontWeight: 600, marginBottom: 14 }}>
                <ShieldCheck size={17} /> Access granted — {Number(bal.formatted).toFixed(4)} TAAQO detected
              </div>
              <div
                style={{
                  background: 'var(--glass-cyan)',
                  border: '1px solid var(--border-cyan)',
                  borderRadius: 14,
                  padding: 18,
                }}
              >
                <p style={{ color: 'var(--text-primary)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 14 }}>
                  👋 You're a TAAQO holder — welcome to the members panel. As a token-holder you get my résumé and a
                  priority line for collaboration.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <a href={PROFILE.resumeUrl} download target="_blank" rel="noreferrer" className="btn-ghost cursor-grow">
                    <FileDown size={16} /> Download résumé
                  </a>
                  <Link to="/contact" className="btn-magenta cursor-grow">
                    Priority contact <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="locked" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 14 }}>
                <Lock size={16} /> Connected, but this wallet holds 0 TAAQO.
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>
                Get some TAAQO through one of the live bridges, then this panel unlocks automatically.
              </p>
              <Link to="/projects" className="btn-ghost cursor-grow">
                See the bridges <ArrowRight size={16} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
