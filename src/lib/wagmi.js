import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, bsc, polygon } from 'wagmi/chains'
import { defineChain, http } from 'viem'

// Custom Taaqo L2 chain definition
export const taaqo = defineChain({
  id: 5566,
  name: 'Taaqo L2',
  nativeCurrency: { name: 'Taaqo', symbol: 'TAAQO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.taaqo.com', 'https://rpc2.taaqo.com', 'https://rpc3.taaqo.com'] },
  },
  blockExplorers: {
    default: { name: 'TaaqoScan', url: 'https://taaqoscan.com' },
  },
  testnet: false,
})

// NOTE: replace with your own WalletConnect projectId from https://cloud.walletconnect.com
export const WALLETCONNECT_PROJECT_ID =
  import.meta.env.VITE_WC_PROJECT_ID || '3a8170812b534d0ff9d794f19a901d64'

export const wagmiConfig = getDefaultConfig({
  appName: 'Sumit Kotiya — Web3 Portfolio',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, bsc, polygon, taaqo],
  // Explicit, CORS-friendly public RPCs — the default mainnet endpoint is
  // rate-limited/flaky, so pin reliable ones (publicnode).
  transports: {
    [mainnet.id]: http('https://ethereum-rpc.publicnode.com'),
    [bsc.id]: http('https://bsc-rpc.publicnode.com'),
    [polygon.id]: http('https://polygon-bor-rpc.publicnode.com'),
    [taaqo.id]: http('https://rpc.taaqo.com'),
  },
  ssr: false,
})

export const CHAIN_META = {
  [mainnet.id]: { label: 'Ethereum', color: '#627EEA', short: 'ETH' },
  [bsc.id]: { label: 'BSC', color: '#F3BA2F', short: 'BNB' },
  [polygon.id]: { label: 'Polygon', color: '#8247E5', short: 'MATIC' },
  [taaqo.id]: { label: 'Taaqo', color: '#00FF87', short: 'TAAQO' },
}
