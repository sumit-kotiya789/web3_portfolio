// Buy-TAAQO bridge: convert USDT on BNB Chain to native TAAQO.
import React, { useState, useEffect, useCallback, useRef } from "react";
import { ArrowDown, Wallet, ExternalLink, Loader2, Check, CheckCircle2, Info, X } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import {
  BSC_CHAIN_ID_HEX,
  BSC_CHAIN_PARAMS,
  USDT_ADDRESS,
  BRIDGE_ADDRESS,
  TAAQO_EXPLORER,
  TAAQO_RPC,
  ERC20_ABI,
  BRIDGE_ABI,
} from "../lib/bridge";

const MIN_DEPOSIT = ethers.parseUnits("1", 18); // $1 USDT

/* -- Floating sparks ------------------------------------------------ */
const INITIAL_SPARKS = Array.from({ length: 60 }).map((_, i) => ({
  id:         i,
  size:       Math.random() * 5 + 3,
  xRatio:     Math.random(),
  duration:   Math.random() * 10 + 10,
  delay:      Math.random() * 10,
  opacity:    Math.random() * 0.5 + 0.5,
  waveOffset: Math.random() * 200 - 100,
}));

const FloatingSparks = React.memo(() => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries)
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (containerSize.width === 0 || containerSize.height === 0)
    return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />;

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

/* -- Step dot ------------------------------------------------------- */
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

/* ------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------ */
const TaaqoBridge = () => {
  // -- Wallet state ---------------------------------------------------
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");

  // -- Balances (real, on-chain) -------------------------------------
  const [usdtBalance, setUsdtBalance]   = useState(0n);
  const [taaqoBalance, setTaaqoBalance] = useState(0n);

  // -- Form state -----------------------------------------------------
  const [usdtAmount, setUsdtAmount] = useState("");
  const [quote, setQuote] = useState(null);

  // -- Allowance / flow state ----------------------------------------
  const [allowance, setAllowance] = useState(0n);
  const [stage, setStage] = useState("idle");
  const [bscTxHash, setBscTxHash]     = useState("");
  const [taaqoTxHash] = useState("");

  const inputRef = useRef(null);
  const onBsc = chainId === BSC_CHAIN_ID_HEX;

  // -- Connect wallet -------------------------------------------------
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected. Please install it first.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      const cid = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(cid);
    } catch (err) {
      toast.error(err?.message ?? "Failed to connect");
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length) setAccount(accounts[0]);
    });
    window.ethereum.request({ method: "eth_chainId" }).then((cid) => setChainId(cid));
    const onAccountsChanged = (accounts) => setAccount(accounts[0] ?? "");
    const onChainChanged    = (cid)      => setChainId(cid);
    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged",    onChainChanged);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", onAccountsChanged);
      window.ethereum?.removeListener?.("chainChanged",    onChainChanged);
    };
  }, []);

  // -- Switch to BSC --------------------------------------------------
  const switchToBsc = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BSC_CHAIN_ID_HEX }],
      });
    } catch (err) {
      if (err?.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [BSC_CHAIN_PARAMS],
        });
      } else {
        toast.error(err?.message ?? "Failed to switch network");
      }
    }
  }, []);

  // -- Refresh balances + allowance ----------------------------------
  const refreshOnChain = useCallback(async () => {
    if (!account || !onBsc) return;
    try {
      const bscProvider = new ethers.BrowserProvider(window.ethereum);
      const usdt = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, bscProvider);
      const [bal, allow] = await Promise.all([
        usdt.balanceOf(account),
        usdt.allowance(account, BRIDGE_ADDRESS),
      ]);
      setUsdtBalance(bal);
      setAllowance(allow);
      const taaqoProvider = new ethers.JsonRpcProvider(TAAQO_RPC);
      const tBal = await taaqoProvider.getBalance(account);
      setTaaqoBalance(tBal);
    } catch (err) {
      console.error("refreshOnChain error", err);
    }
  }, [account, onBsc]);

  useEffect(() => { refreshOnChain(); }, [refreshOnChain]);

  // -- Quote ----------------------------------------------------------
  useEffect(() => {
    const val = parseFloat(usdtAmount);
    if (!usdtAmount || isNaN(val) || val <= 0) { setQuote(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const provider = window.ethereum
          ? new ethers.BrowserProvider(window.ethereum)
          : new ethers.JsonRpcProvider(BSC_CHAIN_PARAMS.rpcUrls[0]);
        const bridge = new ethers.Contract(BRIDGE_ADDRESS, BRIDGE_ABI, provider);
        const amt = ethers.parseUnits(usdtAmount, 18);
        const [netUsdt, fee, taaqoOut] = await bridge.quoteTaaqoFor(amt);
        if (!cancelled) setQuote({ netUsdt, fee, taaqoOut });
      } catch {
        if (!cancelled) setQuote(null);
      }
    })();
    return () => { cancelled = true; };
  }, [usdtAmount]);

  // -- Approve USDT ---------------------------------------------------
  const approve = async (amount) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const usdt = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);
    setStage("approving");
    const tx = await usdt.approve(BRIDGE_ADDRESS, amount);
    toast.loading("Approving USDT…", { id: "tx" });
    await tx.wait();
    toast.success("USDT approved", { id: "tx" });
    setAllowance(amount);
  };

  // -- Deposit --------------------------------------------------------
  const deposit = async (amount) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const bridge = new ethers.Contract(BRIDGE_ADDRESS, BRIDGE_ABI, signer);
    setStage("depositing");
    toast.loading("Sending deposit…", { id: "tx" });
    const tx = await bridge.deposit(amount);
    setBscTxHash(tx.hash);
    await tx.wait();
    toast.success("Deposit confirmed on BSC", { id: "tx" });
    setStage("waitingRelayer");
    toast.loading("Waiting for TAAQO delivery…", { id: "tx" });
    const startBal = taaqoBalance;
    const taaqoProvider = new ethers.JsonRpcProvider(TAAQO_RPC);
    const TIMEOUT_MS = 5 * 60 * 1000;
    const POLL_MS    = 5000;
    const started    = Date.now();
    while (Date.now() - started < TIMEOUT_MS) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      const bal = await taaqoProvider.getBalance(account);
      if (bal > startBal) {
        setTaaqoBalance(bal);
        toast.success("TAAQO received!", { id: "tx" });
        setStage("done");
        return;
      }
    }
    toast.error("Timeout waiting for relayer. Funds are safe — contact support.", { id: "tx" });
    setStage("idle");
  };

  // -- Main handler ---------------------------------------------------
  const handleConvert = async () => {
    if (!account)   { connect();     return; }
    if (!onBsc)     { switchToBsc(); return; }
    const amt = parseFloat(usdtAmount);
    if (!usdtAmount || isNaN(amt) || amt <= 0) { toast.error("Please enter a valid amount"); return; }
    const amountWei = ethers.parseUnits(usdtAmount, 18);
    if (amountWei < MIN_DEPOSIT) { toast.error("Minimum deposit is 1 USDT"); return; }
    if (amountWei > usdtBalance) { toast.error("Insufficient USDT balance"); return; }
    try {
      if (allowance < amountWei) await approve(amountWei);
      await deposit(amountWei);
      await refreshOnChain();
      setUsdtAmount("");
    } catch (err) {
      const msg = err?.shortMessage ?? err?.message ?? "Transaction failed";
      toast.error(msg, { id: "tx" });
      setStage("idle");
    }
  };

  // -- UI helpers -----------------------------------------------------
  const fmt = (wei, decimals, places = 4) => {
    const s = ethers.formatUnits(wei, decimals);
    const n = parseFloat(s);
    return n.toLocaleString(undefined, { maximumFractionDigits: places });
  };

  const buttonLabel = () => {
    if (!account)                    return "Connect Wallet";
    if (!onBsc)                      return "Switch to BSC";
    if (stage === "approving")       return "Approving USDT…";
    if (stage === "depositing")      return "Confirming Deposit…";
    if (stage === "waitingRelayer")  return "Waiting for TAAQO…";
    const amountWei = (() => {
      try { return ethers.parseUnits(usdtAmount || "0", 18); } catch { return 0n; }
    })();
    if (amountWei > 0n && allowance < amountWei) return "Approve & Bridge USDT → TAAQO";
    return "Bridge USDT → TAAQO";
  };

  const busy = stage !== "idle" && stage !== "done";

  // -- Progress steps -------------------------------------------------
  const steps = [
    { n: 1, label: "Switch to BSC",  active: true,                                                                  done: onBsc },
    { n: 2, label: "Approve USDT",   active: onBsc,                                                                 done: stage === "depositing" || stage === "waitingRelayer" || stage === "done" },
    { n: 3, label: "Deposit",        active: stage === "depositing" || stage === "waitingRelayer" || stage === "done", done: stage === "waitingRelayer" || stage === "done" },
    { n: 4, label: "Receive TAAQO",  active: stage === "done",                                                       done: stage === "done" },
  ];

  /* ----------------------------------------------------------------
     RENDER
  ---------------------------------------------------------------- */
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen text-slate-100">

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,900&family=JetBrains+Mono:wght@400;600&display=swap');
      `}</style>

      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" },
        }}
      />

      {/* -- Background -- */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0f]">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 15% 15%, rgba(45,212,191,0.07) 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(45,212,191,0.04) 0%, transparent 50%)" }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="btGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2dd4bf" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#btGrid)" />
        </svg>
        <FloatingSparks />
      </div>

      {/* -- Hero -- */}
      <div className="text-center pt-12 px-4 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-3 mb-3">
          <span className="text-[3rem] sm:text-[5rem] font-black tracking-tighter leading-[0.9] uppercase text-teal-300">TAAQO</span>
          <span className="text-[3rem] sm:text-[5rem] font-black tracking-tighter leading-[0.9] uppercase text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-500">Bridge</span>
        </div>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
          Convert USDT on BNB Chain to native TAAQO · 1 TAAQO = $0.18
        </p>
      </div>

      {/* -- Main card -- */}
      <main className="max-w-[520px] mx-auto mt-8 px-4 pb-20 relative z-10">
        <div className="bg-[#14141B] rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 shadow-[0_20px_60px_-15px_rgba(45,212,191,0.12)] overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">

            {/* Wallet row */}
            {account && (
              <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-[11px] font-black text-white shrink-0">
                    {account.slice(2, 4).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[12px] font-semibold text-slate-200">
                      {account.slice(0, 6)}…{account.slice(-4)}
                    </p>
                    <div className="flex gap-2 mt-0.5">
                      <p className="text-[11px] text-slate-500">{onBsc ? "BNB Smart Chain" : "Wrong Network"}</p>
                      {taaqoBalance > 0n && (
                        <p className="text-[11px] text-teal-300 font-medium">| {fmt(taaqoBalance, 18, 2)} TAAQO</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${onBsc ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
              </div>
            )}

            {/* Converter shell */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-2 sm:p-3 shadow-inner space-y-1">

              {/* FROM (USDT input) */}
              <div className="bg-[#14141B] border border-white/10 rounded-[1.25rem] p-4 focus-within:border-teal-400 focus-within:ring-[3px] focus-within:ring-teal-500/15 transition-all w-full min-h-[110px] flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 w-full">
                  <div className="flex items-center justify-between gap-2 w-full sm:w-auto overflow-hidden">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">You Pay</span>
                    <div className="sm:hidden flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      <img src="usdt.svg" alt="USDT" className="h-[14px]" /> USDT
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0 mt-1 sm:mt-0">
                    Balance: <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-slate-100">{fmt(usdtBalance, 18, 2)}</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-3 sm:mt-2">
                  <div className="hidden sm:flex shrink-0 justify-center items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold min-w-[100px] bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    <img src="usdt.svg" alt="USDT" className="h-[15px]" /> USDT
                  </div>
                  <input
                    ref={inputRef}
                    type="number"
                    placeholder="0.00"
                    disabled={busy}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="flex-1 w-full bg-white/[0.03] sm:bg-transparent rounded-xl sm:rounded-none px-3 py-2 sm:p-0 text-left sm:text-right text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 outline-none placeholder:text-slate-600 disabled:opacity-50"
                    value={usdtAmount}
                    onChange={(e) => setUsdtAmount(e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center mt-3 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      if (usdtBalance > 0n) {
                        setUsdtAmount(ethers.formatUnits(usdtBalance, 18));
                        inputRef.current?.focus();
                      }
                    }}
                    className="text-[10px] font-bold text-teal-300 hover:text-teal-200 uppercase tracking-wider bg-teal-500/10 px-2 py-1 rounded-md transition-colors shrink-0"
                  >MAX</button>
                  <span className="text-[10px] font-semibold text-slate-500 truncate ml-2">Rate: 1 TAAQO = $0.18</span>
                </div>

                {/* Minimum deposit warning */}
                {usdtAmount && (() => { try { return ethers.parseUnits(usdtAmount, 18) < MIN_DEPOSIT; } catch { return false; } })() && (
                  <p className="text-[10px] font-semibold text-red-400 mt-2">Minimum deposit is 1 USDT</p>
                )}
              </div>

              {/* Arrow toggle */}
              <div className="relative h-2 flex items-center justify-center -my-1 z-10">
                <div className="w-10 h-10 bg-[#14141B] border-[4px] border-white/10 rounded-xl shadow-sm flex items-center justify-center text-teal-300">
                  <ArrowDown size={16} strokeWidth={3} />
                </div>
              </div>

              {/* TO (TAAQO output) */}
              <div className="bg-white/[0.04] border border-white/10 rounded-[1.25rem] p-4 w-full min-h-[110px] flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 w-full">
                  <div className="flex items-center justify-between gap-2 w-full sm:w-auto overflow-hidden">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">You Receive</span>
                    <div className="sm:hidden flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold bg-teal-500/10 text-teal-200 border border-teal-500/30">
                      <img src="taaqo.svg" alt="TAAQO" className="h-[14px]" /> TAAQO
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0 mt-1 sm:mt-0">
                    Balance: <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-slate-100">{fmt(taaqoBalance, 18, 2)}</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-3 sm:mt-2">
                  <div className="hidden sm:flex shrink-0 justify-center items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold min-w-[100px] bg-teal-500/10 text-teal-200 border border-teal-500/30">
                    <img src="taaqo.svg" alt="TAAQO" className="h-[15px]" /> TAAQO
                  </div>
                  <div
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className={`flex-1 min-h-[44px] sm:min-h-0 bg-[#14141B]/50 sm:bg-transparent rounded-xl sm:rounded-none px-3 py-2 sm:p-0 flex items-center justify-start sm:justify-end text-2xl sm:text-3xl font-bold tracking-tight truncate ${quote ? "text-slate-100" : "text-slate-600"}`}
                  >
                    {quote ? parseFloat(ethers.formatUnits(quote.taaqoOut, 18)).toLocaleString(undefined, { maximumFractionDigits: 4 }) : "0.00"}
                  </div>
                </div>
              </div>
            </div>

            {/* Fee breakdown */}
            <AnimatePresence>
              {quote && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-2.5">
                    {[
                      { label: "You send",    value: `${parseFloat(usdtAmount).toLocaleString()} USDT`,           cls: "text-slate-200" },
                      { label: "Fee (0.10%)", value: `−${parseFloat(ethers.formatUnits(quote.fee, 18)).toFixed(6)} USDT`, cls: "text-red-400" },
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
                        {parseFloat(ethers.formatUnits(quote.taaqoOut, 18)).toLocaleString(undefined, { maximumFractionDigits: 4 })} TAAQO
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress steps */}
            <AnimatePresence>
              {(busy || stage === "done") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden px-1"
                >
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
            <button
              type="button"
              onClick={handleConvert}
              disabled={busy}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] ${
                !account
                  ? "bg-teal-500 hover:bg-teal-600 text-white shadow-[0_4px_14px_rgba(0,0,0,0.2)]"
                  : !onBsc
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_14px_rgba(245,158,11,0.35)]"
                  : "bg-teal-500 hover:bg-teal-600 text-white shadow-[0_4px_14px_rgba(45,212,191,0.35)] hover:shadow-[0_6px_18px_rgba(45,212,191,0.45)]"
              }`}
            >
              {busy
                ? <><Loader2 size={14} className="animate-spin" />{buttonLabel()}</>
                : !account
                ? <><Wallet size={14} />{buttonLabel()}</>
                : <>{buttonLabel()}</>
              }
            </button>

            {/* Done status message */}
            <AnimatePresence>
              {stage === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="rounded-2xl p-4 border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3"
                >
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-emerald-200">
                      TAAQO delivered! New balance: {fmt(taaqoBalance, 18, 4)} TAAQO
                    </p>
                    {bscTxHash && (
                      <a
                        href={`https://bscscan.com/tx/${bscTxHash}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-200"
                      >
                        View BSC deposit <ExternalLink size={9} />
                      </a>
                    )}
                    {taaqoTxHash && (
                      <a
                        href={`${TAAQO_EXPLORER}/tx/${taaqoTxHash}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-200"
                      >
                        View TAAQO delivery <ExternalLink size={9} />
                      </a>
                    )}
                  </div>
                  <button type="button" onClick={() => setStage("idle")} className="text-slate-500 hover:text-slate-300 shrink-0">
                    <X size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Disclaimer */}
            <div className="flex items-start gap-2">
              <Info size={11} className="text-slate-600 shrink-0 mt-0.5" />
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed pr-2">
                Non-custodial · 0.10% bridge fee · Relayer processes after chain confirmation · Bridge:{" "}
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {BRIDGE_ADDRESS.slice(0, 6)}…{BRIDGE_ADDRESS.slice(-4)}
                </span>
              </p>
            </div>

          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Fee",      value: "0.10%",     icon: <img src="usdt.svg"  alt="" className="h-4 w-4 opacity-60" /> },
            { label: "Rate",     value: "$0.18",      icon: <img src="taaqo.svg" alt="" className="h-4 w-4 opacity-60" /> },
            { label: "Est. Time",value: "~30 sec",   icon: <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> },
          ].map((s) => (
            <div key={s.label} className="text-center bg-[#14141B]/80 border border-white/10 rounded-xl p-3 shadow-sm">
              <div className="flex justify-center mb-1">{s.icon}</div>
              <p className="text-xs font-bold text-slate-200">{s.value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TaaqoBridge;
