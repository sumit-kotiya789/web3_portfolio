import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  BrowserProvider,
  JsonRpcProvider,
  Contract,
  MaxUint256,
  parseUnits,
  formatUnits,
} from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownUp,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  X,
  Copy,
  Check,
  Plus,
  Network,
  Info,
} from "lucide-react";

/* ----------------------------------------------------
   CONFIG
---------------------------------------------------- */
const CONFIG = {
  // -- Chain IDs (hex) --
  BSC_CHAIN_ID:   "0x38",    // BSC Mainnet  = 56
  TAAQO_CHAIN_ID: "0x15be",  // TAAQO        = 5566

  // -- RPC endpoints --
  BSC_RPC:   "https://bsc-dataseed.binance.org",
  TAAQO_RPC: "https://rpc.taaqo.com",

  // -- Token & contract addresses --
  BSC_USDT:   "0x55d398326f99059fF775485246999027B3197955", // BSC-Peg USDT (18 dec)
  BSC_BRIDGE: "0x395Bf18f4314c39a984496C270a39DF0D0E85731", // deployed BSC bridge
  TAAQO_WUSDT:"0xf670A1479c3F028a30aa0383BE2Ee52956767DBC", // deployed TAAQO wUSDT

  // -- Explorers --
  BSC_EXPLORER:   "https://bscscan.com",
  TAAQO_EXPLORER: "https://taaqoscan.com",

  // -- Bridge params (mirror contract defaults) --
  MIN_DEPOSIT: 1,
  MAX_DEPOSIT: 100_000,
  FEE_BPS:     10,           // 0.10 %

  // -- Decimals --
  BSC_USDT_DECIMALS: 18,
  WUSDT_DECIMALS:     6,
};

const CHAIN_META = {
  bsc: {
    chainId:     "0x38",
    chainName:   "BNB Smart Chain",
    shortName:   "BSC",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls:            ["https://bsc-dataseed1.binance.org", "https://rpc.ankr.com/bsc"],
    blockExplorerUrls:  ["https://bscscan.com"],
    color: "#F0B90B",
    icon:  "BSC",
  },
  taaqo: {
    chainId:     "0x15be",   // 5566
    chainName:   "TAAQO Network",
    shortName:   "TAAQO",
    nativeCurrency: { name: "TAAQO", symbol: "TAAQO", decimals: 18 },
    rpcUrls:           ["https://rpc.taaqo.com"],
    blockExplorerUrls: ["https://taaqoscan.com"],
    color: "#2dd4bf",
    icon:  "TQO",
  },
};

/* -- ABIs (minimal) -- */
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];
const BRIDGE_ABI = [
  "function deposit(uint256 amount) external",
  "function depositTo(uint256 amount, address taaqoRecipient) external",
];
const WUSDT_ABI = [
  "function burn(uint256 amount) external",
  "function burnTo(uint256 amount, address bscRecipient) external",
  "function balanceOf(address) view returns (uint256)",
];

/* -- Tiny helpers -- */
const shortAddr = (a) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const fmt = (n, dec = 4) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: dec });
const calcFee = (amt) => {
  const n = parseFloat(amt);
  return !n || isNaN(n) ? "0.00" : ((n * CONFIG.FEE_BPS) / 10_000).toFixed(6);
};
const calcReceive = (amt) => {
  const n = parseFloat(amt);
  return !n || isNaN(n) ? "—" : fmt(n - (n * CONFIG.FEE_BPS) / 10_000);
};

/* ----------------------------------------------------
   SUB-COMPONENTS
---------------------------------------------------- */
// Sparks generated once so they don't reset on re-renders
const INITIAL_SPARKS = Array.from({ length: 60 }).map((_, i) => ({
  id:          i,
  size:        Math.random() * 5 + 3,
  xRatio:      Math.random(),
  yRatio:      Math.random(),
  duration:    Math.random() * 10 + 10,
  delay:       Math.random() * 10,
  opacity:     Math.random() * 0.5 + 0.5,
  waveOffset:  Math.random() * 200 - 100,
}));

const FloatingSparks = React.memo(() => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (containerSize.width === 0 || containerSize.height === 0) {
    return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {INITIAL_SPARKS.map((spark) => {
        const xPos = spark.xRatio * containerSize.width;
        return (
          <motion.div
            key={spark.id}
            className="absolute rounded-full bg-teal-500/80 shadow-[0_0_15px_5px_rgba(45,212,191,0.9)]"
            style={{ width: spark.size, height: spark.size, left: xPos }}
            initial={{ y: containerSize.height + 50, opacity: 0 }}
            animate={{
              y:       [containerSize.height + 50, -50],
              x:       [xPos, xPos + spark.waveOffset],
              opacity: [0, spark.opacity, spark.opacity, 0],
            }}
            transition={{ duration: spark.duration, repeat: Infinity, delay: spark.delay, ease: "linear" }}
          />
        );
      })}
    </div>
  );
});

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button"
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1 text-teal-300 hover:text-teal-300 transition-colors rounded"
      title="Copy"
    >
      {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
    </button>
  );
}

function StepDot({ n, active, done }) {
  return (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-300 ${
      done   ? "bg-emerald-500 text-white" :
      active ? "bg-teal-500 text-white ring-4 ring-teal-500/25" :
               "bg-white/[0.06] text-slate-500 border border-white/10"
    }`}>
      {done ? <Check size={10} /> : n}
    </div>
  );
}

/* ----------------------------------------------------
   MAIN PAGE
---------------------------------------------------- */
export default function TaaqoBridgePage() {
  const [address,   setAddress]   = useState(null);
  const [chainId,   setChainId]   = useState(null);
  const [bscBal,    setBscBal]    = useState("—");
  const [wusdtBal,  setWusdtBal]  = useState("—");
  const [tqoBal,    setTqoBal]    = useState("—");
  const [refreshing, setRefreshing] = useState(false);
  const [tab,       setTab]       = useState("deposit");
  const [amount,    setAmount]    = useState("");
  const [recipientMode,    setRecipientMode]    = useState(false);
  const [customRecipient,  setCustomRecipient]  = useState("");
  const [tx,        setTx]        = useState({ stage: "idle", message: "" });
  const inputRef = useRef(null);

  // Intro sequence
  const [showMainBridge,        setShowMainBridge]        = useState(false);
  const [selectedIntroNetwork,  setSelectedIntroNetwork]  = useState("bsc");
  const [titleIndex,            setTitleIndex]            = useState(0);

  useEffect(() => {
    if (!showMainBridge) return;
    const id = setInterval(() => setTitleIndex((p) => (p === 0 ? 1 : 0)), 3000);
    return () => clearInterval(id);
  }, [showMainBridge]);

  useEffect(() => {
    if (address) {
      const t = setTimeout(() => setShowMainBridge(true), 1200);
      return () => clearTimeout(t);
    } else {
      setShowMainBridge(false);
    }
  }, [address]);

  /* -- Wallet -- */
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setTx({ stage: "error", message: "MetaMask not found. Install from metamask.io" });
        return;
      }
      const p   = new BrowserProvider(window.ethereum);
      await p.send("eth_requestAccounts", []);
      const addr = await (await p.getSigner()).getAddress();
      const net  = await p.getNetwork();
      setAddress(addr);
      setChainId("0x" + net.chainId.toString(16));
    } catch (e) {
      setTx({ stage: "error", message: e?.shortMessage || e?.message || "Connection refused" });
    }
  };

  const disconnect = () => {
    setAddress(null); setChainId(null);
    setBscBal("—"); setWusdtBal("—"); setTqoBal("—");
    setTx({ stage: "idle", message: "" }); setAmount("");
  };

  useEffect(() => {
    if (!window.ethereum) return;
    const onChain    = (id)   => { setChainId(id); setTx({ stage: "idle", message: "" }); };
    const onAccounts = (accs) => { if (!accs.length) disconnect(); else setAddress(accs[0]); };
    window.ethereum.on("chainChanged",    onChain);
    window.ethereum.on("accountsChanged", onAccounts);
    return () => {
      window.ethereum.removeListener("chainChanged",    onChain);
      window.ethereum.removeListener("accountsChanged", onAccounts);
    };
  }, []);

  /* -- Balances -- */
  const updateBalances = useCallback(async () => {
    if (!address) return;
    setRefreshing(true);
    const bscP  = new JsonRpcProvider(CONFIG.BSC_RPC);
    const tqoP  = new JsonRpcProvider(CONFIG.TAAQO_RPC);

    try {
      const usdt = new Contract(CONFIG.BSC_USDT, ERC20_ABI, bscP);
      const b    = await usdt.balanceOf(address);
      setBscBal(fmt(formatUnits(b, CONFIG.BSC_USDT_DECIMALS)));
    } catch { setBscBal("0.00"); }

    try {
      const wusdt = new Contract(CONFIG.TAAQO_WUSDT, ERC20_ABI, tqoP);
      const [w, native] = await Promise.all([wusdt.balanceOf(address), tqoP.getBalance(address)]);
      setWusdtBal(fmt(formatUnits(w, CONFIG.WUSDT_DECIMALS)));
      setTqoBal(fmt(formatUnits(native, 18)));
    } catch { /* TAAQO RPC may be unreachable */ }

    setRefreshing(false);
  }, [address]);

  useEffect(() => {
    if (!address) return;
    updateBalances();
    const t = setInterval(updateBalances, 30_000);
    return () => clearInterval(t);
  }, [address, updateBalances]);

  /* -- Network switch -- */
  const switchNetwork = async (target) => {
    const params = CHAIN_META[target];
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: params.chainId }],
      });
    } catch (err) {
      if (err.code === 4902 || err.code === -32603) {
        await window.ethereum.request({ method: "wallet_addEthereumChain", params: [params] });
      } else throw err;
    }
  };

  /* -- Fresh signer helper (always from window.ethereum) -- */
  const getFreshSigner = async () => {
    const provider = new BrowserProvider(window.ethereum);
    return provider.getSigner();
  };

  /* -- Deposit (BSC -> TAAQO) -- */
  const deposit = async () => {
    const n = parseFloat(amount);
    if (!amount || isNaN(n))         { setTx({ stage: "error", message: "Enter a valid amount" }); return; }
    if (n < CONFIG.MIN_DEPOSIT)      { setTx({ stage: "error", message: `Minimum is ${CONFIG.MIN_DEPOSIT} USDT` }); return; }
    if (n > CONFIG.MAX_DEPOSIT)      { setTx({ stage: "error", message: `Maximum is ${CONFIG.MAX_DEPOSIT.toLocaleString()} USDT` }); return; }
    if (recipientMode && customRecipient && !/^0x[0-9a-fA-F]{40}$/.test(customRecipient)) {
      setTx({ stage: "error", message: "Invalid TAAQO recipient address" }); return;
    }
    try {
      if (chainId?.toLowerCase() !== CONFIG.BSC_CHAIN_ID.toLowerCase()) {
        setTx({ stage: "confirming", message: "Switching to BSC…" });
        await switchNetwork("bsc");
        setTx({ stage: "idle", message: "" }); return;
      }

      // Always get a fresh signer at tx time - prevents stale runner error
      const freshSigner = await getFreshSigner();
      const value  = parseUnits(amount, 18);
      const usdt   = new Contract(CONFIG.BSC_USDT,   ERC20_ABI,  freshSigner);
      const bridge = new Contract(CONFIG.BSC_BRIDGE, BRIDGE_ABI, freshSigner);
      const currentAddress = await freshSigner.getAddress();

      const allowance = await usdt.allowance(currentAddress, CONFIG.BSC_BRIDGE);
      if (BigInt(allowance) < BigInt(value)) {
        setTx({ stage: "approving", message: "Approve USDT spend in MetaMask…" });
        const appTx = await usdt.approve(CONFIG.BSC_BRIDGE, MaxUint256);
        setTx({ stage: "approving", message: "Waiting for approval confirmation…" });
        await appTx.wait();
      }

      setTx({ stage: "confirming", message: "Confirm deposit in MetaMask…" });
      const recipient = recipientMode && customRecipient ? customRecipient : currentAddress;
      const lockTx   = recipient.toLowerCase() === currentAddress.toLowerCase()
        ? await bridge.deposit(value)
        : await bridge.depositTo(value, recipient);

      setTx({ stage: "waiting", message: "Deposit submitted. Waiting for BSC confirmation…", txHash: lockTx.hash, explorerUrl: `${CONFIG.BSC_EXPLORER}/tx/${lockTx.hash}` });
      await lockTx.wait();
      setTx({ stage: "done", message: "Deposit confirmed! wUSDT will arrive on TAAQO in ~3 min.", txHash: lockTx.hash, explorerUrl: `${CONFIG.BSC_EXPLORER}/tx/${lockTx.hash}` });
      setAmount(""); setCustomRecipient(""); setRecipientMode(false);
      updateBalances();
    } catch (e) {
      setTx({ stage: "error", message: e?.code === 4001 || e?.code === "ACTION_REJECTED" ? "Rejected by user" : e?.shortMessage || e?.reason || e?.message || "Transaction failed" });
    }
  };

  /* -- Withdraw (TAAQO -> BSC) -- */
  const withdraw = async () => {
    const n = parseFloat(amount);
    if (!amount || isNaN(n))    { setTx({ stage: "error", message: "Enter a valid amount" }); return; }
    if (n < CONFIG.MIN_DEPOSIT) { setTx({ stage: "error", message: `Minimum is ${CONFIG.MIN_DEPOSIT} wUSDT` }); return; }
    if (recipientMode && customRecipient && !/^0x[0-9a-fA-F]{40}$/.test(customRecipient)) {
      setTx({ stage: "error", message: "Invalid BSC recipient address" }); return;
    }
    try {
      if (chainId?.toLowerCase() !== CONFIG.TAAQO_CHAIN_ID.toLowerCase()) {
        setTx({ stage: "confirming", message: "Switching to TAAQO…" });
        await switchNetwork("taaqo");
        setTx({ stage: "idle", message: "" }); return;
      }

      // Always get a fresh signer at tx time - prevents stale runner error
      const freshSigner = await getFreshSigner();
      const value = parseUnits(amount, 6);
      const wusdt = new Contract(CONFIG.TAAQO_WUSDT, WUSDT_ABI, freshSigner);
      const currentAddress = await freshSigner.getAddress();

      setTx({ stage: "confirming", message: "Confirm burn in MetaMask…" });
      const recipient = recipientMode && customRecipient ? customRecipient : currentAddress;
      const burnTx   = recipient.toLowerCase() === currentAddress.toLowerCase()
        ? await wusdt.burn(value)
        : await wusdt.burnTo(value, recipient);

      setTx({ stage: "waiting", message: "Burning wUSDT…", txHash: burnTx.hash, explorerUrl: `${CONFIG.TAAQO_EXPLORER}/tx/${burnTx.hash}` });
      await burnTx.wait();
      setTx({ stage: "done", message: "Burn confirmed! USDT arrives on BSC in ~60 seconds.", txHash: burnTx.hash, explorerUrl: `${CONFIG.TAAQO_EXPLORER}/tx/${burnTx.hash}` });
      setAmount(""); setCustomRecipient(""); setRecipientMode(false);
      updateBalances();
    } catch (e) {
      setTx({ stage: "error", message: e?.code === 4001 || e?.code === "ACTION_REJECTED" ? "Rejected by user" : e?.shortMessage || e?.reason || e?.message || "Transaction failed" });
    }
  };

  /* -- Derived state -- */
  const isProcessing    = tx.stage === "approving" || tx.stage === "confirming" || tx.stage === "waiting";
  const onBsc           = chainId?.toLowerCase() === CONFIG.BSC_CHAIN_ID.toLowerCase();
  const onTaaqo         = chainId?.toLowerCase() === CONFIG.TAAQO_CHAIN_ID.toLowerCase();
  const onCorrectNetwork = tab === "deposit" ? onBsc : onTaaqo;
  const needsNetwork    = tab === "deposit" ? "bsc" : "taaqo";
  const currentChainMeta = onBsc ? CHAIN_META.bsc : onTaaqo ? CHAIN_META.taaqo : null;

  const depositSteps = [
    { n: 1, label: "Switch to BSC",    active: true,                                                               done: onBsc },
    { n: 2, label: "Approve USDT",     active: onBsc,                                                              done: tx.stage === "confirming" || tx.stage === "waiting" || tx.stage === "done" },
    { n: 3, label: "Confirm Deposit",  active: tx.stage === "confirming" || tx.stage === "waiting" || tx.stage === "done", done: tx.stage === "waiting" || tx.stage === "done" },
    { n: 4, label: "Receive wUSDT",    active: tx.stage === "done",                                                done: tx.stage === "done" },
  ];
  const withdrawSteps = [
    { n: 1, label: "Switch to TAAQO",  active: true,                                          done: onTaaqo },
    { n: 2, label: "Confirm Burn",     active: onTaaqo,                                       done: tx.stage === "waiting" || tx.stage === "done" },
    { n: 3, label: "Receive USDT",     active: tx.stage === "done",                           done: tx.stage === "done" },
  ];
  const steps = tab === "deposit" ? depositSteps : withdrawSteps;

  /* ----------------------------------------------------
     RENDER
  ---------------------------------------------------- */
  return (
    <>
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,900&family=JetBrains+Mono:wght@400;600&display=swap');
      `}</style>

      {/* -- BACKGROUND -- */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0f]">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 15% 15%, rgba(45,212,191,0.07) 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(45,212,191,0.04) 0%, transparent 50%)" }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2dd4bf" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <FloatingSparks />
      </div>

      <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen max-w-[100vw] text-slate-100 overflow-x-hidden relative flex flex-col items-center justify-center">

        {/* ----------------------------
            INTRO (not connected)
        ---------------------------- */}
        <AnimatePresence>
          {!showMainBridge && (
            <motion.div
              key="intro-view"
              className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
              exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.5 } }}
            >
              <div className="flex flex-col md:flex-row gap-0 md:gap-4 items-center mb-8 md:mb-10 overflow-hidden px-5 pointer-events-none">
                <motion.span
                  initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -150, transition: { duration: 0.8, ease: "easeInOut" } }}
                  className="text-[4rem] sm:text-[6rem] lg:text-[8rem] font-black tracking-tighter leading-[0.85] uppercase text-teal-300"
                >TAAQO</motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 150, transition: { duration: 0.8, ease: "easeInOut" } }}
                  className="text-[4rem] sm:text-[6rem] lg:text-[8rem] font-black tracking-tighter leading-[0.85] uppercase text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-500"
                >BRIDGE</motion.span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100, scale: 0.9, transition: { duration: 0.6, ease: "easeInOut" } }}
                className="w-[calc(100%-2.5rem)] max-w-sm bg-[#14141B]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 p-5 mx-5 shadow-2xl pointer-events-auto relative"
              >
                <div className="text-center mb-5">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-[0_8px_30px_rgba(45,212,191,0.3)]">
                    <Wallet className="text-white w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-100 leading-tight">Get Started</h2>
                  <p className="text-xs text-slate-400 mt-1 px-4">Connect your wallet to bridge USDT between BSC and TAAQO.</p>
                </div>

                <div className="space-y-4">
                  {/* Network selector */}
                  <div className="relative flex items-center p-1 bg-white/[0.06] rounded-xl">
                    <div
                      className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#14141B] rounded-lg shadow-sm transition-all duration-300 ease-out"
                      style={{ transform: selectedIntroNetwork === "bsc" ? "translateX(0)" : "translateX(100%)", left: "4px" }}
                    />
                    <button type="button"
                      onClick={() => { setSelectedIntroNetwork("bsc"); switchNetwork("bsc"); }}
                      className={`relative flex items-center justify-center gap-2 z-10 flex-1 py-2 text-xs font-bold transition-colors ${selectedIntroNetwork === "bsc" ? "text-amber-300" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      <img src="usdt.svg" alt="USDT" className="h-[15px]" /> BSC
                    </button>
                    <button type="button"
                      onClick={() => { setSelectedIntroNetwork("taaqo"); switchNetwork("taaqo"); }}
                      className={`relative flex items-center justify-center gap-2 z-10 flex-1 py-2 text-xs font-bold transition-colors ${selectedIntroNetwork === "taaqo" ? "text-teal-200" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      <img src="taaqo.svg" alt="TAAQO" className="h-[15px]" /> TAAQO
                    </button>
                  </div>

                  <button type="button"
                    onClick={connectWallet}
                    className="w-full py-3.5 rounded-xl text-sm font-bold bg-teal-500 hover:bg-teal-600 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95"
                  >
                    <Wallet size={16} /> Connect MetaMask
                  </button>
                </div>

                {tx.stage === "error" && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-300 text-center font-medium">{tx.message}</div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ----------------------------
            MAIN BRIDGE (connected)
        ---------------------------- */}
        <AnimatePresence>
          {showMainBridge && (
            <motion.div
              key="main-bridge"
              initial={{ opacity: 0, scale: 0.85, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
              className="w-full space-y-10 pt-24 pb-16 px-5 relative z-10"
            >
              <div className="w-full max-w-xl mx-auto">

                {/* Animated title */}
                <div className="mb-6 sm:mb-8 h-10 sm:h-12 relative flex items-center justify-center overflow-hidden">
                  <AnimatePresence>
                    <motion.h1
                      key={titleIndex}
                      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight absolute flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {titleIndex === 0
                        ? <>Active <span className="text-teal-300">Bridge</span></>
                        : <>TAAQO <span className="bg-gradient-to-r from-teal-300 to-teal-500 bg-clip-text text-transparent">Bridge</span></>
                      }
                    </motion.h1>
                  </AnimatePresence>
                </div>

                <div className="bg-[#14141B] rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 shadow-[0_20px_60px_-15px_rgba(45,212,191,0.1)] overflow-hidden">
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <motion.div key="connected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">

                      {/* Wallet row */}
                      <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3 relative z-10 w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-[11px] font-black text-white shrink-0">
                            {address?.slice(2, 4).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[12px] font-semibold text-slate-200">{shortAddr(address || "")}</p>
                            <div className="flex gap-2 mt-0.5">
                              <p className="text-[11px] text-slate-500">{currentChainMeta ? currentChainMeta.chainName : `Chain ${chainId}`}</p>
                              {tqoBal !== "—" && (
                                <p className="text-[11px] text-teal-300 font-medium">| {tqoBal} TAAQO</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <CopyBtn text={address || ""} />
                          <button type="button" onClick={updateBalances} disabled={refreshing} className="p-1.5 text-slate-500 hover:text-teal-300 rounded transition-colors relative z-20 pointer-events-auto" title="Refresh">
                            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
                          </button>
                          <button type="button" onClick={disconnect} className="p-1.5 text-slate-500 hover:text-red-400 rounded transition-colors relative z-20 pointer-events-auto">
                            <X size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Converter */}
                      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-2 sm:p-3 relative z-20 pointer-events-auto shadow-inner space-y-1">

                        {/* FROM box */}
                        <div className="bg-[#14141B] border border-white/10 rounded-[1.25rem] p-4 focus-within:border-teal-400 focus-within:ring-[3px] focus-within:ring-teal-500/15 transition-all relative z-10 w-full min-h-[110px] flex flex-col justify-between">
                          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-0 sm:mb-3 gap-1 w-full">
                            <div className="flex items-center justify-between gap-2 w-full sm:w-auto overflow-hidden">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">From {tab === "deposit" ? "BNB Chain" : "TAAQO"}</span>
                              <div className={`sm:hidden flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold transition-colors ${tab === "deposit" ? "bg-amber-500/10 text-amber-300 border border-amber-500/30" : "bg-teal-500/10 text-teal-200 border border-teal-500/30"}`}>
                                {tab === "deposit"
                                  ? <><img src="usdt.svg"  alt="USDT"  className="h-[15px]" /> USDT</>
                                  : <><img src="taaqo.svg" alt="TAAQO" className="h-[15px]" /> wUSDT</>}
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400 shrink-0 mt-2 sm:mt-0">
                              Balance: <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-slate-100">{tab === "deposit" ? bscBal : wusdtBal}</span>
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
                            <div className={`hidden sm:flex shrink-0 justify-center items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold min-w-[100px] transition-colors ${tab === "deposit" ? "bg-amber-500/10 text-amber-300 border border-amber-500/30" : "bg-teal-500/10 text-teal-200 border border-teal-500/30"}`}>
                              {tab === "deposit"
                                ? <><img src="usdt.svg"  alt="USDT"  className="h-[15px]" /> USDT</>
                                : <><img src="taaqo.svg" alt="TAAQO" className="h-[15px]" /> wUSDT</>}
                            </div>
                            <input
                              ref={inputRef}
                              value={amount}
                              onChange={(e) => {
                                let val = e.target.value;
                                if (val !== "" && !isNaN(parseFloat(val)) && parseFloat(val) > CONFIG.MAX_DEPOSIT) val = CONFIG.MAX_DEPOSIT.toString();
                                setAmount(val);
                                setTx({ stage: "idle", message: "" });
                              }}
                              placeholder="0.00"
                              type="number"
                              min={CONFIG.MIN_DEPOSIT}
                              disabled={isProcessing}
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                              className="flex-1 w-full bg-white/[0.03] sm:bg-transparent rounded-xl sm:rounded-none px-3 py-2 sm:p-0 text-left sm:text-right text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 outline-none placeholder:text-slate-600 disabled:opacity-50"
                            />
                          </div>

                          <div className="flex justify-between items-center mt-3 w-full">
                            <button type="button"
                              onClick={() => {
                                const raw = (tab === "deposit" ? bscBal : wusdtBal).replace(/,/g, "");
                                if (raw !== "—" && !isNaN(parseFloat(raw))) { setAmount(raw); inputRef.current?.focus(); }
                              }}
                              className="text-[10px] font-bold text-teal-300 hover:text-teal-200 uppercase tracking-wider bg-teal-500/10 px-2 py-1 rounded-md transition-colors shrink-0"
                            >MAX</button>
                            <span className="text-[10px] font-semibold text-slate-500 truncate ml-2">Min: {CONFIG.MIN_DEPOSIT} / Max: {CONFIG.MAX_DEPOSIT.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Swap toggle */}
                        <div className="relative h-2 flex items-center justify-center -my-1 z-20">
                          <button type="button"
                            onClick={() => { setTab(tab === "deposit" ? "withdraw" : "deposit"); setAmount(""); setTx({ stage: "idle", message: "" }); setRecipientMode(false); setCustomRecipient(""); }}
                            className="w-10 h-10 bg-[#14141B] border-[4px] border-white/10 rounded-xl shadow-sm flex items-center justify-center text-teal-300 hover:bg-white/[0.06] hover:text-teal-200 hover:scale-105 active:scale-95 transition-all relative z-10"
                          >
                            <ArrowDownUp size={16} strokeWidth={3} />
                          </button>
                        </div>

                        {/* TO box */}
                        <div className="bg-white/[0.04] border border-white/10 rounded-[1.25rem] p-4 relative overflow-hidden z-10 w-full min-h-[110px] flex flex-col justify-between">
                          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-0 sm:mb-3 gap-1 w-full">
                            <div className="flex items-center justify-between gap-2 w-full sm:w-auto overflow-hidden">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">To {tab === "deposit" ? "TAAQO" : "BNB Chain"}</span>
                              <div className={`sm:hidden flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold transition-colors ${tab === "deposit" ? "bg-teal-500/10 text-teal-200 border border-teal-500/30" : "bg-amber-500/10 text-amber-300 border border-amber-500/30"}`}>
                                {tab === "deposit"
                                  ? <><img src="taaqo.svg" alt="TAAQO" className="h-[15px]" /> wUSDT</>
                                  : <><img src="usdt.svg"  alt="USDT"  className="h-[15px]" /> USDT</>}
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400 shrink-0 mt-2 sm:mt-0">
                              Balance: <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-slate-100">{tab === "deposit" ? wusdtBal : bscBal}</span>
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
                            <div className={`hidden sm:flex shrink-0 justify-center items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold min-w-[100px] transition-colors ${tab === "deposit" ? "bg-teal-500/10 text-teal-200 border border-teal-500/30" : "bg-amber-500/10 text-amber-300 border border-amber-500/30"}`}>
                              {tab === "deposit"
                                ? <><img src="taaqo.svg" alt="TAAQO" className="h-[15px]" /> wUSDT</>
                                : <><img src="usdt.svg"  alt="USDT"  className="h-[15px]" /> USDT</>}
                            </div>
                            <div
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                              className={`flex-1 min-h-[44px] sm:min-h-0 bg-[#14141B]/50 sm:bg-transparent rounded-xl sm:rounded-none px-3 py-2 sm:p-0 flex items-center justify-start sm:justify-end text-2xl sm:text-3xl font-bold tracking-tight truncate transition-colors ${amount && parseFloat(amount) > 0 ? "text-slate-100" : "text-slate-600"}`}
                            >
                              {amount && parseFloat(amount) > 0 ? calcReceive(amount) : "0.00"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Wrong network banner */}
                      <AnimatePresence>
                        {!onCorrectNetwork && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: "auto", scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                            className="overflow-hidden relative z-10 w-full"
                          >
                            <div className="flex items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3 mt-1 relative z-10 shadow-sm">
                              <div className="flex items-center gap-2">
                                <AlertCircle size={13} className="text-amber-500 shrink-0" />
                                <p className="text-[11px] sm:text-xs font-semibold text-amber-300 leading-tight">
                                  Switch to {needsNetwork === "bsc" ? "BNB Chain" : "TAAQO Network"}
                                </p>
                              </div>
                              <button type="button" onClick={() => switchNetwork(needsNetwork)} className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm relative z-20 pointer-events-auto">
                                <Network size={10} /> Switch
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Fee breakdown */}
                      <AnimatePresence>
                        {amount && parseFloat(amount) > 0 && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden relative z-10 w-full">
                            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-2.5">
                              {[
                                { label: "You send",    value: `${fmt(amount)} ${tab === "deposit" ? "USDT" : "wUSDT"}`, cls: "text-slate-200" },
                                { label: "Fee (0.10%)", value: `− ${calcFee(amount)}`,                                    cls: "text-red-400"   },
                              ].map((r) => (
                                <div key={r.label} className="flex justify-between items-center">
                                  <span className="text-[11px] sm:text-xs text-slate-400">{r.label}</span>
                                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className={`text-[11px] sm:text-xs font-semibold ${r.cls}`}>{r.value}</span>
                                </div>
                              ))}
                              <div className="h-px bg-white/10" />
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-200">You receive</span>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[13px] sm:text-[15px] font-bold text-emerald-600">
                                  {calcReceive(amount)} {tab === "deposit" ? "wUSDT" : "USDT"}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Custom recipient */}
                      <div className="relative z-20 pointer-events-auto w-full">
                        <button type="button"
                          onClick={() => { setRecipientMode(!recipientMode); setCustomRecipient(""); }}
                          className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-500 hover:text-teal-300 transition-colors uppercase tracking-wider relative z-20 pointer-events-auto"
                        >
                          <Plus size={10} className={`transition-transform ${recipientMode ? "rotate-45" : ""}`} />
                          {recipientMode ? "Use my address" : "Send to different address"}
                        </button>
                        <AnimatePresence>
                          {recipientMode && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2.5 overflow-hidden">
                              <input
                                value={customRecipient}
                                onChange={(e) => setCustomRecipient(e.target.value)}
                                placeholder={`${tab === "deposit" ? "TAAQO" : "BSC"} recipient address (0x…)`}
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                className="w-full bg-white/[0.03] border border-white/10 focus:border-teal-400 focus:shadow-[0_0_0_3px_rgba(45,212,191,0.10)] rounded-xl px-4 py-2.5 text-[10px] sm:text-xs text-slate-200 outline-none transition-all placeholder:text-slate-500 pointer-events-auto relative z-20"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Progress steps */}
                      <AnimatePresence>
                        {(isProcessing || tx.stage === "done") && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden relative z-10 w-full px-1">
                            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-3 sm:p-4">
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-2 sm:mb-3">Progress</p>
                              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                                {steps.map((s, i) => (
                                  <div key={s.n} className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                                    <StepDot n={s.n} active={s.active} done={s.done} />
                                    <span className={`text-[9px] sm:text-[11px] font-semibold hidden sm:inline-block ${s.done ? "text-emerald-600" : s.active ? "text-teal-200" : "text-slate-500"}`}>{s.label}</span>
                                    {i < steps.length - 1 && <span className="text-slate-600 mx-0.5 sm:mx-1">›</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* CTA button */}
                      <button type="button"
                        onClick={tab === "deposit" ? deposit : withdraw}
                        disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                        className={`w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] relative z-20 pointer-events-auto ${
                          !onCorrectNetwork
                            ? "bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_14px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_18px_rgba(245,158,11,0.45)]"
                            : "bg-teal-500 hover:bg-teal-600 text-white shadow-[0_4px_14px_rgba(45,212,191,0.35)] hover:shadow-[0_6px_18px_rgba(45,212,191,0.45)]"
                        }`}
                      >
                        {isProcessing ? (
                          <><Loader2 size={14} className="animate-spin" />{tx.message}</>
                        ) : !onCorrectNetwork ? (
                          <><Network size={14} />Switch to {needsNetwork === "bsc" ? "BNB Smart Chain" : "TAAQO Network"}</>
                        ) : tab === "deposit" ? (
                          <>Deposit USDT → TAAQO <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" /></>
                        ) : (
                          <>Withdraw wUSDT → BSC <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" /></>
                        )}
                      </button>

                      {/* Status message */}
                      <AnimatePresence>
                        {(tx.stage === "done" || tx.stage === "error") && tx.message && (
                          <motion.div
                            key={tx.stage + tx.message}
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                            className={`rounded-2xl p-4 border flex items-start gap-3 relative z-20 pointer-events-auto ${tx.stage === "done" ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}
                          >
                            {tx.stage === "done"
                              ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                              : <AlertCircle  size={15} className="text-red-400 shrink-0 mt-0.5" />}
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <p className={`text-sm font-medium leading-snug ${tx.stage === "done" ? "text-emerald-200" : "text-red-200"}`}>{tx.message}</p>
                              {tx.txHash && tx.explorerUrl && (
                                <a href={tx.explorerUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-200 pointer-events-auto">
                                  View on Explorer <ExternalLink size={9} />
                                </a>
                              )}
                            </div>
                            <button type="button" onClick={() => setTx({ stage: "idle", message: "" })} className="text-slate-500 hover:text-slate-300 shrink-0 pointer-events-auto">
                              <X size={13} />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Disclaimer */}
                      <div className="flex items-start gap-2 relative z-10 w-full">
                        <Info size={11} className="text-slate-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed pr-2">
                          Non-custodial · Secured by on-chain replay guards · Relayer processes after chain confirmation · Bridge address: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{shortAddr(CONFIG.BSC_BRIDGE)}</span>
                        </p>
                      </div>

                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
