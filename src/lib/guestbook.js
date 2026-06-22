import { mainnet, bsc, polygon } from 'wagmi/chains'
import { taaqo } from './wagmi'

/* Deploy contracts/Guestbook.sol to each chain, then paste the addresses here
   (or set the VITE_GUESTBOOK_* env vars). Empty = "not deployed on this chain
   yet" — the UI handles that gracefully. */
export const GUESTBOOK_ADDRESSES = {
  [taaqo.id]:   import.meta.env.VITE_GUESTBOOK_TAAQO   || '0xa58992f65C5F5a7C48169F13b5643CCf2577D3c0',
  [mainnet.id]: import.meta.env.VITE_GUESTBOOK_MAINNET || '',
  [bsc.id]:     import.meta.env.VITE_GUESTBOOK_BSC     || '',
  [polygon.id]: import.meta.env.VITE_GUESTBOOK_POLYGON || '',
}

export const GUESTBOOK_ABI = [
  {
    type: 'function', name: 'sign', stateMutability: 'nonpayable',
    inputs: [{ name: 'message', type: 'string' }], outputs: [],
  },
  {
    type: 'function', name: 'total', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function', name: 'lastSignedAt', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }], outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function', name: 'getEntries', stateMutability: 'view',
    inputs: [{ name: 'offset', type: 'uint256' }, { name: 'limit', type: 'uint256' }],
    outputs: [{
      type: 'tuple[]',
      components: [
        { name: 'author', type: 'address' },
        { name: 'message', type: 'string' },
        { name: 'timestamp', type: 'uint256' },
      ],
    }],
  },
  {
    type: 'event', name: 'Signed',
    inputs: [
      { name: 'author', type: 'address', indexed: true },
      { name: 'message', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
]
