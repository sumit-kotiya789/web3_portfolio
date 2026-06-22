import { useMemo, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

/* Code stays dark in both themes by design (like a real editor). */
const PALETTE = {
  comment: '#6b7280',
  keyword: '#2dd4bf',
  type: '#7dd3fc',
  string: '#fcd34d',
  number: '#f59e0b',
  text: '#cbd5e1',
}

// Order matters: comment | string | keyword | type | number.
const RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b(?:pragma|solidity|contract|interface|library|function|constructor|modifier|event|struct|enum|mapping|returns|return|public|private|internal|external|view|pure|payable|memory|storage|calldata|require|assert|revert|emit|using|import|is|if|else|for|while|do|break|continue|unchecked|indexed|virtual|override|constant|immutable|new|delete|this)\b)|(\b(?:address|bool|string|byte|bytes\d*|uint\d*|int\d*)\b)|(\b\d[\d_]*\b)/g

function tokenize(src) {
  const out = []
  let last = 0
  let m
  RE.lastIndex = 0
  while ((m = RE.exec(src))) {
    if (m.index > last) out.push({ t: src.slice(last, m.index), c: 'text' })
    const c = m[1] ? 'comment' : m[2] ? 'string' : m[3] ? 'keyword' : m[4] ? 'type' : 'number'
    out.push({ t: m[0], c })
    last = RE.lastIndex
  }
  if (last < src.length) out.push({ t: src.slice(last), c: 'text' })
  return out
}

export default function SolidityCode({ source, file = 'Contract.sol', compiler, accent = '#2dd4bf' }) {
  const [copied, setCopied] = useState(false)
  const tokens = useMemo(() => tokenize(source), [source])
  const lineCount = useMemo(() => source.split('\n').length, [source])

  const copy = () => {
    navigator.clipboard.writeText(source)
    setCopied(true)
    toast.success('Source copied')
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="sol-laminate" style={{ '--accent': accent }}>
      <span className="sol-sheen" />
      {/* Title bar */}
      <div className="sol-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="sol-dot" style={{ background: '#FF5F56' }} />
          <span className="sol-dot" style={{ background: '#FFBD2E' }} />
          <span className="sol-dot" style={{ background: '#27C93F' }} />
          <span style={{ marginLeft: 10, color: '#9b9ca8', fontSize: 12.5, fontFamily: 'JetBrains Mono' }}>{file}</span>
          {compiler && (
            <span style={{ color: accent, fontSize: 11, fontFamily: 'JetBrains Mono', marginLeft: 4 }}>· {compiler}</span>
          )}
        </div>
        <button onClick={copy} className="sol-copy cursor-grow">
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code body: gutter + highlighted source */}
      <div className="sol-body">
        <div className="sol-gutter" aria-hidden="true">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <pre className="sol-pre">
          <code>
            {tokens.map((tk, i) => (
              <span key={i} style={{ color: PALETTE[tk.c] }}>{tk.t}</span>
            ))}
          </code>
        </pre>
      </div>

      <style>{`
        .sol-laminate {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          border: 1.5px solid var(--accent);
          background: #08080c;
          box-shadow: 0 14px 50px -18px var(--accent), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .sol-sheen {
          position: absolute; top: 0; left: 0; right: 0; height: 60%;
          background: linear-gradient(180deg, rgba(255,255,255,0.06), transparent);
          pointer-events: none;
        }
        .sol-bar {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 11px 16px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .sol-dot { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
        .sol-copy {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--glass-cyan); border: 1px solid var(--border-cyan);
          color: #5eead4; border-radius: 9px; padding: 5px 11px;
          font-size: 12px; font-weight: 600; font-family: 'JetBrains Mono'; cursor: none;
        }
        .sol-body {
          position: relative; z-index: 1;
          display: flex; max-height: 460px; overflow: auto;
        }
        .sol-gutter {
          display: flex; flex-direction: column;
          padding: 16px 0; flex-shrink: 0;
          text-align: right; user-select: none;
          color: #3a3b46; background: rgba(255,255,255,0.015);
          font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.65;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .sol-gutter span { padding: 0 14px; }
        .sol-pre {
          margin: 0; padding: 16px 18px;
          font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.65;
          white-space: pre; tab-size: 4;
        }
        .sol-body::-webkit-scrollbar { height: 9px; width: 9px; }
        .sol-body::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 8px; opacity: .6; }
      `}</style>
    </div>
  )
}
