/* ============================================================
   Central project registry.
   Drives the /projects grid, the /projects/:id detail pages,
   and the broadened multi-domain portfolio (web3 + mobile +
   payments + web apps). Bridges link out to the dedicated
   /bridges console.

   When adding a new project: drop an entry here. `status`:
   'live' = shipped & linkable, 'wip' = in progress,
   'soon' = case study not written yet (shown tastefully).
   Icons are referenced by name and mapped in the components.
   ============================================================ */

export const PROJECTS = [
  /* ---------------- WEB3 — real, shipped ---------------- */
  {
    id: 'taaqo',
    title: 'TAAQO L2 Blockchain',
    cat: 'Infrastructure',
    icon: 'Layers',
    accent: 'var(--blue)',
    size: 'large',
    badge: { text: 'FLAGSHIP', color: 'var(--gold-premium)' },
    chainId: '5566',
    graph: true,
    status: 'live',
    variant3d: 'crystal',
    tagline: 'A custom EVM Layer-2, architected and operated end to end.',
    desc: 'A fully custom EVM-compatible Layer-2 built on Go-Ethereum, running three independent validator nodes with its own RPC layer and block explorer.',
    stats: ['3 RPCs', '3 Nodes', 'Go-Ethereum', 'EVM Compatible'],
    links: [
      { label: 'taaqo.com', url: 'https://taaqo.com' },
      { label: 'taaqoscan.com', url: 'https://taaqoscan.com' },
    ],
    overview: [
      'TAAQO is a production Layer-2 blockchain I architected, deployed and operate. It is a fully EVM-compatible chain (chain ID 5566) built on a customized Go-Ethereum core.',
      'The network runs three independent validator nodes, a bespoke RPC layer and a full block explorer — every layer, from consensus configuration and genesis through to the public JSON-RPC endpoints, was set up and is maintained by me.',
    ],
    highlights: [
      'Custom go-ethereum fork, genesis & consensus config',
      'Three independent validator nodes',
      'Public RPC layer built for real traffic',
      'Full block explorer — TAAQOScan',
      'Native gas token & faucet',
      'Cross-chain bridges connecting BNB Chain ↔ TAAQO',
    ],
  },
  {
    id: 'globalstaken',
    title: 'GlobalStaken Protocol',
    cat: 'DeFi',
    icon: 'Boxes',
    accent: 'var(--emerald-live)',
    size: 'large',
    badge: { text: 'LIVE', color: 'var(--emerald-live)', pulse: true },
    tvl: 2.4,
    status: 'live',
    variant3d: 'network',
    tagline: 'A six-tier DeFi staking protocol with real on-chain liquidity.',
    desc: 'A six-tier DeFi staking protocol with Uniswap v3 concentrated liquidity, a ten-level referral engine and eight achievement ranks.',
    stats: ['6 Tiers', 'Uniswap v3 LP', '10-Level Referral', '8 Ranks'],
    links: [{ label: 'globalstaken.io', url: 'https://globalstaken.io' }],
    overview: [
      'GlobalStaken is a production DeFi staking protocol. I designed the economic model and shipped the contracts end to end.',
      'It features six staking tiers, Uniswap v3 concentrated liquidity, a ten-level referral engine and eight achievement ranks — all enforced on-chain.',
    ],
    highlights: [
      'Six-tier staking economics',
      'Uniswap v3 concentrated liquidity',
      'Ten-level referral engine',
      'Eight on-chain achievement ranks',
      'Verified contracts',
    ],
  },
  {
    id: 'taaqoscan',
    title: 'TAAQOScan Explorer',
    cat: 'Infrastructure',
    icon: 'Search',
    accent: 'var(--blue-soft)',
    size: 'medium',
    status: 'live',
    variant3d: 'network',
    tagline: 'A full block explorer for the TAAQO chain.',
    desc: 'Full block explorer for TAAQO L2 — transactions, blocks, validators & contract verification.',
    stats: ['Block Indexer', 'Tx Tracer', 'Contract Verify'],
    links: [{ label: 'taaqoscan.com', url: 'https://taaqoscan.com' }],
    overview: [
      'TAAQOScan is the block explorer for the TAAQO Layer-2 — indexing blocks and transactions, tracing activity, surfacing validators and verifying contracts.',
    ],
    highlights: ['Block & transaction indexer', 'Transaction tracer', 'Validator view', 'Contract verification'],
  },
  {
    id: 'bridges',
    title: 'Cross-Chain Bridges',
    cat: 'Bridges',
    icon: 'GitBranch',
    accent: 'var(--blue)',
    size: 'medium',
    badge: { text: 'LIVE', color: 'var(--emerald-live)', pulse: true },
    to: '/bridges',
    cta: 'Open live bridges',
    status: 'live',
    tagline: 'Three live, relayer-backed bridges. Try all three.',
    desc: 'Three live bridges moving value between BNB Chain and TAAQO — a lock-and-mint bridge, an on-ramp, and a liquidity vault. Open the console to run any of them live.',
    stats: ['BSC ↔ TAAQO', 'Lock & Mint', 'On-ramp', 'Vault Liquidity'],
  },
  {
    id: 'arc',
    title: 'ARC Token',
    cat: 'Tokens',
    icon: 'Coins',
    accent: 'var(--gold-premium)',
    size: 'small',
    status: 'live',
    variant3d: 'crystal',
    tagline: 'A BEP-20 token with on-chain tokenomics.',
    desc: 'BSC BEP-20 token with on-chain tokenomics & vesting.',
    stats: ['BSC', 'BEP-20'],
    overview: ['ARC is a BEP-20 token on BNB Smart Chain with on-chain tokenomics and vesting logic.'],
    highlights: ['BEP-20 standard', 'On-chain tokenomics', 'Vesting schedule'],
  },
  {
    id: 'evm',
    title: 'EVM Contracts',
    cat: 'DeFi',
    icon: 'Code2',
    accent: 'var(--blue-soft)',
    size: 'small',
    counter: 10,
    status: 'live',
    variant3d: 'crystal',
    tagline: 'A growing suite of Solidity contracts.',
    desc: 'A growing suite of audited-in-spirit Solidity contracts.',
    stats: ['Solidity', 'OpenZeppelin'],
    overview: ['A growing suite of Solidity smart contracts — written defensively, tested, and deployed across EVM chains.'],
    highlights: ['Defensive Solidity', 'OpenZeppelin foundations', 'Deployed across EVM chains'],
  },

  /* ---------------- BEYOND WEB3 — broader work ---------------- */
  {
    id: 'fantasy',
    title: 'Fantasy Sports App',
    cat: 'Mobile',
    icon: 'Trophy',
    accent: 'var(--blue)',
    size: 'medium',
    badge: { text: 'IN PROGRESS', color: 'var(--blue-soft)' },
    status: 'wip',
    variant3d: 'network',
    tagline: 'A Dream11-style fantasy sports platform.',
    desc: 'A Dream11-style fantasy sports platform — build teams within a budget, join contests, follow live scoring and manage an in-app wallet.',
    stats: ['Team Builder', 'Live Scoring', 'Contests', 'Wallet'],
    overview: [
      'A fantasy sports application in the spirit of Dream11 — users assemble teams within a budget, join public and private contests, and follow live match scoring that updates standings in real time.',
      'The full write-up, screenshots and tech breakdown are on the way.',
    ],
    highlights: ['Budget-based team builder', 'Public & private contests', 'Real-time live scoring', 'In-app wallet & payouts'],
  },
  {
    id: 'paygateway',
    title: 'Crypto Payment Gateway',
    cat: 'Payments',
    icon: 'CreditCard',
    accent: 'var(--emerald-live)',
    size: 'medium',
    badge: { text: 'IN PROGRESS', color: 'var(--blue-soft)' },
    status: 'wip',
    variant3d: 'knot',
    tagline: 'Accept crypto payments — checkout, invoicing, settlement.',
    desc: 'A crypto payment gateway for accepting on-chain payments — a hosted checkout, invoice generation and on-chain settlement tracking.',
    stats: ['Checkout', 'Invoicing', 'On-chain Settlement', 'Webhooks'],
    overview: [
      'A payment gateway for accepting cryptocurrency payments, with a hosted checkout, invoice generation and on-chain settlement tracking for merchants.',
      'Detailed case study coming soon.',
    ],
    highlights: ['Hosted crypto checkout', 'Invoice generation', 'On-chain settlement tracking', 'Merchant webhooks'],
  },
  {
    id: 'ecommerce',
    title: 'Android E-Commerce App',
    cat: 'Mobile',
    icon: 'ShoppingCart',
    accent: 'var(--blue-soft)',
    size: 'small',
    status: 'soon',
    variant3d: 'crystal',
    tagline: 'A native Android shopping experience.',
    desc: 'A native Android e-commerce app — product catalog, cart, checkout and order tracking.',
    stats: ['Android', 'Catalog', 'Checkout', 'Orders'],
    overview: [
      'A native Android e-commerce application covering the full shopping flow — browsing a product catalog, cart management, checkout and order tracking.',
      'Screens and implementation notes coming soon.',
    ],
    highlights: ['Product catalog & search', 'Cart & checkout', 'Order tracking', 'User accounts'],
  },
  {
    id: 'bankmgmt',
    title: 'Bank Management System',
    cat: 'Web Apps',
    icon: 'Landmark',
    accent: 'var(--gold-premium)',
    size: 'small',
    status: 'soon',
    variant3d: 'network',
    tagline: 'Accounts, transactions and admin oversight.',
    desc: 'A bank management system — accounts, transactions, fund transfers and admin dashboards.',
    stats: ['Accounts', 'Transactions', 'Transfers', 'Admin'],
    overview: [
      'A bank management system handling customer accounts, deposits and withdrawals, fund transfers, and administrative dashboards for oversight.',
      'Full details coming soon.',
    ],
    highlights: ['Account management', 'Deposits / withdrawals', 'Fund transfers', 'Admin dashboard'],
  },
]

/* Unique category list for the filter bar, in a sensible order. */
const CAT_ORDER = ['Infrastructure', 'DeFi', 'Bridges', 'Tokens', 'Mobile', 'Payments', 'Web Apps']
export const PROJECT_FILTERS = [
  'All',
  ...CAT_ORDER.filter((c) => PROJECTS.some((p) => p.cat === c)),
]

export const getProject = (id) => PROJECTS.find((p) => p.id === id)

/* A project's destination: bridges → console, everything else → detail page. */
export const projectHref = (p) => p.to || `/projects/${p.id}`

export const STATUS_LABEL = {
  live: { text: 'Live', color: 'var(--emerald-live)' },
  wip: { text: 'In progress', color: 'var(--blue-soft)' },
  soon: { text: 'Case study coming soon', color: 'var(--text-muted)' },
}
