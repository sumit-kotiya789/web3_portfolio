import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Home, User, FolderGit2, Cpu, Wallet, Mail, Github, Linkedin,
  Copy, Search, CornerDownLeft, ArrowUp, ArrowDown, Command, FileDown, FlaskConical,
} from 'lucide-react'
import { PROFILE } from '../lib/profile'

const EMAIL = PROFILE.email

/* Build the action list. `nav` and `close` are injected so actions can run. */
function buildCommands(nav, close) {
  const go = (path) => () => { nav(path); close() }

  return [
    // ---- Navigation ----
    { id: 'home', group: 'Navigate', label: 'Home', hint: 'Landing page', icon: Home, keywords: 'start landing intro', run: go('/') },
    { id: 'about', group: 'Navigate', label: 'About', hint: 'Who I am', icon: User, keywords: 'bio story me', run: go('/about') },
    { id: 'projects', group: 'Navigate', label: 'Projects', hint: 'Things I built', icon: FolderGit2, keywords: 'work portfolio builds', run: go('/projects') },
    { id: 'skills', group: 'Navigate', label: 'Skills', hint: 'Stack & tooling', icon: Cpu, keywords: 'tech stack tools', run: go('/skills') },
    { id: 'wallet', group: 'Navigate', label: 'Wallet', hint: 'Web3 gateway', icon: Wallet, keywords: 'web3 chain connect', run: go('/wallet') },
    { id: 'lab', group: 'Navigate', label: 'Lab', hint: 'On-chain playground', icon: FlaskConical, keywords: 'contract reader token gate tools playground', run: go('/lab') },
    { id: 'contact', group: 'Navigate', label: 'Contact', hint: "Let's talk", icon: Mail, keywords: 'hire email reach', run: go('/contact') },

    // ---- Actions ----
    {
      id: 'copy-email', group: 'Actions', label: 'Copy email address', hint: EMAIL, icon: Copy, keywords: 'mail clipboard',
      run: async () => {
        try { await navigator.clipboard.writeText(EMAIL); toast.success('Email copied to clipboard') }
        catch { toast.error('Could not copy') }
        close()
      },
    },
    { id: 'email', group: 'Actions', label: 'Send an email', hint: EMAIL, icon: Mail, keywords: 'mailto contact write', run: () => { window.location.href = `mailto:${EMAIL}`; close() } },
    { id: 'resume', group: 'Actions', label: 'Download résumé', hint: 'PDF', icon: FileDown, keywords: 'cv resume pdf hire download', run: () => { window.open(PROFILE.resumeUrl, '_blank', 'noreferrer'); close() } },

    // ---- Links ----
    { id: 'github', group: 'Links', label: 'GitHub', hint: 'github.com/sumit-kotiya789', icon: Github, keywords: 'code repo source', run: () => { window.open(PROFILE.socials.github, '_blank', 'noreferrer'); close() } },
    { id: 'linkedin', group: 'Links', label: 'LinkedIn', hint: 'linkedin.com/in/sumitkotiya', icon: Linkedin, keywords: 'network professional', run: () => { window.open(PROFILE.socials.linkedin, '_blank', 'noreferrer'); close() } },
  ]
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const close = useCallback(() => setOpen(false), [])

  const commands = useMemo(() => buildCommands(navigate, close), [navigate, close])

  // Filtered + grouped results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      (c.label + ' ' + (c.hint || '') + ' ' + (c.keywords || '') + ' ' + c.group)
        .toLowerCase()
        .includes(q),
    )
  }, [query, commands])

  // Global hotkey: Cmd/Ctrl+K toggles
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Reset state each time it opens, focus input
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      const t = setTimeout(() => inputRef.current?.focus(), 40)
      return () => clearTimeout(t)
    }
  }, [open])

  // Clamp active index when the result set shrinks
  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, results.length - 1)))
  }, [results.length])

  // Keep the active row scrolled into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % Math.max(results.length, 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + results.length) % Math.max(results.length, 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); results[active]?.run() }
    else if (e.key === 'Escape') { e.preventDefault(); close() }
  }

  // Render grouped while preserving the flat index for keyboard nav
  let flatIdx = -1
  const groups = ['Navigate', 'Actions', 'Links']

  return (
    <>
      {/* Floating hint button (also opens the palette by click) */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="cmdk-fab"
      >
        <Command size={15} />
        <span className="cmdk-fab-text">
          <kbd>⌘</kbd><kbd>K</kbd>
        </span>
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="cmdk-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onMouseDown={(e) => { if (e.target === e.currentTarget) close() }}
            >
              <motion.div
                className="cmdk-panel"
                initial={{ opacity: 0, y: -16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                role="dialog"
                aria-modal="true"
              >
                <div className="cmdk-search">
                  <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onInputKey}
                    placeholder="Search pages, actions, links…"
                    className="cmdk-input"
                  />
                  <span className="cmdk-esc">esc</span>
                </div>

                <div ref={listRef} className="cmdk-list">
                  {results.length === 0 && (
                    <div className="cmdk-empty">No results for "{query}"</div>
                  )}
                  {groups.map((g) => {
                    const items = results.filter((r) => r.group === g)
                    if (!items.length) return null
                    return (
                      <div key={g}>
                        <div className="cmdk-group">{g}</div>
                        {items.map((item) => {
                          flatIdx++
                          const idx = flatIdx
                          const Icon = item.icon
                          const isActive = idx === active
                          return (
                            <button
                              key={item.id}
                              data-idx={idx}
                              className={`cmdk-row${isActive ? ' active' : ''}`}
                              onMouseEnter={() => setActive(idx)}
                              onClick={() => item.run()}
                            >
                              <span className="cmdk-row-ico"><Icon size={17} /></span>
                              <span className="cmdk-row-label">{item.label}</span>
                              {item.hint && <span className="cmdk-row-hint">{item.hint}</span>}
                              {isActive && <CornerDownLeft size={15} className="cmdk-row-enter" />}
                            </button>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>

                <div className="cmdk-foot">
                  <span><ArrowUp size={12} /><ArrowDown size={12} /> navigate</span>
                  <span><CornerDownLeft size={12} /> select</span>
                  <span><kbd>esc</kbd> close</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <style>{`
        /* Floating launcher */
        .cmdk-fab {
          position: fixed;
          bottom: 24px; right: 24px;
          z-index: 8500;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 14px;
          background: rgba(8,8,12,0.7);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-cyan);
          border-radius: 999px;
          color: var(--text-cyan);
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.4), 0 0 0 rgba(45,212,191,0);
          transition: box-shadow .3s, transform .25s, border-color .3s;
        }
        .cmdk-fab:hover {
          transform: translateY(-2px);
          border-color: var(--cyan-core);
          box-shadow: 0 10px 34px rgba(0,0,0,0.5), 0 0 24px var(--cyan-glow);
        }
        .cmdk-fab-text { display: inline-flex; gap: 3px; }
        .cmdk-fab kbd {
          font-family: inherit; font-size: 11px;
          background: var(--glass-cyan);
          border: 1px solid var(--border-cyan);
          border-radius: 5px; padding: 1px 5px; color: var(--cyan-soft);
        }

        /* Overlay + panel */
        .cmdk-overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(3,1,10,0.6);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 14vh;
        }
        .cmdk-panel {
          width: min(620px, 92vw);
          background: linear-gradient(180deg, #121219 0%, #0b0b11 100%);
          border: 1px solid var(--border-cyan);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 50px rgba(45,212,191,0.10);
        }

        .cmdk-search {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .cmdk-input {
          flex: 1; background: transparent; border: none; outline: none;
          color: var(--text-primary);
          font-family: 'Space Grotesk', sans-serif; font-size: 16px;
        }
        .cmdk-input::placeholder { color: var(--text-muted); }
        .cmdk-esc {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: var(--text-muted);
          border: 1px solid var(--border-violet); border-radius: 6px;
          padding: 2px 7px;
        }

        .cmdk-list { max-height: 52vh; overflow-y: auto; padding: 8px; }
        .cmdk-group {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
          color: var(--text-muted);
          padding: 12px 12px 6px;
        }
        .cmdk-row {
          width: 100%;
          display: flex; align-items: center; gap: 13px;
          padding: 11px 12px;
          background: transparent; border: none; border-radius: 11px;
          color: var(--text-secondary);
          text-align: left; cursor: none;
          transition: background .12s, color .12s;
        }
        .cmdk-row.active {
          background: var(--glass-cyan);
          color: var(--text-primary);
        }
        .cmdk-row-ico {
          display: inline-flex; flex-shrink: 0;
          color: var(--text-muted);
          transition: color .12s;
        }
        .cmdk-row.active .cmdk-row-ico { color: var(--cyan-core); }
        .cmdk-row-label { font-size: 15px; font-weight: 500; }
        .cmdk-row-hint {
          margin-left: auto;
          font-size: 12.5px; color: var(--text-muted);
          font-family: 'JetBrains Mono', monospace;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 45%;
        }
        .cmdk-row.active .cmdk-row-hint { margin-right: 6px; }
        .cmdk-row-enter { color: var(--cyan-core); flex-shrink: 0; }
        .cmdk-empty {
          padding: 36px 16px; text-align: center;
          color: var(--text-muted); font-size: 14px;
        }

        .cmdk-foot {
          display: flex; gap: 18px;
          padding: 11px 18px;
          border-top: 1px solid var(--border-subtle);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: var(--text-muted);
        }
        .cmdk-foot span { display: inline-flex; align-items: center; gap: 5px; }
        .cmdk-foot kbd {
          font-family: inherit;
          border: 1px solid var(--border-violet); border-radius: 5px;
          padding: 1px 5px;
        }

        @media (max-width: 600px) {
          .cmdk-fab-text { display: none; }
          .cmdk-fab { padding: 12px; bottom: 18px; right: 18px; }
          .cmdk-row-hint { display: none; }
        }
      `}</style>
    </>
  )
}
