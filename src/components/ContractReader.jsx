import { useState } from 'react'
import { usePublicClient } from 'wagmi'
import { isAddress, formatEther, formatUnits, erc20Abi } from 'viem'
import { mainnet, bsc, polygon } from 'wagmi/chains'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, FileCode2, Coins, Hash, Wallet, AlertTriangle } from 'lucide-react'
import { taaqo, CHAIN_META } from '../lib/wagmi'

const CHAINS = [taaqo.id, mainnet.id, bsc.id, polygon.id]

function Row({ icon: Icon, label, value, mono = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <Icon size={16} style={{ color: 'var(--cyan-core)', flexShrink: 0, marginTop: 2 }} />
      <span style={{ fontSize: 12, letterSpacing: 1, color: 'var(--text-muted)', textTransform: 'uppercase', minWidth: 110 }}>{label}</span>
      <span style={{ fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit', fontSize: 13.5, color: 'var(--text-primary)', wordBreak: 'break-all', flex: 1 }}>
        {value}
      </span>
    </div>
  )
}

export default function ContractReader() {
  const [chainId, setChainId] = useState(taaqo.id)
  const [addr, setAddr] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const client = usePublicClient({ chainId })

  const read = async (e) => {
    e?.preventDefault()
    const address = addr.trim()
    if (!isAddress(address)) {
      setError('That is not a valid EVM address.')
      setStatus('error')
      return
    }
    if (!client) {
      setError('No RPC client for this chain.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setError('')
    setResult(null)
    try {
      const [bytecode, balance, nonce] = await Promise.all([
        client.getBytecode({ address }).catch(() => undefined),
        client.getBalance({ address }).catch(() => 0n),
        client.getTransactionCount({ address }).catch(() => 0),
      ])
      const isContract = !!bytecode && bytecode !== '0x'

      let token = null
      if (isContract) {
        // Best-effort ERC-20 probe — most reads fail silently on non-tokens.
        const [name, symbol, decimals, totalSupply] = await Promise.all([
          client.readContract({ address, abi: erc20Abi, functionName: 'name' }).catch(() => null),
          client.readContract({ address, abi: erc20Abi, functionName: 'symbol' }).catch(() => null),
          client.readContract({ address, abi: erc20Abi, functionName: 'decimals' }).catch(() => null),
          client.readContract({ address, abi: erc20Abi, functionName: 'totalSupply' }).catch(() => null),
        ])
        if (symbol || name) {
          const dec = typeof decimals === 'number' ? decimals : 18
          token = {
            name,
            symbol,
            decimals: dec,
            totalSupply: totalSupply != null ? formatUnits(totalSupply, dec) : null,
          }
        }
      }

      const meta = CHAIN_META[chainId]
      setResult({
        address,
        isContract,
        bytecodeSize: isContract ? (bytecode.length - 2) / 2 : 0,
        balance: formatEther(balance),
        symbol: meta?.short || 'ETH',
        nonce,
        token,
      })
      setStatus('done')
    } catch (err) {
      setError(err?.shortMessage || err?.message || 'Read failed — the RPC may be unreachable.')
      setStatus('error')
    }
  }

  return (
    <div className="glass" style={{ padding: 26 }}>
      <h4 style={{ fontSize: 13, letterSpacing: 2, color: 'var(--text-cyan)', marginBottom: 6 }}>LIVE CONTRACT READER</h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 18 }}>
        Paste any address. I read its on-chain state directly via Viem — native balance, whether it's a contract,
        bytecode size, tx nonce, and (if it's an ERC-20) its token metadata.
      </p>

      {/* Chain selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {CHAINS.map((id) => {
          const meta = CHAIN_META[id]
          const on = chainId === id
          return (
            <button
              key={id}
              onClick={() => setChainId(id)}
              className="cursor-grow"
              style={{
                padding: '7px 14px',
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                border: on ? '1px solid transparent' : '1px solid var(--border-violet)',
                background: on ? 'var(--magenta-pop)' : 'var(--glass-violet)',
                color: on ? '#fff' : 'var(--text-violet)',
                cursor: 'none',
                transition: 'all .2s',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: meta?.color }} />
              {meta?.label}
            </button>
          )
        })}
      </div>

      {/* Address input */}
      <form onSubmit={read} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          placeholder="0x… contract or wallet address"
          className="glass-input"
          style={{ flex: '1 1 260px', minWidth: 0 }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-magenta cursor-grow"
          style={{ justifyContent: 'center', opacity: status === 'loading' ? 0.7 : 1 }}
        >
          {status === 'loading' ? <><Loader2 size={16} className="animate-spin" /> Reading…</> : <><Search size={16} /> Read</>}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {status === 'error' && (
          <motion.div
            key="err"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, color: 'var(--magenta-soft)', fontSize: 13 }}
          >
            <AlertTriangle size={15} /> {error}
          </motion.div>
        )}

        {status === 'done' && result && (
          <motion.div
            key="res"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginTop: 18 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 8,
                background: result.isContract ? 'rgba(45,212,191,0.14)' : 'var(--glass-white)',
                color: result.isContract ? 'var(--emerald-live)' : 'var(--text-secondary)',
                border: `1px solid ${result.isContract ? 'var(--border-cyan)' : 'var(--border-subtle)'}`,
              }}
            >
              {result.isContract ? '◆ Smart contract' : '○ Externally-owned account (wallet)'}
            </div>

            <Row icon={Wallet} label="Balance" value={`${Number(result.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${result.symbol}`} />
            <Row icon={Hash} label="Tx nonce" value={result.nonce.toString()} />
            {result.isContract && (
              <Row icon={FileCode2} label="Bytecode" value={`${result.bytecodeSize.toLocaleString()} bytes`} />
            )}
            {result.token && (
              <>
                <Row icon={Coins} label="Token" value={`${result.token.name || '—'} (${result.token.symbol || '—'})`} mono={false} />
                <Row icon={Coins} label="Decimals" value={result.token.decimals} />
                {result.token.totalSupply && (
                  <Row icon={Coins} label="Total supply" value={Number(result.token.totalSupply).toLocaleString()} />
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
