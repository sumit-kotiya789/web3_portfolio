import { useEffect, useRef, useState } from 'react'

const lines = [
  { t: '$ ', cmd: 'cat StakeVault.sol', c: 'cyan' },
  { t: '', cmd: '// SPDX-License-Identifier: MIT', c: 'muted' },
  { t: '', cmd: 'pragma solidity ^0.8.24;', c: 'violet' },
  { t: '', cmd: 'import "@openzeppelin/contracts/access/Ownable.sol";', c: 'green' },
  { t: '', cmd: '', c: 'green' },
  { t: '', cmd: 'contract StakeVault is Ownable {', c: 'green' },
  { t: '', cmd: '    uint8  public constant TIERS = 6;', c: 'green' },
  { t: '', cmd: '    uint16 public constant CHAIN_ID = 5577;', c: 'green' },
  { t: '', cmd: '    mapping(address => uint256) public staked;', c: 'green' },
  { t: '', cmd: '    event Staked(address indexed user, uint256 amt);', c: 'green' },
  { t: '', cmd: '}', c: 'green' },
  { t: '$ ', cmd: 'hardhat deploy --network taaqo', c: 'cyan' },
  { t: '', cmd: '⠋ Compiling 14 Solidity files...', c: 'gold' },
  { t: '', cmd: '✔ Deployed StakeVault → 0x7a3F...9bE2', c: 'emerald' },
  { t: '', cmd: '✔ 3 validators in consensus · block #1284771', c: 'emerald' },
]

const colorMap = {
  cyan: '#2dd4bf',
  violet: '#99f6e4',
  green: '#2dd4bf',
  emerald: '#2dd4bf',
  gold: '#d6d9e3',
  muted: '#5c5d6a',
}

export default function Terminal() {
  const [rendered, setRendered] = useState([])
  const [typing, setTyping] = useState('')
  const idx = useRef(0)
  const char = useRef(0)
  const boxRef = useRef(null)

  useEffect(() => {
    let timeout
    const tick = () => {
      if (idx.current >= lines.length) {
        // restart loop after pause
        timeout = setTimeout(() => {
          setRendered([])
          setTyping('')
          idx.current = 0
          char.current = 0
          tick()
        }, 3500)
        return
      }
      const line = lines[idx.current]
      const full = line.t + line.cmd
      if (char.current <= full.length) {
        setTyping(full.substring(0, char.current))
        char.current++
        timeout = setTimeout(tick, line.cmd.length > 0 ? 16 : 200)
      } else {
        setRendered((r) => [...r, line])
        setTyping('')
        idx.current++
        char.current = 0
        timeout = setTimeout(tick, 120)
      }
    }
    tick()
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight
  }, [rendered, typing])

  const activeColor = idx.current < lines.length ? colorMap[lines[idx.current].c] : '#2dd4bf'

  return (
    <div
      style={{
        background: '#08080c',
        border: '1px solid var(--border-violet)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(45,212,191,0.25)',
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F56' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#27C93F' }} />
        <span style={{ marginLeft: 12, color: 'var(--text-secondary)', fontSize: 13 }}>sumit@taaqo:~$</span>
      </div>
      <div ref={boxRef} style={{ padding: 18, height: 360, overflowY: 'auto', fontSize: 13.5, lineHeight: 1.7 }}>
        {rendered.map((l, i) => (
          <div key={i} style={{ color: colorMap[l.c], whiteSpace: 'pre-wrap' }}>
            {l.t && <span style={{ color: '#2dd4bf' }}>{l.t}</span>}
            {l.cmd}
          </div>
        ))}
        {typing && (
          <div style={{ color: activeColor, whiteSpace: 'pre-wrap' }}>
            {typing}
            <span style={{ animation: 'blink 1s step-end infinite' }}>▋</span>
          </div>
        )}
      </div>
    </div>
  )
}
