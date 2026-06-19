import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet } from 'lucide-react'
import { CHAIN_META } from '../lib/wagmi'

export default function WalletPill() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openAccountModal, openChainModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain
        const meta = chain ? CHAIN_META[chain.id] : null

        return (
          <div
            style={{ display: 'flex', gap: 8 }}
            {...(!ready && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none' } })}
          >
            {!connected && (
              <button className="btn-magenta" onClick={openConnectModal} style={{ padding: '0.6rem 1.3rem', fontSize: 14 }}>
                <Wallet size={16} />
                Connect Wallet
              </button>
            )}

            {connected && (
              <>
                <button
                  onClick={openChainModal}
                  className="btn-ghost"
                  style={{ padding: '0.5rem 0.9rem', fontSize: 13 }}
                >
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: meta?.color || 'var(--cyan-core)',
                      boxShadow: `0 0 8px ${meta?.color || 'var(--cyan-core)'}`,
                      display: 'inline-block',
                    }}
                  />
                  {meta?.label || chain.name}
                </button>
                <button
                  onClick={openAccountModal}
                  className="btn-magenta"
                  style={{ padding: '0.5rem 1rem', fontSize: 13 }}
                >
                  {account.displayName}
                  {account.displayBalance ? ` · ${account.displayBalance}` : ''}
                </button>
              </>
            )}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
