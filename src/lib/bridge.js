// Shared bridge config — used by the Buy-TAAQO bridge demo.
// These mirror the live, relayer-backed deployment.

export const BSC_CHAIN_ID_HEX = "0x38"; // 56

export const BSC_CHAIN_PARAMS = {
  chainId: BSC_CHAIN_ID_HEX,
  chainName: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-rpc.publicnode.com", "https://bsc-dataseed.binance.org"],
  blockExplorerUrls: ["https://bscscan.com"],
};

// BSC-Peg USDT (18 decimals)
export const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";

// Deployed BSC → TAAQO bridge
export const BRIDGE_ADDRESS = "0x395Bf18f4314c39a984496C270a39DF0D0E85731";

export const TAAQO_RPC = "https://rpc.taaqo.com";
export const TAAQO_EXPLORER = "https://taaqoscan.com";

export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
];

export const BRIDGE_ABI = [
  "function deposit(uint256 amount) external",
  "function depositTo(uint256 amount, address taaqoRecipient) external",
  // quote helper: returns net USDT after fee, the fee, and TAAQO out
  "function quoteTaaqoFor(uint256 amount) view returns (uint256 netUsdt, uint256 fee, uint256 taaqoOut)",
];
