import { useEffect, useRef } from 'react'

/* Lightweight deterministic blockies (Ethereum-style identicon) */
function makeRandom(seed) {
  const randseed = new Int32Array(4)
  for (let i = 0; i < seed.length; i++) {
    randseed[i % 4] = (randseed[i % 4] << 5) - randseed[i % 4] + seed.charCodeAt(i)
  }
  return function () {
    const t = randseed[0] ^ (randseed[0] << 11)
    randseed[0] = randseed[1]
    randseed[1] = randseed[2]
    randseed[2] = randseed[3]
    randseed[3] = randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8)
    return (randseed[3] >>> 0) / ((1 << 31) >>> 0)
  }
}

function hsl(rand) {
  const h = Math.floor(rand() * 360)
  const s = rand() * 60 + 40
  const l = rand() * 25 + 45
  return `hsl(${h},${s}%,${l}%)`
}

export default function Blockies({ address = '', size = 8, scale = 8 }) {
  const ref = useRef(null)

  useEffect(() => {
    const rand = makeRandom(address.toLowerCase())
    const color = hsl(rand)
    const bg = hsl(rand)
    const spot = hsl(rand)

    const data = []
    const mirror = Math.ceil(size / 2)
    for (let y = 0; y < size; y++) {
      const row = []
      for (let x = 0; x < mirror; x++) {
        row[x] = Math.floor(rand() * 2.3)
      }
      const r = row.slice(0, size - mirror).reverse()
      data.push(row.concat(r))
    }

    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    canvas.width = size * scale
    canvas.height = size * scale
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < data[y].length; x++) {
        const v = data[y][x]
        if (v) {
          ctx.fillStyle = v === 1 ? color : spot
          ctx.fillRect(x * scale, y * scale, scale, scale)
        }
      }
    }
  }, [address, size, scale])

  return <canvas ref={ref} style={{ display: 'block', borderRadius: '50%' }} />
}
