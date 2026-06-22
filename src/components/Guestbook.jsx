import { useEffect, useState } from 'react'
import {
  useAccount, useChainId, useSwitchChain,
  useReadContract, useWriteContract, useWaitForTransactionReceipt,
} from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { mainnet, bsc, polygon } from 'wagmi/chains'
import { BookOpen, PenLine, Loader2, Wallet as WalletIcon, RefreshCw, ExternalLink, ArrowRightLeft } from 'lucide-react'
import { taaqo, CHAIN_META } from '../lib/wagmi'
import { GUESTBOOK_ABI, GUESTBOOK_ADDRESSES } from '../lib/guestbook'
import Blockies from './Blockies'

const CHAINS = [taaqo.id, mainnet.id, bsc.id, polygon.id]
const MAX_LEN = 280

const EXPLORERS = {
  [mainnet.id]: 'https://etherscan.io/address/',
  [bsc.id]: 'https://bscscan.com/address/',
  [polygon.id]: 'https://polygonscan.com/address/',
  [taaqo.id]: 'https://taaqoscan.com/address/',
}

function timeAgo(ts) {
  const s = Math.max(0, Math.floor(Date.now() / 1000) - Number(ts))
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export default function Guestbook() {
  const [selected, setSelected] = useState(taaqo.id)
  const [msg, setMsg] = useState('')
  const [hash, setHash] = useState(undefined)

  const meta = CHAIN_META[selected]
  const address = GUESTBOOK_ADDRESSES[selected]
  const deployed = !!address

  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: switching } = useSwitchChain()
  const onRightChain = chainId === selected

  const readBase = { chainId: selected, address: address || undefined, abi: GUESTBOOK_ABI }
  const { data: total, refetch: refetchTotal } = useReadContract({
    ...readBase, functionName: 'total', query: { enabled: deployed },
  })
  const { data: entries, refetch: refetchEntries, isLoading, isFetching } = useReadContract({
    ...readBase, functionName: 'getEntries', args: [0n, 25n], query: { enabled: deployed },
  })

  const { writeContractAsync, isPending: writing } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash, chainId: selected })

  useEffect(() => {
    if (!isSuccess) return
    toast.success('Signed on-chain! 🎉')
    setMsg('')
    setHash(undefined)
    refetchTotal()
    refetchEntries()
  }, [isSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

  const busy = writing || confirming
  const tooLong = msg.length > MAX_LEN

  const sign = async () => {
    if (!msg.trim() || tooLong) return
    try {
      const h = await writeContractAsync({
        chainId: selected, address, abi: GUESTBOOK_ABI, functionName: 'sign', args: [msg.trim()],
      })
      setHash(h)
      toast.success('Transaction sent — awaiting confirmation…')
    } catch (e) {
      toast.error(e?.shortMessage || 'Transaction rejected')
    }
  }

  return (
    <div className="glass" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute', top: -60, right: -60, width: 200, height: 200,
          borderRadius: '50%', background: meta?.color, filter: 'blur(90px)', opacity: 0.14,
        }}
      />
      <div style={{ position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--glass-cyan)', border: '1px solid var(--border-cyan)', color: 'var(--text-cyan)',
              }}
            >
              <BookOpen size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: 13, letterSpacing: 2, color: 'var(--text-cyan)' }}>ON-CHAIN GUESTBOOK</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 12.5, marginTop: 3 }}>
                Sign a real transaction — your words live on-chain forever.
              </p>
            </div>
          </div>
          {deployed && (
            <button
              onClick={() => { refetchTotal(); refetchEntries() }}
              className="cursor-grow"
              title="Refresh"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--glass-violet)', border: '1px solid var(--border-violet)', color: 'var(--text-cyan)', borderRadius: 10, padding: '7px 12px', fontSize: 12.5, cursor: 'none' }}
            >
              <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
              {total != null ? `${total.toLocaleString()} signed` : '—'}
            </button>
          )}
        </div>

        {/* Chain selector */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '18px 0' }}>
          {CHAINS.map((id) => {
            const m = CHAIN_META[id]
            const on = selected === id
            const has = !!GUESTBOOK_ADDRESSES[id]
            return (
              <button
                key={id}
                onClick={() => setSelected(id)}
                className="cursor-grow"
                style={{
                  padding: '8px 15px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'none',
                  border: on ? '1px solid transparent' : '1px solid var(--border-violet)',
                  background: on ? 'var(--magenta-pop)' : 'var(--glass-violet)',
                  color: on ? '#fff' : 'var(--text-violet)',
                  opacity: has ? 1 : 0.55,
                  transition: 'all .2s',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: m?.color }} />
                {m?.label}
                {!has && <span style={{ fontSize: 10, opacity: 0.8 }}>· soon</span>}
              </button>
            )
          })}
        </div>

        {!deployed ? (
          <div style={{ padding: 18, borderRadius: 14, background: 'var(--glass-white)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.6 }}>
            The guestbook contract isn’t deployed on <strong style={{ color: meta?.color }}>{meta?.label}</strong> yet.
            Deploy <code style={{ color: 'var(--text-cyan)', fontFamily: 'JetBrains Mono' }}>contracts/Guestbook.sol</code> there and add its
            address in <code style={{ color: 'var(--text-cyan)', fontFamily: 'JetBrains Mono' }}>src/lib/guestbook.js</code>.
          </div>
        ) : (
          <>
            {/* Composer */}
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={3}
              maxLength={MAX_LEN + 40}
              placeholder={`Leave a message on ${meta?.label}…`}
              className="glass-input"
              style={{ width: '100%', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
              <span style={{ fontSize: 12, color: tooLong ? 'var(--magenta-soft)' : 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                {msg.length}/{MAX_LEN}
              </span>

              {!isConnected ? (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button onClick={openConnectModal} className="btn-magenta cursor-grow">
                      <WalletIcon size={16} /> Connect to sign
                    </button>
                  )}
                </ConnectButton.Custom>
              ) : !onRightChain ? (
                <button onClick={() => switchChain({ chainId: selected })} disabled={switching} className="btn-magenta cursor-grow">
                  <ArrowRightLeft size={16} /> {switching ? 'Switching…' : `Switch to ${meta?.label}`}
                </button>
              ) : (
                <button onClick={sign} disabled={busy || !msg.trim() || tooLong} className="btn-magenta cursor-grow" style={{ opacity: busy ? 0.7 : 1 }}>
                  {busy ? <><Loader2 size={16} className="animate-spin" /> {confirming ? 'Confirming…' : 'Sign…'}</> : <><PenLine size={16} /> Sign the guestbook</>}
                </button>
              )}
            </div>

            {/* Entries feed */}
            <div style={{ marginTop: 24 }}>
              <h4 style={{ fontSize: 12, letterSpacing: 2, color: 'var(--text-cyan)', marginBottom: 14 }}>RECENT SIGNATURES</h4>
              {isLoading ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'JetBrains Mono' }}>Reading the chain…</div>
              ) : entries && entries.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <AnimatePresence initial={false}>
                    {entries.map((e, i) => (
                      <motion.div
                        key={`${e.author}-${e.timestamp}-${i}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', gap: 12, padding: 14, borderRadius: 14, background: 'var(--glass-white)', border: '1px solid var(--border-subtle)' }}
                      >
                        <div style={{ flexShrink: 0, borderRadius: '50%', overflow: 'hidden', border: `1px solid ${meta?.color}55`, height: 'fit-content' }}>
                          <Blockies address={e.author} size={8} scale={4} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <a
                              href={`${EXPLORERS[selected]}${e.author}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontFamily: 'JetBrains Mono', fontSize: 12.5, color: 'var(--text-cyan)' }}
                            >
                              {e.author.slice(0, 6)}…{e.author.slice(-4)}
                            </a>
                            <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{timeAgo(e.timestamp)}</span>
                          </div>
                          <p style={{ color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.55, marginTop: 5, wordBreak: 'break-word' }}>
                            {e.message}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
                  No signatures yet on {meta?.label} — be the first to write to the chain. ✍️
                </div>
              )}
            </div>

            {/* Tx link */}
            {hash && (
              <a
                href={`${EXPLORERS[selected].replace('/address/', '/tx/')}${hash}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 12.5, color: 'var(--text-cyan)' }}
              >
                View transaction <ExternalLink size={13} />
              </a>
            )}
          </>
        )}
      </div>
    </div>
  )
}
