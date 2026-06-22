import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useEnsName,
  useSignMessage,
  useSwitchChain,
  useChainId,
} from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { recoverMessageAddress } from 'viem'
import { Wallet as WalletIcon, Copy, Check, Plus, PenLine, ShieldCheck, ShieldAlert, RotateCcw } from 'lucide-react'
import { Section, Heading } from '../components/ui'
import Blockies from '../components/Blockies'
import LiveChainStats from '../components/LiveChainStats'
import { taaqo, CHAIN_META } from '../lib/wagmi'

const TAAQO_PARAMS = {
  chainId: '0x' + taaqo.id.toString(16),
  chainName: 'Taaqo L2',
  nativeCurrency: { name: 'Taaqo', symbol: 'TAAQO', decimals: 18 },
  rpcUrls: ['https://rpc.taaqo.com'],
  blockExplorerUrls: ['https://taaqoscan.com'],
}

function Card({ children, accent = 'var(--violet-core)', style }) {
  return (
    <div
      className="glass"
      style={{
        padding: 26,
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${accent}44`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: accent,
          filter: 'blur(70px)',
          opacity: 0.18,
        }}
      />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

function PreConnect() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}
    >
      <Card accent="var(--magenta-pop)" style={{ padding: 48 }}>
        <motion.div className="float-anim" style={{ display: 'inline-flex', marginBottom: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 28,
              background: 'var(--glass-violet)',
              border: '1px solid var(--border-violet)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 50px rgba(45,212,191,0.5)',
            }}
          >
            <WalletIcon size={44} style={{ color: 'var(--violet-glow)' }} />
          </div>
        </motion.div>
        <h3 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Sora', marginBottom: 12 }}>
          Enter the on-chain experience
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
          Connect your wallet to view your balance, switch networks, add Taaqo L2 and sign messages —
          all fully on-chain.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button className="btn-fire cursor-grow" onClick={openConnectModal} style={{ fontSize: 16, padding: '1rem 2.4rem' }}>
                <WalletIcon size={18} /> Connect Wallet
              </button>
            )}
          </ConnectButton.Custom>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 20 }}>
          MetaMask · WalletConnect · Coinbase · Trust Wallet
        </p>
      </Card>
    </motion.div>
  )
}

function NetworkSwitcher() {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()
  const ids = [mainnet.id, 56, 137, taaqo.id]
  return (
    <Card accent="var(--cyan-core)">
      <h4 style={{ fontSize: 13, letterSpacing: 2, color: 'var(--text-cyan)', marginBottom: 16 }}>NETWORK SWITCHER</h4>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {ids.map((id) => {
          const meta = CHAIN_META[id]
          const activeChain = chainId === id
          return (
            <button
              key={id}
              disabled={isPending}
              onClick={() => switchChain({ chainId: id })}
              className="cursor-grow"
              style={{
                padding: '9px 18px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: activeChain ? '1px solid transparent' : '1px solid var(--border-violet)',
                background: activeChain ? 'var(--magenta-pop)' : 'var(--glass-violet)',
                color: activeChain ? '#fff' : 'var(--text-violet)',
                boxShadow: activeChain ? '0 0 20px rgba(45,212,191,0.4)' : 'none',
                transition: 'all .25s',
              }}
            >
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: meta?.color, boxShadow: `0 0 8px ${meta?.color}` }} />
              {meta?.label}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

function AddTaaqoCard() {
  const [status, setStatus] = useState('idle')
  const addNetwork = async () => {
    if (!window.ethereum) {
      setStatus('error')
      return
    }
    try {
      await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [TAAQO_PARAMS] })
      setStatus('added')
    } catch {
      setStatus('error')
    }
  }
  return (
    <Card accent="var(--emerald-live)">
      <h4 style={{ fontSize: 13, letterSpacing: 2, color: 'var(--emerald-live)', marginBottom: 16 }}>ADD TAAQO NETWORK</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          ['Chain ID', '5566'],
          ['Symbol', 'TAAQO'],
          ['RPC', 'rpc.taaqo.com'],
          ['Explorer', 'taaqoscan.com'],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>{k}</div>
            <div style={{ fontSize: 14, color: 'var(--emerald-soft)', fontFamily: 'JetBrains Mono', wordBreak: 'break-all' }}>{v}</div>
          </div>
        ))}
      </div>
      <button
        onClick={addNetwork}
        className="cursor-grow"
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: 14,
          border: '1px solid var(--emerald-live)',
          background: 'rgba(45,212,191,0.12)',
          color: 'var(--emerald-live)',
          fontWeight: 700,
          fontSize: 15,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: '0 0 24px rgba(45,212,191,0.25)',
          cursor: 'none',
        }}
      >
        {status === 'added' ? <><Check size={18} /> Added!</> : <><Plus size={18} /> Add to MetaMask</>}
      </button>
      {status === 'error' && (
        <p style={{ color: 'var(--magenta-soft)', fontSize: 12, marginTop: 10, textAlign: 'center' }}>
          No injected wallet found (install MetaMask).
        </p>
      )}
    </Card>
  )
}

function SignDemo() {
  const { address } = useAccount()
  const [message, setMessage] = useState('I am verifying ownership of this wallet on Sumit Kotiya — Web3 Portfolio.')
  const [recovered, setRecovered] = useState(null) // address recovered from the signature
  const [verifying, setVerifying] = useState(false)
  const { signMessage, data: signature, isPending, reset } = useSignMessage()

  // Once a signature comes back, cryptographically recover the signer and
  // confirm it matches the connected wallet — real verification, not a label.
  useEffect(() => {
    if (!signature) return
    let cancelled = false
    setVerifying(true)
    recoverMessageAddress({ message, signature })
      .then((addr) => { if (!cancelled) setRecovered(addr) })
      .catch(() => { if (!cancelled) setRecovered('error') })
      .finally(() => { if (!cancelled) setVerifying(false) })
    return () => { cancelled = true }
  }, [signature, message])

  const clear = () => {
    reset()
    setRecovered(null)
    setVerifying(false)
  }

  const isMatch =
    recovered && recovered !== 'error' && address &&
    recovered.toLowerCase() === address.toLowerCase()

  return (
    <Card accent="var(--violet-core)">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h4 style={{ fontSize: 13, letterSpacing: 2, color: 'var(--text-violet)' }}>SIGN &amp; VERIFY MESSAGE</h4>
        {signature && (
          <button
            onClick={clear}
            className="cursor-grow"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'none' }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>
      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value)
          clear()
        }}
        rows={3}
        className="glass-input"
        style={{ width: '100%', resize: 'vertical', marginBottom: 14 }}
      />
      <button
        onClick={() => signMessage({ message })}
        disabled={isPending || verifying || !message}
        className="btn-magenta cursor-grow"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        <PenLine size={16} /> {isPending ? 'Awaiting signature…' : verifying ? 'Verifying…' : 'Sign with Wallet'}
      </button>
      <AnimatePresence>
        {signature && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 16 }}>
              {/* Verification verdict */}
              {!verifying && recovered && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                    fontWeight: 600,
                    color: isMatch ? 'var(--emerald-live)' : 'var(--magenta-soft)',
                  }}
                >
                  {isMatch ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                  {isMatch
                    ? 'Signature verified — recovered signer matches your wallet ✓'
                    : recovered === 'error'
                      ? 'Could not recover signer'
                      : 'Signer mismatch'}
                </div>
              )}

              {/* Recovered signer address */}
              {recovered && recovered !== 'error' && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 4 }}>RECOVERED SIGNER</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12.5, color: isMatch ? 'var(--emerald-soft)' : 'var(--magenta-soft)', wordBreak: 'break-all' }}>
                    {recovered}
                  </div>
                </div>
              )}

              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 4 }}>SIGNATURE</div>
              <div
                style={{
                  background: '#08080c',
                  border: '1px solid var(--border-cyan)',
                  borderRadius: 12,
                  padding: 12,
                  fontFamily: 'JetBrains Mono',
                  fontSize: 12,
                  color: 'var(--cyan-soft)',
                  wordBreak: 'break-all',
                  maxHeight: 120,
                  overflowY: 'auto',
                }}
              >
                {signature}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function Dashboard() {
  const { address, chain } = useAccount()
  const { data: balance } = useBalance({ address })
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const { data: ensName } = useEnsName({ address, chainId: mainnet.id })
  const [copied, setCopied] = useState(false)

  const meta = chain ? CHAIN_META[chain.id] : null
  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''

  const copy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}
    >
      {/* Wallet card */}
      <Card accent="var(--violet-core)" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div
            style={{
              padding: 4,
              borderRadius: '50%',
              border: '2px solid var(--cyan-core)',
              boxShadow: '0 0 22px rgba(45,212,191,0.4)',
            }}
          >
            <Blockies address={address} size={8} scale={7} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)' }}>
                {short}
              </span>
              <button onClick={copy} className="cursor-grow" style={{ background: 'none', border: 'none', color: 'var(--cyan-core)', cursor: 'none' }}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            {ensName && <div style={{ color: 'var(--gold-premium)', fontWeight: 600, marginTop: 2 }}>{ensName}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span
                style={{
                  fontSize: 12,
                  padding: '3px 12px',
                  borderRadius: 999,
                  background: `${meta?.color || '#888'}22`,
                  color: meta?.color || 'var(--text-secondary)',
                  border: `1px solid ${meta?.color || '#888'}55`,
                  fontWeight: 600,
                }}
              >
                {meta?.label || chain?.name || 'Unknown'}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right', minWidth: 140 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: 1 }}>BALANCE</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--gold-premium)', fontFamily: 'Sora' }}>
              {balance ? Number(balance.formatted).toFixed(4) : '0.0000'}
            </div>
            <div style={{ color: 'var(--gold-soft)', fontSize: 13 }}>{balance?.symbol || 'ETH'}</div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
              <span className="live-dot" style={{ background: 'var(--cyan-core)' }} />
              <span style={{ fontSize: 12, color: 'var(--cyan-soft)', fontFamily: 'JetBrains Mono' }}>
                #{blockNumber ? blockNumber.toString() : '—'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <AddTaaqoCard />
      <NetworkSwitcher />
      <div style={{ gridColumn: '1 / -1' }}>
        <SignDemo />
      </div>
    </motion.div>
  )
}

export default function Wallet() {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <Section style={{ paddingTop: 130 }}>
      <Heading
        eyebrow="On-Chain"
        title="WEB3 GATEWAY"
        gradient="text-grad-ocean"
        center
        sub="A fully functional wallet experience — connect, switch chains, add Taaqo L2 and sign messages."
      />
      {mounted && <LiveChainStats />}
      {!mounted ? null : isConnected ? <Dashboard /> : <PreConnect />}

      <style>{`
        .glass-input {
          background: var(--glass-violet);
          border: 1px solid var(--border-cyan);
          border-radius: 14px;
          padding: 12px 14px;
          color: var(--text-primary);
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          outline: none;
          transition: border-color .25s, box-shadow .25s;
        }
        .glass-input:focus {
          border-color: var(--cyan-core);
          box-shadow: 0 0 18px var(--cyan-glow);
        }
      `}</style>
    </Section>
  )
}
