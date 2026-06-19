import React, { useState, useEffect, useCallback, useRef } from "react";
import { ArrowUpDown, Wallet, ExternalLink, Loader2, CheckCircle2, Info, X, RefreshCw, ShieldAlert, AlertTriangle, Crown, Check, Plus, Minus, Power, Clock } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";

// -- Constants ---------------------------------------------------------------
const BSC_CHAIN_ID_HEX   = "0x38";
const TAAQO_CHAIN_ID_HEX = "0x15BE";
const BSC_CHAIN_PARAMS = {
  chainId: BSC_CHAIN_ID_HEX,
  chainName: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-rpc.publicnode.com"],
  blockExplorerUrls: ["https://bscscan.com"],
};
const TAAQO_CHAIN_PARAMS = {
  chainId: TAAQO_CHAIN_ID_HEX,
  chainName: "TAAQO Mainnet",
  nativeCurrency: { name: "TAAQO", symbol: "TAAQO", decimals: 18 },
  rpcUrls: ["https://rpc.taaqo.com"],
  blockExplorerUrls: ["https://taaqoscan.com"],
};

const BSC_USDT    = "0x55d398326f99059fF775485246999027B3197955";
const TAAQO_USDT  = "0x2da1743cD99F7D2624a4f40a79A1A1859693b7FD";
const BSC_VAULT   = "0x9CD9973E3445847Cd1a2C18117a13F8c998a3e4D";
const TAAQO_VAULT = "0xD69cD4284425108742B7985022FD9D0A44F94B38";
const BSC_RPC     = "https://bsc-rpc.publicnode.com";
const TAAQO_RPC   = "https://rpc.taaqo.com";

const LOW_LIQUIDITY_THRESHOLD = ethers.parseUnits("10",   18);
const LOW_RELAYER_THRESHOLD   = ethers.parseUnits("0.05", 18); // warn when relayer gas < 0.05 native
const MIN_DEPOSIT              = ethers.parseUnits("1",   18);

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
];
const VAULT_ABI = [
  // user
  "function deposit(uint256 amount, address recipient) external",
  // owner reads
  "function vaultBalance() external view returns (uint256)",
  "function owner() external view returns (address)",
  "function relayer() external view returns (address)",
  "function feeRecipient() external view returns (address)",
  "function feeBps() external view returns (uint256)",
  "function minDeposit() external view returns (uint256)",
  "function maxDeposit() external view returns (uint256)",
  "function paused() external view returns (bool)",
  // owner writes
  "function addLiquidity(uint256 amount) external",
  "function removeLiquidity(uint256 amount) external",
  "function setRelayer(address _r) external",
  "function setFee(uint256 _bps, address _r) external",
  "function setLimits(uint256 _min, uint256 _max) external",
  "function setPaused(bool _p) external",
  "function transferOwnership(address _new) external",
];

// -- Floating sparks ---------------------------------------------------------
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

// -- Step dot ----------------------------------------------------------------
function StepDot({ n, active, done }) {
  return (
    <motion.div
      animate={{ scale: active && !done ? [1, 1.15, 1] : 1 }}
      transition={{ duration: 0.8, repeat: active && !done ? Infinity : 0 }}
      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-300 ${
        done   ? "bg-emerald-500 text-white" :
        active ? "bg-teal-500 text-white ring-4 ring-teal-500/25" :
                 "bg-white/[0.06] text-slate-500 border border-white/10"
      }`}
    >
      {done ? <Check size={10} /> : n}
    </motion.div>
  );
}

// -- Chain badge -------------------------------------------------------------
function ChainBadge({ chain, size = "md" }) {
  const isBsc = chain === "bsc";
  const sz = size === "sm" ? "text-[10px] px-2 py-0.5 gap-1" : "text-xs px-3 py-1.5 gap-1.5";
  return (
    <div className={`inline-flex items-center rounded-full font-bold ${sz} ${
      isBsc
        ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
        : "bg-teal-500/10 text-teal-200 border border-teal-500/30"
    }`}>
      <div className={`rounded-full ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"} ${isBsc ? "bg-amber-500" : "bg-teal-500"}`} />
      {isBsc ? "BNB Chain" : "TAAQO"}
    </div>
  );
}

// -- VaultSettings default ---------------------------------------------------
const DEFAULT_SETTINGS = {
  feeBps:       10n,
  minDeposit:   ethers.parseUnits("1", 18),
  maxDeposit:   ethers.parseUnits("100000", 18),
  paused:       false,
  relayer:      "",
  feeRecipient: "",
};

// -- CopyableLink ------------------------------------------------------------
function CopyableLink({ value, display, href, className = "" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <button type="button" onClick={copy} className={`transition-colors ${copied ? "text-emerald-500" : "hover:text-teal-300"}`}>
        {copied ? "Copied!" : display}
      </button>
      {!copied && (
        <a href={href} target="_blank" rel="noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
          <ExternalLink size={9} />
        </a>
      )}
    </span>
  );
}

// -- Admin Panel -------------------------------------------------------------
const AdminPanel = ({
  vaultLiq, relayerBal, settings, account, chainId, switchChain, onRefresh, fmt,
}) => {
  const bscCritical   = vaultLiq.bsc   < LOW_LIQUIDITY_THRESHOLD;
  const taaqoCritical = vaultLiq.taaqo < LOW_LIQUIDITY_THRESHOLD;

  const [activeVault, setActiveVault] = useState("bsc");
  const [txBusy, setTxBusy]           = useState(false);
  const [liqAmt, setLiqAmt]     = useState("");
  const [remAmt, setRemAmt]     = useState("");
  const [newOwner, setNewOwner] = useState("");

  const isOnBsc      = chainId.toLowerCase() === BSC_CHAIN_ID_HEX.toLowerCase();
  const isOnTaaqo    = chainId.toLowerCase() === TAAQO_CHAIN_ID_HEX.toLowerCase();
  const onRightChain = activeVault === "bsc" ? isOnBsc : isOnTaaqo;
  const vaultAddr    = activeVault === "bsc" ? BSC_VAULT   : TAAQO_VAULT;
  const usdtAddr     = activeVault === "bsc" ? BSC_USDT    : TAAQO_USDT;
  const chainParams  = activeVault === "bsc" ? BSC_CHAIN_PARAMS : TAAQO_CHAIN_PARAMS;
  const activeLiq    = activeVault === "bsc" ? vaultLiq.bsc   : vaultLiq.taaqo;
  const activeSet    = activeVault === "bsc" ? settings.bsc   : settings.taaqo;

  const getSigner = () => new ethers.BrowserProvider(window.ethereum).getSigner();

  const withTx = async (fn) => {
    if (!onRightChain) { switchChain(chainParams); return; }
    if (txBusy) return;
    setTxBusy(true);
    try { await fn(); onRefresh(); }
    catch (e) { toast.error(e?.shortMessage ?? e?.message ?? "Transaction failed", { id: "admin" }); }
    finally { setTxBusy(false); }
  };

  const ic  = "mono w-full bg-[#14141B] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-slate-100 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-slate-600";
  const btn = (color) => `flex items-center gap-1 shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed ${color}`;

  const SpinOrIcon = ({ icon: Icon }) =>
    txBusy ? <Loader2 size={10} className="animate-spin" /> : <Icon size={10} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="mt-4 rounded-[1.5rem] overflow-hidden border border-amber-500/30 bg-amber-500/[0.06]"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-amber-500/25 bg-amber-500/10">
        <Crown size={13} className="text-amber-500" />
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300">Admin Panel</span>
        <span className="ml-auto text-[10px] text-amber-500/60 font-mono">Owner Only</span>
      </div>

      <div className="p-4 space-y-4">

        {/* -- Vault Status Cards -- */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "bsc",   label: "BSC Vault",  liq: vaultLiq.bsc,   crit: bscCritical,   color: "text-amber-300" },
            { key: "taaqo", label: "TAAQO Vault", liq: vaultLiq.taaqo, crit: taaqoCritical, color: "text-teal-300"  },
          ].map(v => (
            <div key={v.key} className={`rounded-2xl p-3.5 border bg-[#14141B] transition-all ${
              v.crit ? "border-red-500/40 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]" : "border-white/10"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${v.color}`}>{v.label}</span>
                {v.crit && <AlertTriangle size={11} className="text-red-400 animate-pulse" />}
              </div>
              <p className="font-mono text-xl font-bold text-slate-100">${fmt(v.liq, 2)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{fmt(v.liq, 4)} USDT</p>
            </div>
          ))}
        </div>

        {/* Critical alerts */}
        <AnimatePresence>
          {(bscCritical || taaqoCritical) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden space-y-2"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Alerts</p>
              {bscCritical && (
                <div className="flex items-start gap-2.5 rounded-xl p-3 border text-[11px] leading-relaxed bg-red-500/10 border-red-500/30 text-red-300">
                  <ShieldAlert size={13} className="shrink-0 mt-0.5 text-red-400" />
                  <span><strong>BSC Vault Critical:</strong> Only <span className="font-mono">${fmt(vaultLiq.bsc, 2)} USDT</span> remaining.</span>
                </div>
              )}
              {taaqoCritical && (
                <div className="flex items-start gap-2.5 rounded-xl p-3 border text-[11px] leading-relaxed bg-red-500/10 border-red-500/30 text-red-300">
                  <ShieldAlert size={13} className="shrink-0 mt-0.5 text-red-400" />
                  <span><strong>TAAQO Vault Critical:</strong> Only <span className="font-mono">${fmt(vaultLiq.taaqo, 2)} USDT</span> remaining.</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* -- Relayer Health -- */}
        {(settings.bsc.relayer || settings.taaqo.relayer) && (() => {
          const bscRelAddr = settings.bsc.relayer;
          const bscLow   = relayerBal.bsc   < LOW_RELAYER_THRESHOLD;
          const taaqoLow = relayerBal.taaqo < LOW_RELAYER_THRESHOLD;
          return (
            <div className="border-t border-white/[0.06] pt-4 space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Relayer Health</p>
              <div className="grid grid-cols-2 gap-3">
                {/* BSC relayer - BNB balance */}
                <div className={`rounded-2xl p-3.5 border bg-[#14141B] transition-all ${bscLow ? "border-orange-500/40 shadow-[0_0_0_3px_rgba(251,146,60,0.08)]" : "border-white/10"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-300">BSC · BNB</span>
                    {bscLow && <AlertTriangle size={11} className="text-orange-400 animate-pulse" />}
                  </div>
                  <p className={`font-mono text-lg font-bold ${bscLow ? "text-orange-400" : "text-slate-100"}`}>
                    {fmt(relayerBal.bsc, 4)}
                  </p>
                  {bscRelAddr && (
                    <CopyableLink
                      value={bscRelAddr}
                      display={`${bscRelAddr.slice(0,6)}…${bscRelAddr.slice(-4)}`}
                      href={`https://bscscan.com/address/${bscRelAddr}`}
                      className="mono text-[10px] text-slate-500 mt-1"
                    />
                  )}
                </div>
                {/* TAAQO relayer - TAAQO native balance */}
                <div className={`rounded-2xl p-3.5 border bg-[#14141B] transition-all ${taaqoLow ? "border-orange-500/40 shadow-[0_0_0_3px_rgba(251,146,60,0.08)]" : "border-white/10"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-teal-300">TAAQO · Gas</span>
                    {taaqoLow && <AlertTriangle size={11} className="text-orange-400 animate-pulse" />}
                  </div>
                  <p className={`font-mono text-lg font-bold ${taaqoLow ? "text-orange-400" : "text-slate-100"}`}>
                    {fmt(relayerBal.taaqo, 4)}
                  </p>
                </div>
              </div>
              {/* Low-gas warnings */}
              <AnimatePresence>
                {(bscLow || taaqoLow) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-2"
                  >
                    {bscLow && (
                      <div className="flex items-start gap-2.5 rounded-xl p-3 border text-[11px] leading-relaxed bg-orange-500/10 border-orange-500/30 text-orange-300">
                        <AlertTriangle size={13} className="shrink-0 mt-0.5 text-orange-400" />
                        <span><strong>Relayer BNB Low:</strong> Only <span className="font-mono">{fmt(relayerBal.bsc, 4)} BNB</span> on BSC — top up to keep bridging active.</span>
                      </div>
                    )}
                    {taaqoLow && (
                      <div className="flex items-start gap-2.5 rounded-xl p-3 border text-[11px] leading-relaxed bg-orange-500/10 border-orange-500/30 text-orange-300">
                        <AlertTriangle size={13} className="shrink-0 mt-0.5 text-orange-400" />
                        <span><strong>Relayer TAAQO Gas Low:</strong> Only <span className="font-mono">{fmt(relayerBal.taaqo, 4)} TAAQO</span> — top up to keep bridging active.</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })()}

        {/* -- Vault Management -- */}
        <div className="border-t border-white/[0.06] pt-4 space-y-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Vault Management</p>

          {/* Vault selector tabs */}
          <div className="bg-white/[0.06] rounded-xl p-0.5 flex gap-0.5">
            {["bsc", "taaqo"].map(v => (
              <button type="button" key={v} onClick={() => setActiveVault(v)}
                className={`flex-1 py-2 rounded-[10px] text-[11px] font-bold transition-all uppercase tracking-wider ${
                  activeVault === v ? "bg-[#14141B] text-slate-100 shadow-sm" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {v === "bsc" ? "BSC Vault" : "TAAQO Vault"}
              </button>
            ))}
          </div>

          {/* Contract info (read) */}
          <div className="bg-white/[0.03] rounded-2xl p-3 border border-white/[0.06] space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">Contract Info</p>
            {[
              { label: "Balance",     val: `$${fmt(activeLiq, 2)}  (${fmt(activeLiq, 4)} USDT)` },
              { label: "Min Deposit", val: `${fmt(activeSet.minDeposit, 2)} USDT` },
              { label: "Max Deposit", val: `${fmt(activeSet.maxDeposit, 0)} USDT` },
              { label: "Status",      val: activeSet.paused ? "PAUSED" : "Active", warn: activeSet.paused },
            ].map(r => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-[11px] text-slate-500">{r.label}</span>
                <span className={`mono text-[11px] font-semibold ${r.warn ? "text-red-400" : "text-slate-200"}`}>{r.val}</span>
              </div>
            ))}
            {/* Relayer - copy + explorer */}
            {[
              { label: "Relayer",       addr: activeSet.relayer },
              { label: "Fee Recipient", addr: activeSet.feeRecipient },
            ].map(r => {
              const explorerBase = activeVault === "bsc" ? "https://bscscan.com/address/" : "https://taaqoscan.com/address/";
              return (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">{r.label}</span>
                  {r.addr ? (
                    <CopyableLink
                      value={r.addr}
                      display={`${r.addr.slice(0,6)}…${r.addr.slice(-4)}`}
                      href={`${explorerBase}${r.addr}`}
                      className="mono text-[11px] font-semibold text-slate-200"
                    />
                  ) : (
                    <span className="mono text-[11px] text-slate-500">—</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Chain switch notice */}
          {account && !onRightChain && (
            <div className="rounded-xl p-3 bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <span className="text-[11px] text-amber-300 font-medium">
                Switch to {activeVault === "bsc" ? "BNB Chain" : "TAAQO"} to write
              </span>
              <button type="button"
                onClick={() => switchChain(chainParams)}
                className="text-[11px] font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-2.5 py-1.5 rounded-xl transition-colors"
              >
                Switch
              </button>
            </div>
          )}

          {/* Write forms - dimmed when wrong chain */}
          <div className={`space-y-3 ${!account || !onRightChain ? "opacity-40 pointer-events-none select-none" : ""}`}>

            {/* Add Liquidity */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Plus size={10} /> Add Liquidity
              </p>
              <div className="flex gap-2">
                <input type="number" value={liqAmt} onChange={e => setLiqAmt(e.target.value)} placeholder="USDT amount" className={ic} />
                <button type="button"
                  disabled={txBusy || !liqAmt}
                  className={btn("bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm")}
                  onClick={() => withTx(async () => {
                    const amt = ethers.parseUnits(liqAmt, 18);
                    const s   = await getSigner();
                    toast.loading("Approving USDT…", { id: "admin" });
                    await (await new ethers.Contract(usdtAddr, ERC20_ABI, s).approve(vaultAddr, amt)).wait();
                    toast.loading("Adding liquidity…", { id: "admin" });
                    await (await new ethers.Contract(vaultAddr, VAULT_ABI, s).addLiquidity(amt)).wait();
                    toast.success("Liquidity added", { id: "admin" });
                    setLiqAmt("");
                  })}
                >
                  <SpinOrIcon icon={Plus} /> Add
                </button>
              </div>
            </div>

            {/* Remove Liquidity */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Minus size={10} /> Remove Liquidity
              </p>
              <div className="flex gap-2">
                <input type="number" value={remAmt} onChange={e => setRemAmt(e.target.value)} placeholder="USDT amount" className={ic} />
                <button type="button"
                  disabled={txBusy || !remAmt}
                  className={btn("bg-red-500 text-white hover:bg-red-600 shadow-sm")}
                  onClick={() => withTx(async () => {
                    const s = await getSigner();
                    toast.loading("Removing liquidity…", { id: "admin" });
                    await (await new ethers.Contract(vaultAddr, VAULT_ABI, s).removeLiquidity(ethers.parseUnits(remAmt, 18))).wait();
                    toast.success("Removed", { id: "admin" });
                    setRemAmt("");
                  })}
                >
                  <SpinOrIcon icon={Minus} /> Remove
                </button>
              </div>
            </div>

            {/* Pause / Unpause */}
            <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vault Status</p>
                <p className={`text-[12px] font-bold mt-0.5 ${activeSet.paused ? "text-red-400" : "text-emerald-600"}`}>
                  {activeSet.paused ? "PAUSED" : "Active"}
                </p>
              </div>
              <button type="button"
                disabled={txBusy}
                className={btn(activeSet.paused
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20"
                  : "bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20"
                )}
                onClick={() => withTx(async () => {
                  const s = await getSigner();
                  const p = activeSet.paused;
                  toast.loading(p ? "Unpausing…" : "Pausing…", { id: "admin" });
                  await (await new ethers.Contract(vaultAddr, VAULT_ABI, s).setPaused(!p)).wait();
                  toast.success(p ? "Unpaused" : "Paused", { id: "admin" });
                })}
              >
                <SpinOrIcon icon={Power} /> {activeSet.paused ? "Unpause" : "Pause"}
              </button>
            </div>

            {/* Transfer Ownership - danger zone */}
            <div className="space-y-1.5 pt-3 border-t border-red-500/20">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert size={10} /> Transfer Ownership
              </p>
              <div className="flex gap-2">
                <input value={newOwner} onChange={e => setNewOwner(e.target.value)} placeholder="New owner 0x…" className={ic} />
                <button type="button"
                  disabled={txBusy || !newOwner}
                  className={btn("bg-red-500 text-white hover:bg-red-600 shadow-sm")}
                  onClick={() => withTx(async () => {
                    const s = await getSigner();
                    toast.loading("Transferring…", { id: "admin" });
                    await (await new ethers.Contract(vaultAddr, VAULT_ABI, s).transferOwnership(newOwner)).wait();
                    toast.success("Ownership transferred", { id: "admin" });
                    setNewOwner("");
                  })}
                >
                  <SpinOrIcon icon={ShieldAlert} /> Transfer
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* System nominal */}
        {!bscCritical && !taaqoCritical && (
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            <span className="text-[11px] text-emerald-600/70">All systems nominal</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------------
const UsdtBridge = () => {
  const [account, setAccount]     = useState("");
  const [chainId, setChainId]     = useState("");
  const [direction, setDirection] = useState("bsc-to-taaqo");
  const [amount, setAmount]       = useState("");
  const [stage, setStage]         = useState("idle");
  const [bscBal, setBscBal]       = useState(0n);
  const [taaqoBal, setTaaqoBal]   = useState(0n);
  const [allowance, setAllowance] = useState(0n);
  const [vaultLiq, setVaultLiq]   = useState({ bsc: 0n, taaqo: 0n });
  const [vaultSettings, setVaultSettings] = useState({ bsc: DEFAULT_SETTINGS, taaqo: DEFAULT_SETTINGS });
  const [relayerBal, setRelayerBal]       = useState({ bsc: 0n, taaqo: 0n });
  const [txHash, setTxHash]       = useState("");
  const [isOwner, setIsOwner]     = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successTxHash, setSuccessTxHash]         = useState("");
  const [successIsBsc, setSuccessIsBsc]           = useState(true);
  const inputRef = useRef(null);

  const isBscToTaaqo  = direction === "bsc-to-taaqo";
  const fromChain     = isBscToTaaqo ? "bsc"   : "taaqo";
  const toChain       = isBscToTaaqo ? "taaqo" : "bsc";
  const neededChainId = isBscToTaaqo ? BSC_CHAIN_ID_HEX : TAAQO_CHAIN_ID_HEX;
  const onRightChain  = chainId.toLowerCase() === neededChainId.toLowerCase();
  const fromBalance   = isBscToTaaqo ? bscBal : taaqoBal;
  const toBalance     = isBscToTaaqo ? taaqoBal : bscBal;
  const busy          = stage !== "idle" && stage !== "done";

  const fee = (() => {
    try { const a = ethers.parseUnits(amount || "0", 18); return (a * 10n) / 10000n; }
    catch { return 0n; }
  })();
  const netAmount = (() => {
    try { const a = ethers.parseUnits(amount || "0", 18); return a > fee ? a - fee : 0n; }
    catch { return 0n; }
  })();

  // -- Wallet ----------------------------------------------------------------
  const connect = useCallback(async () => {
    if (!window.ethereum) { toast.error("MetaMask not detected"); return; }
    try {
      const [acc] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(acc);
      const cid = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(cid);
    } catch (e) { toast.error(e?.message ?? "Failed to connect"); }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.request({ method: "eth_accounts" }).then((a) => { if (a[0]) setAccount(a[0]); });
    window.ethereum.request({ method: "eth_chainId" }).then(setChainId);
    const onAcc = (a) => setAccount(a[0] ?? "");
    const onCid = (c) => setChainId(c);
    window.ethereum.on("accountsChanged", onAcc);
    window.ethereum.on("chainChanged",    onCid);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", onAcc);
      window.ethereum?.removeListener?.("chainChanged",    onCid);
    };
  }, []);

  // -- Check owner -----------------------------------------------------------
  const checkOwner = useCallback(async (addr) => {
    if (!addr) { setIsOwner(false); return; }
    setOwnerLoading(true);
    try {
      const bscProv   = new ethers.JsonRpcProvider(BSC_RPC);
      const taaqoProv = new ethers.JsonRpcProvider(TAAQO_RPC);
      const bscVaultC   = new ethers.Contract(BSC_VAULT,   VAULT_ABI, bscProv);
      const taaqoVaultC = new ethers.Contract(TAAQO_VAULT, VAULT_ABI, taaqoProv);
      let ownerOnBsc = "", ownerOnTaaqo = "";
      try { ownerOnBsc   = await bscVaultC.owner();   } catch {}
      try { ownerOnTaaqo = await taaqoVaultC.owner(); } catch {}
      setIsOwner(
        ownerOnBsc.toLowerCase()   === addr.toLowerCase() ||
        ownerOnTaaqo.toLowerCase() === addr.toLowerCase()
      );
    } catch { setIsOwner(false); }
    finally { setOwnerLoading(false); }
  }, []);

  useEffect(() => { checkOwner(account); }, [account, checkOwner]);

  // -- Auto-dismiss success popup after 3 s, then show bottom banner ---------
  useEffect(() => {
    if (stage !== "done") return;
    setSuccessTxHash(txHash);
    setSuccessIsBsc(isBscToTaaqo);
    const t = setTimeout(() => {
      setStage("idle");
      setTxHash("");
      setShowSuccessBanner(true);
    }, 3000);
    return () => clearTimeout(t);
  }, [stage, txHash, isBscToTaaqo]);

  // -- Switch chain ----------------------------------------------------------
  const switchChain = useCallback(async (params) => {
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: params.chainId }] });
    } catch (e) {
      if (e?.code === 4902) await window.ethereum.request({ method: "wallet_addEthereumChain", params: [params] });
      else toast.error(e?.message ?? "Switch failed");
    }
  }, []);

  // -- Balances --------------------------------------------------------------
  const refreshBalances = useCallback(async () => {
    if (!account) return;
    try {
      const bscProv   = new ethers.JsonRpcProvider(BSC_RPC);
      const taaqoProv = new ethers.JsonRpcProvider(TAAQO_RPC);
      const bscUsdt     = new ethers.Contract(BSC_USDT,   ERC20_ABI, bscProv);
      const taaqoUsdt   = new ethers.Contract(TAAQO_USDT, ERC20_ABI, taaqoProv);
      const bscVaultC   = new ethers.Contract(BSC_VAULT,   VAULT_ABI, bscProv);
      const taaqoVaultC = new ethers.Contract(TAAQO_VAULT, VAULT_ABI, taaqoProv);

      const [bBal, tBal, bLiq, tLiq] = await Promise.all([
        bscUsdt.balanceOf(account),
        taaqoUsdt.balanceOf(account),
        bscVaultC.vaultBalance(),
        taaqoVaultC.vaultBalance(),
      ]);
      setBscBal(bBal);
      setTaaqoBal(tBal);
      setVaultLiq({ bsc: bLiq, taaqo: tLiq });

      if (isOwner) {
        const tr = async (fn, fb) => {
          try { return await fn(); } catch { return fb; }
        };
        const DEF_MIN = ethers.parseUnits("1", 18);
        const DEF_MAX = ethers.parseUnits("100000", 18);
        const [
          bFeeBps, bMin, bMax, bPaused, bRelayer, bFeeRecip,
          tFeeBps, tMin, tMax, tPaused, tRelayer, tFeeRecip,
        ] = await Promise.all([
          tr(() => bscVaultC.feeBps(),       10n),
          tr(() => bscVaultC.minDeposit(),   DEF_MIN),
          tr(() => bscVaultC.maxDeposit(),   DEF_MAX),
          tr(() => bscVaultC.paused(),       false),
          tr(() => bscVaultC.relayer(),      ""),
          tr(() => bscVaultC.feeRecipient(), ""),
          tr(() => taaqoVaultC.feeBps(),       10n),
          tr(() => taaqoVaultC.minDeposit(),   DEF_MIN),
          tr(() => taaqoVaultC.maxDeposit(),   DEF_MAX),
          tr(() => taaqoVaultC.paused(),       false),
          tr(() => taaqoVaultC.relayer(),      ""),
          tr(() => taaqoVaultC.feeRecipient(), ""),
        ]);
        setVaultSettings({
          bsc:   { feeBps: bFeeBps, minDeposit: bMin, maxDeposit: bMax, paused: bPaused, relayer: bRelayer, feeRecipient: bFeeRecip },
          taaqo: { feeBps: tFeeBps, minDeposit: tMin, maxDeposit: tMax, paused: tPaused, relayer: tRelayer, feeRecipient: tFeeRecip },
        });

        // Relayer native gas balances (BNB on BSC, TAAQO on TAAQO chain)
        const [bRelBal, tRelBal] = await Promise.all([
          bRelayer ? bscProv.getBalance(bRelayer).catch(() => 0n)   : Promise.resolve(0n),
          tRelayer ? taaqoProv.getBalance(tRelayer).catch(() => 0n) : Promise.resolve(0n),
        ]);
        setRelayerBal({ bsc: bRelBal, taaqo: tRelBal });
      }

      if (account && onRightChain) {
        const signer   = new ethers.BrowserProvider(window.ethereum);
        const usdtAddr = isBscToTaaqo ? BSC_USDT : TAAQO_USDT;
        const vault    = isBscToTaaqo ? BSC_VAULT : TAAQO_VAULT;
        const usdt     = new ethers.Contract(usdtAddr, ERC20_ABI, signer);
        const allow    = await usdt.allowance(account, vault);
        setAllowance(allow);
      }
    } catch (e) { console.error(e); }
  }, [account, onRightChain, isBscToTaaqo, isOwner]);

  useEffect(() => { refreshBalances(); }, [refreshBalances]);

  // -- Approve ---------------------------------------------------------------
  const doApprove = async (amountWei) => {
    const provider  = new ethers.BrowserProvider(window.ethereum);
    const signer    = await provider.getSigner();
    const usdtAddr  = isBscToTaaqo ? BSC_USDT  : TAAQO_USDT;
    const vaultAddr = isBscToTaaqo ? BSC_VAULT : TAAQO_VAULT;
    const usdt = new ethers.Contract(usdtAddr, ERC20_ABI, signer);
    setStage("approving");
    toast.loading("Approving USDT…", { id: "bridge" });
    const tx = await usdt.approve(vaultAddr, amountWei);
    await tx.wait();
    toast.success("Approved", { id: "bridge" });
    setAllowance(amountWei);
  };

  // -- Deposit ---------------------------------------------------------------
  const doDeposit = async (amountWei) => {
    const provider  = new ethers.BrowserProvider(window.ethereum);
    const signer    = await provider.getSigner();
    const vaultAddr = isBscToTaaqo ? BSC_VAULT : TAAQO_VAULT;
    const vault = new ethers.Contract(vaultAddr, VAULT_ABI, signer);
    setStage("depositing");
    toast.loading("Sending deposit…", { id: "bridge" });
    const tx = await vault.deposit(amountWei, account);
    setTxHash(tx.hash);
    await tx.wait();
    toast.success("Deposit confirmed", { id: "bridge" });
    setStage("waitingRelayer");
    toast.loading("Waiting for relayer…", { id: "bridge" });

    const destProv  = new ethers.JsonRpcProvider(isBscToTaaqo ? TAAQO_RPC : BSC_RPC);
    const destUsdt  = isBscToTaaqo ? TAAQO_USDT : BSC_USDT;
    const destToken = new ethers.Contract(destUsdt, ERC20_ABI, destProv);
    const startBal  = isBscToTaaqo ? taaqoBal : bscBal;
    const deadline  = Date.now() + 5 * 60 * 1000;
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 5000));
      const bal = await destToken.balanceOf(account);
      if (bal > startBal) {
        if (isBscToTaaqo) setTaaqoBal(bal); else setBscBal(bal);
        toast.success("USDT received on " + (isBscToTaaqo ? "TAAQO" : "BSC") + "!", { id: "bridge" });
        setStage("done");
        await refreshBalances();
        return;
      }
    }
    toast.error("Timeout — funds safe, contact support", { id: "bridge" });
    setStage("idle");
  };

  // -- Main handler ----------------------------------------------------------
  const handleBridge = async () => {
    if (!account)      { connect(); return; }
    if (!onRightChain) { switchChain(isBscToTaaqo ? BSC_CHAIN_PARAMS : TAAQO_CHAIN_PARAMS); return; }
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) { toast.error("Enter a valid amount"); return; }
    let amountWei;
    try { amountWei = ethers.parseUnits(amount, 18); } catch { toast.error("Invalid amount"); return; }
    if (amountWei < MIN_DEPOSIT)   { toast.error("Minimum 1 USDT"); return; }
    if (amountWei > fromBalance)   { toast.error("Insufficient balance"); return; }
    const destLiq = isBscToTaaqo ? vaultLiq.taaqo : vaultLiq.bsc;
    if (netAmount > destLiq)       { toast.error("Insufficient vault liquidity on destination"); return; }
    setShowSuccessBanner(false);
    try {
      if (allowance < amountWei) await doApprove(amountWei);
      await doDeposit(amountWei);
      setAmount("");
    } catch (e) {
      toast.error(e?.shortMessage ?? e?.message ?? "Transaction failed", { id: "bridge" });
      setStage("idle");
    }
  };

  // -- Flip direction --------------------------------------------------------
  const flip = () => {
    if (busy) return;
    setDirection(d => d === "bsc-to-taaqo" ? "taaqo-to-bsc" : "bsc-to-taaqo");
    setAmount(""); setStage("idle"); setTxHash(""); setAllowance(0n); setShowSuccessBanner(false);
  };

  // -- Helpers ---------------------------------------------------------------
  const fmt = (wei, places = 4) =>
    parseFloat(ethers.formatUnits(wei, 18)).toLocaleString(undefined, { maximumFractionDigits: places });

  const amountWei    = (() => { try { return ethers.parseUnits(amount || "0", 18); } catch { return 0n; } })();
  const needsApprove = account && onRightChain && amountWei > 0n && allowance < amountWei;
  const hasAmount    = amount && parseFloat(amount) > 0;
  const explorerFrom = isBscToTaaqo ? "https://bscscan.com/tx/"      : "https://taaqoscan.com/tx/";
  const explorerTo   = isBscToTaaqo ? "https://taaqoscan.com/address/" : "https://bscscan.com/address/";

  const btnLabel = () => {
    if (!account)                   return "Connect Wallet";
    if (!onRightChain)              return `Switch to ${isBscToTaaqo ? "BNB Chain" : "TAAQO"}`;
    if (stage === "approving")      return "Approving…";
    if (stage === "depositing")     return "Depositing…";
    if (stage === "waitingRelayer") return "Waiting for Relayer…";
    if (needsApprove)               return "Approve & Bridge";
    return `Bridge USDT → ${isBscToTaaqo ? "TAAQO" : "BSC"}`;
  };

  const steps = [
    { n: 1, label: `Switch to ${isBscToTaaqo ? "BNB Chain" : "TAAQO"}`, done: onRightChain,                                   active: !onRightChain },
    { n: 2, label: "Approve USDT",                                        done: !needsApprove && stage !== "idle",              active: stage === "approving" },
    { n: 3, label: "Deposit",                                             done: stage === "waitingRelayer" || stage === "done", active: stage === "depositing" },
    { n: 4, label: "Relayer delivers",                                    done: stage === "done",                               active: stage === "waitingRelayer" },
  ];

  const belowMin = !!amount && (() => {
    try { const w = ethers.parseUnits(amount, 18); return w > 0n && w < MIN_DEPOSIT; }
    catch { return false; }
  })();

  /* ----------------------------------------------------------------------
     RENDER
  ---------------------------------------------------------------------- */
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen text-slate-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,900&family=JetBrains+Mono:wght@400;600&display=swap');
        .mono { font-family: 'JetBrains Mono', monospace; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      {/* -- Background -- */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0f]">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 15% 15%, rgba(45,212,191,0.07) 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(45,212,191,0.04) 0%, transparent 50%)" }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ubGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2dd4bf" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ubGrid)" />
        </svg>
        <FloatingSparks />
      </div>

      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }
      }} />

      {/* -- Header -- */}
      <header className="flex items-center justify-between px-6 py-4 relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center text-[11px] font-black text-white shadow-[0_4px_14px_rgba(45,212,191,0.35)]">T</div>
          <span className="font-bold text-sm tracking-wide text-slate-100">TAAQO Bridge</span>
        </div>

        {/* Wallet indicator - glows + shows step when busy */}
        {account ? (
          <motion.div
            animate={busy ? {
              boxShadow: [
                "0 0 0 0 rgba(45,212,191,0.25)",
                "0 0 0 8px rgba(45,212,191,0)",
                "0 0 0 0 rgba(45,212,191,0.25)",
              ]
            } : {}}
            transition={{ duration: 1.6, repeat: busy ? Infinity : 0 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl border bg-[#14141B] transition-all ${
              busy ? "border-teal-500/40" : "border-white/10"
            }`}
          >
            {isOwner && !busy && (
              <div className="flex items-center gap-1 mr-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                <Crown size={9} className="text-amber-500" />
                <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider">Admin</span>
              </div>
            )}
            {busy
              ? <Loader2 size={10} className="text-teal-300 animate-spin shrink-0" />
              : <div className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${onRightChain ? "bg-emerald-400" : "bg-amber-400"}`} />
            }
            <div>
              <span className="mono text-xs text-slate-200">{account.slice(0, 6)}…{account.slice(-4)}</span>
              {busy && (
                <p className="text-[9px] text-teal-300 font-semibold leading-tight mt-0.5">{btnLabel()}</p>
              )}
            </div>
            {ownerLoading && <Loader2 size={10} className="animate-spin text-slate-500 shrink-0" />}
          </motion.div>
        ) : (
          <button type="button" onClick={connect} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-[0_4px_14px_rgba(0,0,0,0.2)]">
            <Wallet size={12} /> Connect
          </button>
        )}
      </header>

      {/* -- Hero -- */}
      <div className="text-center pt-6 pb-8 px-4 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-3"
          style={{ background: "linear-gradient(135deg, #0f766e 0%, #2dd4bf 50%, #14b8a6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          Cross-Chain swap
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="text-sm text-slate-400 font-medium"
        >
          Transfer USDT between BNB Chain and TAAQO · 0.10% fee · ~30 seconds
        </motion.p>
      </div>

      {/* -- Main card -- */}
      <main className="max-w-[480px] mx-auto px-4 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#14141B] rounded-[1.5rem] border border-white/10 shadow-[0_20px_60px_-15px_rgba(45,212,191,0.12)] overflow-hidden"
        >
          <div className="p-5 sm:p-6 space-y-4">

            {/* Connected wallet row - interactive during tx */}
            {account && (
              <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-all ${
                busy ? "bg-teal-500/10 border-teal-500/30" : "bg-white/[0.03] border-white/10"
              }`}>
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={busy ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 1, repeat: busy ? Infinity : 0 }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black text-white shrink-0 bg-gradient-to-br ${
                      busy ? "from-teal-400 to-teal-600" : "from-teal-400 to-teal-700"
                    }`}
                  >
                    {busy ? <Loader2 size={14} className="animate-spin" /> : account.slice(2, 4).toUpperCase()}
                  </motion.div>
                  <div>
                    <p className="mono text-[12px] font-semibold text-slate-200">
                      {account.slice(0, 6)}…{account.slice(-4)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-[11px] text-slate-500">
                        {onRightChain ? (isBscToTaaqo ? "BNB Smart Chain" : "TAAQO Network") : "Wrong Network"}
                      </p>
                      {busy && (
                        <p className="text-[11px] text-teal-300 font-semibold">· {btnLabel()}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  busy ? "bg-teal-400" : onRightChain ? "bg-emerald-400" : "bg-amber-400"
                }`} />
              </div>
            )}

            {/* Direction tabs */}
            <div className="bg-white/[0.06] rounded-2xl p-1 flex gap-1">
              {["bsc-to-taaqo", "taaqo-to-bsc"].map(d => (
                <button type="button"
                  key={d}
                  onClick={() => { if (!busy) { setDirection(d); setAmount(""); setStage("idle"); setTxHash(""); setAllowance(0n); setShowSuccessBanner(false); } }}
                  className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold transition-all uppercase tracking-wider ${
                    direction === d
                      ? "bg-teal-500 text-white shadow-[0_4px_14px_rgba(45,212,191,0.3)]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {d === "bsc-to-taaqo" ? "BSC → TAAQO" : "TAAQO → BSC"}
                </button>
              ))}
            </div>

            {/* Coming Soon - TAAQO -> BSC */}
            <AnimatePresence>
              {!isBscToTaaqo && (
                <motion.div
                  key="coming-soon"
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                  className="py-10 flex flex-col items-center gap-4 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/10 to-teal-500/10 border border-teal-500/30 flex items-center justify-center shadow-inner">
                    <Clock size={28} className="text-teal-300" />
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-slate-100 tracking-tight">Coming Soon</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FROM box + rest of bridge form - hidden when Coming Soon */}
            {isBscToTaaqo && (<>

            {/* FROM box */}
            <div className="bg-[#14141B] border border-white/10 rounded-[1.25rem] p-4 focus-within:border-teal-400 focus-within:ring-[3px] focus-within:ring-teal-500/15 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">From</span>
                <div className="flex items-center gap-2">
                  <ChainBadge chain={fromChain} size="sm" />
                  <div className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center text-[7px] font-black text-white">$</div>
                    USDT
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <input
                  ref={inputRef}
                  type="number"
                  placeholder="0.00"
                  disabled={busy}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="mono flex-1 bg-transparent text-3xl font-bold text-slate-100 outline-none placeholder:text-slate-700 disabled:opacity-50 w-0"
                />
                <button type="button"
                  onClick={() => account && setAmount(ethers.formatUnits(fromBalance, 18))}
                  className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 border border-teal-500/30 px-2.5 py-1 rounded-lg hover:bg-teal-500/20 transition-colors"
                >MAX</button>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-slate-500">
                  Balance: <span className="mono text-slate-300">{fmt(fromBalance, 2)} USDT</span>
                </span>
                {hasAmount && (
                  <span className="text-[11px] text-slate-500">Fee: <span className="mono text-red-400">−{fmt(fee, 6)}</span></span>
                )}
              </div>

              {/* Min $1 warning */}
              {belowMin && (
                <p className="text-[10px] font-semibold text-red-400 mt-2">Minimum deposit is $1 USDT</p>
              )}
            </div>

            {/* Flip button */}
            <div className="flex justify-center -my-1 relative z-10">
              <motion.button
                type="button"
                onClick={flip}
                whileTap={{ scale: 0.92, rotate: 180 }}
                whileHover={{ scale: 1.08 }}
                disabled={busy}
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-300 to-teal-500 flex items-center justify-center text-white shadow-[0_4px_14px_rgba(45,212,191,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUpDown size={14} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* TO box */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[1.25rem] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">To</span>
                <div className="flex items-center gap-2">
                  <ChainBadge chain={toChain} size="sm" />
                  <div className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold bg-teal-500/10 text-teal-200 border border-teal-500/30">
                    <div className="w-3 h-3 rounded-full bg-teal-500 flex items-center justify-center text-[7px] font-black text-white">$</div>
                    USDT
                  </div>
                </div>
              </div>
              <div className="mono text-3xl font-bold tracking-tight mt-2">
                <span className={hasAmount ? "text-slate-100" : "text-slate-700"}>
                  {hasAmount ? fmt(netAmount, 4) : "0.00"}
                </span>
                <span className="text-sm font-normal text-slate-500 ml-2">USDT</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-slate-500">
                  Balance: <span className="mono text-slate-300">{fmt(toBalance, 2)} USDT</span>
                </span>
              </div>
            </div>

            {/* Fee breakdown */}
            <AnimatePresence>
              {hasAmount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-2.5">
                    {[
                      { label: "You send",    val: `${parseFloat(amount).toLocaleString()} USDT`, color: "text-slate-200" },
                      { label: "Fee (0.10%)", val: `−${fmt(fee, 6)} USDT`,                        color: "text-red-400" },
                      { label: "You receive", val: `${fmt(netAmount, 4)} USDT`,                    color: "text-emerald-600" },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-400">{r.label}</span>
                        <span className={`mono text-[11px] font-semibold ${r.color}`}>{r.val}</span>
                      </div>
                    ))}
                    <div className="h-px bg-white/10" />
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-400">Est. time</span>
                      <span className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />~30 seconds
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
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Progress</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {steps.map((s, i) => (
                        <div key={s.n} className="flex items-center gap-1.5">
                          <StepDot n={s.n} active={s.active} done={s.done} />
                          <span className={`text-[9px] sm:text-[11px] font-semibold hidden sm:inline-block ${s.done ? "text-emerald-600" : s.active ? "text-teal-200" : "text-slate-500"}`}>
                            {s.label}
                          </span>
                          {i < steps.length - 1 && <span className="text-slate-600 mx-0.5">›</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA button */}
            <motion.button
              type="button"
              onClick={handleBridge}
              disabled={busy}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                !account
                  ? "bg-teal-500 hover:bg-teal-600 text-white shadow-[0_4px_14px_rgba(0,0,0,0.2)]"
                  : !onRightChain
                  ? "bg-amber-500 hover:bg-amber-400 text-white shadow-[0_4px_14px_rgba(245,158,11,0.35)]"
                  : "bg-teal-500 hover:bg-teal-600 text-white shadow-[0_4px_14px_rgba(45,212,191,0.35)] hover:shadow-[0_6px_18px_rgba(45,212,191,0.45)]"
              }`}
            >
              {busy
                ? <><Loader2 size={14} className="animate-spin" />{btnLabel()}</>
                : !account
                ? <><Wallet size={14} />{btnLabel()}</>
                : btnLabel()
              }
            </motion.button>

            {/* Done state - auto-dismisses after 3 s */}
            <AnimatePresence>
              {stage === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-2xl p-4 border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3"
                >
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1.5">
                    <p className="text-sm font-semibold text-emerald-200">Transfer complete!</p>
                    <p className="text-[11px] text-emerald-300/70">
                      USDT arrived on {isBscToTaaqo ? "TAAQO" : "BSC"} · New balance:{" "}
                      <span className="mono">{fmt(isBscToTaaqo ? taaqoBal : bscBal, 4)} USDT</span>
                    </p>
                    {txHash && (
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        <CopyableLink
                          value={txHash}
                          display="Source TX"
                          href={`${explorerFrom}${txHash}`}
                          className="text-[10px] font-bold uppercase tracking-wider text-emerald-600"
                        />
                        <CopyableLink
                          value={account}
                          display={`View on ${isBscToTaaqo ? "TAAQO" : "BSC"}`}
                          href={`${explorerTo}${account}`}
                          className="text-[10px] font-bold uppercase tracking-wider text-emerald-600"
                        />
                      </div>
                    )}
                    <p className="text-[9px] text-emerald-300/60 italic">Closing in 3 s…</p>
                  </div>
                  <button type="button" onClick={() => { setStage("idle"); setTxHash(""); setShowSuccessBanner(false); }} className="text-slate-500 hover:text-slate-300 shrink-0">
                    <X size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            </>)}

            {/* Import USDT tokens */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 shrink-0">Add USDT</span>
              <div className="flex gap-2 flex-1">
                {[
                  { label: "BSC",   address: BSC_USDT,   chain: "BNB Chain" },
                  { label: "TAAQO", address: TAAQO_USDT, chain: "TAAQO" },
                ].map(t => (
                  <button type="button"
                    key={t.label}
                    onClick={async () => {
                      if (!window.ethereum) { toast.error("MetaMask not detected"); return; }
                      try {
                        await window.ethereum.request({
                          method: "wallet_watchAsset",
                          params: {
                            type: "ERC20",
                            options: { address: t.address, symbol: "USDT", decimals: 18 },
                          },
                        });
                      } catch (e) { toast.error(e?.message ?? "Failed to add token"); }
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-[#14141B] hover:border-teal-500/40 text-[10px] font-bold text-slate-400 hover:text-teal-300 transition-all"
                  >
                    <Plus size={9} />
                    {t.label} USDT
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2">
              <Info size={11} className="text-slate-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Non-custodial · 0.10% bridge fee · Relayer processes after chain confirmation ·{" "}
                <CopyableLink
                  value={isBscToTaaqo ? BSC_VAULT : TAAQO_VAULT}
                  display={`${(isBscToTaaqo ? BSC_VAULT : TAAQO_VAULT).slice(0,6)}…${(isBscToTaaqo ? BSC_VAULT : TAAQO_VAULT).slice(-4)}`}
                  href={`${isBscToTaaqo ? "https://bscscan.com/address/" : "https://taaqoscan.com/address/"}${isBscToTaaqo ? BSC_VAULT : TAAQO_VAULT}`}
                  className="mono text-[10px] text-slate-500"
                />
              </p>
            </div>
          </div>
        </motion.div>

        {/* -- Stats row - OWNER ONLY -- */}
        {isOwner && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Fee",         val: "0.10%",                       color: "text-red-400" },
              { label: "BSC Vault",   val: `$${fmt(vaultLiq.bsc,   0)}`, color: "text-amber-500" },
              { label: "TAAQO Vault", val: `$${fmt(vaultLiq.taaqo, 0)}`, color: "text-teal-300" },
            ].map(s => (
              <div key={s.label} className="text-center bg-[#14141B]/80 border border-white/10 rounded-xl p-3 shadow-sm">
                <p className={`mono text-sm font-bold ${s.color}`}>{s.val}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* -- Admin Panel - OWNER ONLY -- */}
        <AnimatePresence>
          {isOwner && (
            <AdminPanel
                vaultLiq={vaultLiq}
                relayerBal={relayerBal}
                settings={vaultSettings}
                account={account}
                chainId={chainId}
                switchChain={switchChain}
                onRefresh={refreshBalances}
                fmt={fmt}
              />
          )}
        </AnimatePresence>

        {/* Refresh / Success banner */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {showSuccessBanner ? (
              <motion.div
                key="success-banner"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-3"
              >
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-emerald-200">
                    Transfer complete · USDT on {successIsBsc ? "TAAQO" : "BSC"}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                    {successTxHash && (
                      <CopyableLink
                        value={successTxHash}
                        display="Source TX"
                        href={`${successIsBsc ? "https://bscscan.com/tx/" : "https://taaqoscan.com/tx/"}${successTxHash}`}
                        className="text-[10px] font-bold uppercase tracking-wider text-emerald-600"
                      />
                    )}
                    {account && (
                      <a
                        href={`${successIsBsc ? "https://taaqoscan.com/address/" : "https://bscscan.com/address/"}${account}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-200"
                      >
                        View on {successIsBsc ? "TAAQO" : "BSC"} <ExternalLink size={8} />
                      </a>
                    )}
                  </div>
                </div>
                <button type="button"
                  onClick={() => { refreshBalances(); setShowSuccessBanner(false); }}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 bg-[#14141B] border border-emerald-500/30 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-xl transition-colors shrink-0"
                >
                  <RefreshCw size={9} /> Refresh
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="refresh-btn"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <button type="button" onClick={refreshBalances} className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors">
                  <RefreshCw size={10} /> Refresh balances
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default UsdtBridge;
