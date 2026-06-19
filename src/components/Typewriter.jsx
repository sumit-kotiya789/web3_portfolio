import { useEffect, useState } from 'react'

export default function Typewriter({ words, className }) {
  const [index, setIndex] = useState(0)
  const [sub, setSub] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[index % words.length]
    let timeout

    if (!deleting && sub === current) {
      timeout = setTimeout(() => setDeleting(true), 1600)
    } else if (deleting && sub === '') {
      setDeleting(false)
      setIndex((i) => i + 1)
    } else {
      timeout = setTimeout(() => {
        setSub((s) =>
          deleting ? current.substring(0, s.length - 1) : current.substring(0, s.length + 1)
        )
      }, deleting ? 45 : 85)
    }
    return () => clearTimeout(timeout)
  }, [sub, deleting, index, words])

  return (
    <span className={className}>
      {sub}
      <span style={{ animation: 'blink 1s step-end infinite', color: 'var(--cyan-core)', fontWeight: 300 }}>|</span>
    </span>
  )
}
