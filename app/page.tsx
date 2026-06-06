"use client"

import {
  motion,
  useScroll,
  useMotionValue,
  useSpring,
  useInView,
  useMotionValueEvent,
  useTransform,
} from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Mail, ExternalLink, ArrowRight } from "lucide-react"
import { SiGithub, SiPython, SiNumpy, SiPostgresql, SiGit, SiJupyter } from "react-icons/si"
import Link from "next/link"
import Nav from "@/components/nav"

const LinkedInIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "105%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-32px" }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(mx, { stiffness: 140, damping: 18 })
  const ry = useSpring(my, { stiffness: 140, damping: 18 })
  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        mx.set(((e.clientY - r.top) / r.height - 0.5) * 4)
        my.set(((e.clientX - r.left) / r.width - 0.5) * -4)
      }}
      onMouseLeave={() => { mx.set(0); my.set(0) }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SpotlightCard({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const [pos, setPos] = useState({ x: 0, y: 0, on: false })
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top, on: true })
      }}
      onMouseLeave={() => setPos((p) => ({ ...p, on: false }))}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: pos.on ? 1 : 0,
          background: `radial-gradient(240px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.04), transparent 70%)`,
        }}
      />
      {children}
    </div>
  )
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const tick = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 1400, 1)
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * to))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, to])
  return <span ref={ref}>{val}{suffix}</span>
}

// ─── Hero Tech Graph ──────────────────────────────────────────────────────────
function HeroTechGraph() {
  type Anchor = "start" | "middle" | "end"
  const nodes: Array<{ id: string; label: string; x: number; y: number; lx: number; ly: number; anchor: Anchor }> = [
    { id: "python",     label: "Python",     x: 80,  y: 100, lx: 56,  ly: 103, anchor: "end"    },
    { id: "fastapi",    label: "FastAPI",    x: 200, y: 50,  lx: 200, ly: 30,  anchor: "middle" },
    { id: "react",      label: "React",      x: 320, y: 100, lx: 344, ly: 103, anchor: "start"  },
    { id: "postgresql", label: "PostgreSQL", x: 320, y: 215, lx: 344, ly: 218, anchor: "start"  },
    { id: "cloudflare", label: "Cloudflare", x: 200, y: 268, lx: 200, ly: 288, anchor: "middle" },
    { id: "openai",     label: "OpenAI",     x: 80,  y: 215, lx: 56,  ly: 218, anchor: "end"    },
  ]

  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
    [0, 3], [1, 4], [2, 5],
  ]

  const particleEdges = [0, 2, 4, 7]
  const particleSpeeds = [2.6, 3.0, 2.2, 3.8]
  const particleDelays = [0, 1.2, 2.2, 0.6]

  const getLen = (ai: number, bi: number) => {
    const a = nodes[ai], b = nodes[bi]
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
  }

  return (
    <div className="w-full rounded-xl overflow-hidden" style={{ border: "1px solid #1c1d22", background: "#050508" }}>
      <div className="px-5 py-3.5" style={{ borderBottom: "1px solid #111116", background: "#060609" }}>
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: "#444" }}>
          Tech Stack
        </span>
      </div>
      <div className="px-4 pt-4 pb-5">
        <svg viewBox="0 0 400 310" className="w-full" style={{ display: "block" }}>

          {/* Static base edges */}
          {edges.map(([ai, bi], i) => {
            const a = nodes[ai], b = nodes[bi]
            return <line key={`base-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#111113" strokeWidth="1" />
          })}

          {/* Pulsing edge overlays */}
          {edges.map(([ai, bi], i) => {
            const a = nodes[ai], b = nodes[bi]
            return (
              <motion.line key={`pulse-${i}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="#242428" strokeWidth="1"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2.5 + i * 0.38, repeat: Infinity, ease: "easeInOut", delay: i * 0.28 }}
              />
            )
          })}

          {/* Traveling amber particles via strokeDashoffset */}
          {particleEdges.map((ei, i) => {
            const [ai, bi] = edges[ei]
            const a = nodes[ai], b = nodes[bi]
            const len = getLen(ai, bi)
            return (
              <motion.line key={`particle-${i}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="#cc9166" strokeWidth="2" strokeLinecap="round"
                strokeDasharray={`4 ${len}`}
                style={{ opacity: 0.65 }}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -(len + 4) }}
                transition={{
                  duration: particleSpeeds[i],
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                  delay: particleDelays[i],
                  repeatDelay: 0.3,
                }}
              />
            )
          })}

          {/* Node glow rings */}
          {nodes.map((n, i) => (
            <motion.circle key={`glow-${n.id}`}
              cx={n.x} cy={n.y} r={20}
              fill="none" stroke="#cc9166" strokeWidth="0.8"
              animate={{ opacity: [0, 0.14, 0] }}
              transition={{ duration: 3.2 + i * 0.55, repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }}
            />
          ))}

          {/* Node circles */}
          {nodes.map((n, i) => (
            <motion.circle key={`node-${n.id}`}
              cx={n.x} cy={n.y} r={13}
              fill="#060608" stroke="#1e1e22" strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
            />
          ))}

          {/* Labels */}
          {nodes.map((n, i) => (
            <motion.g key={`label-${n.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
            >
              <text x={n.lx} y={n.ly} textAnchor={n.anchor} fontSize="8" fontFamily="monospace" fill="#444">
                {n.label}
              </text>
            </motion.g>
          ))}

        </svg>
      </div>
    </div>
  )
}

// ─── Window Chrome ────────────────────────────────────────────────────────────
function WindowChrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #1c1d22", background: "#050505" }}>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
      </div>
      <span className="font-mono text-[9px] mx-auto" style={{ color: "#444" }}>{title}</span>
    </div>
  )
}

// ─── Product Mockups ──────────────────────────────────────────────────────────
function BusinessAnalyzerMockup() {
  const bars = [
    { label: "Oct", rev: 62, pred: 68 }, { label: "Nov", rev: 74, pred: 71 },
    { label: "Dec", rev: 58, pred: 65 }, { label: "Jan", rev: 81, pred: 78 },
    { label: "Feb", rev: 69, pred: 75 }, { label: "Mar", rev: 94, pred: 88 },
    { label: "Apr", rev: 87, pred: 90 },
  ]
  return (
    <div className="flex flex-col h-full" style={{ background: "#000" }}>
      <WindowChrome title="business-analyzer.pages.dev" />
      <div className="flex items-center gap-5 px-4 py-2.5 flex-shrink-0" style={{ borderBottom: "1px solid #1c1d22", background: "#050505" }}>
        <span className="font-mono text-[10px] font-bold" style={{ color: "#ededed", letterSpacing: "0.12em" }}>BA</span>
        {["Dashboard", "Analysis", "Reports"].map((item, i) => (
          <span key={item} className="font-mono text-[9px]" style={{ color: i === 0 ? "#ededed" : "#2a2a2a" }}>{item}</span>
        ))}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-shrink-0 w-[110px] flex flex-col gap-0.5 py-3 px-2" style={{ borderRight: "1px solid #1c1d22", background: "#030303" }}>
          {[["Overview", true], ["Revenue", false], ["Customers", false], ["Predictions", false], ["Settings", false]].map(([label, active]) => (
            <div key={label as string} className="px-2.5 py-1.5 rounded-[3px]" style={{ background: active ? "#0f0f0f" : "transparent" }}>
              <span className="font-mono text-[9px]" style={{ color: active ? "#ededed" : "#2a2a2a" }}>{label as string}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="grid grid-cols-3 flex-shrink-0" style={{ borderBottom: "1px solid #1c1d22" }}>
            {[
              { label: "Revenue", value: "$84.2k", delta: "+12.4%" },
              { label: "Customers", value: "1,284", delta: "+8.1%" },
              { label: "Accuracy", value: "94.2%", delta: "+2.1%" },
            ].map((k, i) => (
              <motion.div key={k.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.08 }}
                className="px-3 py-3" style={{ borderRight: i < 2 ? "1px solid #1c1d22" : "none" }}>
                <p className="font-mono text-[8px] tracking-widest uppercase mb-1" style={{ color: "#333" }}>{k.label}</p>
                <p className="text-[15px] font-semibold leading-none mb-1" style={{ color: "#ededed" }}>{k.value}</p>
                <p className="font-mono text-[8px]" style={{ color: "#22c55e" }}>{k.delta}</p>
              </motion.div>
            ))}
          </div>
          <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #1c1d22" }}>
            <p className="font-mono text-[8px] tracking-widest uppercase mb-2.5" style={{ color: "#333" }}>Revenue vs Prediction</p>
            <div className="flex items-end gap-1" style={{ height: 72 }}>
              {bars.map((b, i) => (
                <div key={i} className="flex-1 flex gap-px items-end h-full">
                  <motion.div className="flex-1 rounded-[1px]" style={{ background: "#ededed", opacity: 0.12 }}
                    initial={{ height: "0%" }} animate={{ height: `${b.rev}%` }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: [0.34, 1.1, 0.64, 1] }} />
                  <motion.div className="flex-1 rounded-[1px]" style={{ background: "#cc9166", opacity: 0.5 }}
                    initial={{ height: "0%" }} animate={{ height: `${b.pred}%` }}
                    transition={{ delay: 0.5 + i * 0.06, duration: 0.5, ease: [0.34, 1.1, 0.64, 1] }} />
                </div>
              ))}
            </div>
            <div className="flex gap-1 mt-1">
              {bars.map(b => (
                <span key={b.label} className="flex-1 font-mono text-[7px] text-center" style={{ color: "#222" }}>{b.label}</span>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="px-3 py-1.5 flex gap-2" style={{ borderBottom: "1px solid #0a0a0a" }}>
              {["Company", "Predicted", "Actual", "Acc."].map(h => (
                <span key={h} className="font-mono text-[7px] flex-1" style={{ color: "#222" }}>{h}</span>
              ))}
            </div>
            {[
              ["Acme Corp", "$12,400", "$11,890", "96%"],
              ["TechFlow Ltd", "$8,200", "$8,450", "97%"],
              ["Bright Solutions", "$15,600", "$14,200", "91%"],
            ].map((row, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.1 }}
                className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "1px solid #0a0a0a" }}>
                {row.map((cell, j) => (
                  <span key={j} className="font-mono text-[8px] flex-1" style={{ color: j === 0 ? "#555" : j === 3 ? "#22c55e" : "#333" }}>{cell}</span>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CSVAnalyzerMockup() {
  const cols = [
    { name: "user_id", type: "INTEGER", unique: "1,247", nullPct: "0.0%", barW: 95, note: "Unique per row" },
    { name: "category", type: "OBJECT", unique: "5", nullPct: "1.2%", barW: 42, note: "Top: Electronics (42%)" },
    { name: "revenue", type: "FLOAT", unique: "890", nullPct: "0.4%", barW: 72, note: "$12 – $4,892 range" },
    { name: "date", type: "DATETIME", unique: "365", nullPct: "0.0%", barW: 88, note: "Jan – Dec 2024" },
  ]
  return (
    <div className="flex flex-col h-full" style={{ background: "#000" }}>
      <WindowChrome title="csv-analysis.pages.dev" />
      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ borderBottom: "1px solid #1c1d22", background: "#050505" }}>
        <span className="font-mono text-[10px] font-bold" style={{ color: "#ededed", letterSpacing: "0.1em" }}>CSV ANALYZER</span>
        <span className="font-mono text-[8px] px-2 py-1 rounded-[3px]" style={{ border: "1px solid #1c1d22", color: "#444" }}>↑ Upload New</span>
      </div>
      <div className="flex items-center gap-4 px-4 py-2.5 flex-shrink-0" style={{ borderBottom: "1px solid #1c1d22", background: "#030303" }}>
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#22c55e" }} />
        <span className="font-mono text-[9px]" style={{ color: "#888" }}>sales_data_q4.csv</span>
        <span className="font-mono text-[8px]" style={{ color: "#2a2a2a" }}>1,247 rows · 8 cols</span>
        <span className="font-mono text-[8px] ml-auto" style={{ color: "#2a2a2a" }}>1.2s</span>
      </div>
      <div className="flex-1 overflow-hidden p-3 grid grid-cols-2 gap-2 content-start">
        {cols.map((col, i) => (
          <motion.div key={col.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
            className="p-3 rounded-[4px]" style={{ border: "1px solid #1c1d22", background: "#030303" }}>
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-[10px] font-medium" style={{ color: "#ededed" }}>{col.name}</span>
              <span className="font-mono text-[7px] px-1.5 py-0.5 rounded-[2px]" style={{ background: "#0f0f0f", color: "#444" }}>{col.type}</span>
            </div>
            <div className="flex gap-4 mb-2">
              <div>
                <p className="font-mono text-[7px] mb-0.5" style={{ color: "#2a2a2a" }}>unique</p>
                <p className="font-mono text-[9px]" style={{ color: "#555" }}>{col.unique}</p>
              </div>
              <div>
                <p className="font-mono text-[7px] mb-0.5" style={{ color: "#2a2a2a" }}>null %</p>
                <p className="font-mono text-[9px]" style={{ color: col.nullPct === "0.0%" ? "#555" : "#cc9166" }}>{col.nullPct}</p>
              </div>
            </div>
            <div className="h-1 w-full rounded-full mb-1.5" style={{ background: "#0a0a0a" }}>
              <motion.div className="h-1 rounded-full" initial={{ width: 0 }} animate={{ width: `${col.barW}%` }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.7 }} style={{ background: "#222" }} />
            </div>
            <p className="font-mono text-[7px] truncate" style={{ color: "#2a2a2a" }}>{col.note}</p>
          </motion.div>
        ))}
      </div>
      <div className="flex-shrink-0" style={{ borderTop: "1px solid #1c1d22" }}>
        <div className="px-4 py-1.5"><p className="font-mono text-[7px] tracking-widest uppercase" style={{ color: "#1c1c1c" }}>Sample Data</p></div>
        {[["1001", "Electronics", "$1,247", "2024-03-15"], ["1002", "Clothing", "$89", "2024-03-15"], ["1003", "Electronics", "$2,840", "2024-03-16"]].map((row, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.08 }}
            className="flex px-4 py-1.5" style={{ borderTop: "1px solid #0a0a0a" }}>
            {row.map((cell, j) => (
              <span key={j} className="font-mono text-[8px] flex-1" style={{ color: j === 0 ? "#444" : "#2a2a2a" }}>{cell}</span>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function FinanceAIMockup() {
  const R = 42, C = 2 * Math.PI * R
  const categories = [
    { label: "Housing", pct: 28, color: "#ededed", amount: "$1,840" },
    { label: "Food", pct: 22, color: "#888", amount: "$1,450" },
    { label: "Shopping", pct: 19, color: "#cc9166", amount: "$1,240" },
    { label: "Transport", pct: 15, color: "#555", amount: "$988" },
    { label: "Other", pct: 16, color: "#2a2a2a", amount: "$1,052" },
  ]
  let cum = 0
  const segs = categories.map(c => {
    const dash = (c.pct / 100) * C
    const offset = (cum / 100) * C
    cum += c.pct
    return { ...c, dash, offset }
  })
  const txns = [
    { name: "Netflix", cat: "Entertainment", amount: "-$15.99", pos: false, time: "1h ago" },
    { name: "Whole Foods", cat: "Groceries", amount: "-$87.42", pos: false, time: "3h ago" },
    { name: "Payroll", cat: "Income", amount: "+$4,500", pos: true, time: "Yesterday" },
    { name: "Uber", cat: "Transport", amount: "-$12.30", pos: false, time: "Yesterday" },
  ]
  return (
    <div className="flex flex-col h-full" style={{ background: "#000" }}>
      <WindowChrome title="financial-ai.pages.dev" />
      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ borderBottom: "1px solid #1c1d22", background: "#050505" }}>
        <span className="font-mono text-[10px] font-bold" style={{ color: "#ededed", letterSpacing: "0.08em" }}>FinanceAI</span>
        <span className="font-mono text-[9px]" style={{ color: "#333" }}>Chase Checking ▾</span>
      </div>
      <div className="px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid #1c1d22" }}>
        <p className="font-mono text-[8px] tracking-widest uppercase mb-1.5" style={{ color: "#333" }}>Total Balance</p>
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-[26px] font-semibold leading-none tracking-[-0.02em] mb-1.5"
          style={{ fontFamily: "var(--font-playfair)", color: "#ededed" }}>
          $12,847.43
        </motion.p>
        <p className="font-mono text-[9px]" style={{ color: "#22c55e" }}>+$2,400.00 this month</p>
      </div>
      <div className="flex flex-shrink-0" style={{ borderBottom: "1px solid #1c1d22" }}>
        <div className="w-[108px] flex-shrink-0 flex items-center justify-center p-3" style={{ borderRight: "1px solid #1c1d22" }}>
          <svg viewBox="0 0 110 110" className="w-full h-auto">
            {segs.map((s, i) => (
              <motion.circle key={i} cx="55" cy="55" r={R} fill="none" stroke={s.color} strokeWidth="11"
                strokeDasharray={`${s.dash} ${C - s.dash}`}
                strokeDashoffset={C * 0.25 - s.offset}
                initial={{ strokeDasharray: `0 ${C}` }}
                animate={{ strokeDasharray: `${s.dash} ${C - s.dash}` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.55 }} />
            ))}
            <text x="55" y="51" textAnchor="middle" fontSize="10" fontWeight="600" fill="#ededed">$6.6k</text>
            <text x="55" y="64" textAnchor="middle" fontSize="7" fill="#444">spent</text>
          </svg>
        </div>
        <div className="flex-1 flex flex-col justify-center py-2">
          {categories.map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
              className="flex items-center gap-2 px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
              <span className="font-mono text-[8px] flex-1" style={{ color: "#444" }}>{c.label}</span>
              <span className="font-mono text-[8px]" style={{ color: "#2a2a2a" }}>{c.pct}%</span>
              <span className="font-mono text-[8px]" style={{ color: "#333" }}>{c.amount}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="px-4 py-1.5"><p className="font-mono text-[7px] tracking-widest uppercase" style={{ color: "#1c1c1c" }}>Recent Transactions</p></div>
        {txns.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.08 }}
            className="flex items-center justify-between px-4 py-2" style={{ borderTop: "1px solid #0a0a0a" }}>
            <div>
              <p className="font-mono text-[9px]" style={{ color: "#555" }}>{t.name}</p>
              <p className="font-mono text-[7px]" style={{ color: "#222" }}>{t.cat} · {t.time}</p>
            </div>
            <p className="font-mono text-[9px] font-medium" style={{ color: t.pos ? "#22c55e" : "#444" }}>{t.amount}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── About Section ───────────────────────────────────────────────────────────
function AboutSection() {
  const stack = [
    { name: "Python", Icon: SiPython },
    { name: "NumPy", Icon: SiNumpy },
    { name: "PostgreSQL", Icon: SiPostgresql },
    { name: "Git", Icon: SiGit },
    { name: "GitHub", Icon: SiGithub },
    { name: "Jupyter", Icon: SiJupyter },
  ]
  const skills = [
    { name: "Python & Data Analysis", pct: 88 },
    { name: "Machine Learning", pct: 72 },
    { name: "SQL & Databases", pct: 82 },
    { name: "Data Visualization", pct: 80 },
    { name: "React + TypeScript", pct: 70 },
    { name: "FastAPI & Backends", pct: 74 },
  ]
  const edu = [
    { title: "Computer Science Engineering", sub: "New LJ Institute of Engineering & Technology", meta: "6th Semester", year: "2022 – 2026" },
    { title: "Engineering Plus: Python & Data Science", sub: "New LJ Institute · Certified", meta: "Completed", year: "2024" },
  ]
  const interests = ["Problem Solving", "Data Analysis", "Karate · Black Belt", "Japanese", "AI & ML"]

  return (
    <section className="max-w-[1200px] mx-auto px-8 py-28">
      <div className="grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-16 lg:gap-24">

        {/* Left — bio + stack + skill bars */}
        <div>
          <FadeUp>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase mb-8" style={{ color: "#333" }}>About</p>
          </FadeUp>

          {/* Pull quote */}
          <FadeUp delay={0.04}>
            <p
              className="text-[clamp(17px,2vw,22px)] leading-[1.5] mb-7 pl-5"
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: "#ededed", borderLeft: "2px solid #cc9166" }}
            >
              I build data products that work in production.
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <p className="text-[15px] leading-[1.85] mb-12" style={{ color: "#555", maxWidth: 520 }}>
              Live tools with real users, not notebooks that live on my machine.
              My work spans the full stack: ingestion, cleaning, modeling, and user-facing analytics.
              What makes my background different is direct experience at the intersection of data and business,
              working on the Sales &amp; Marketing side, which gives me the context to understand what a metric
              needs to drive before I write the first query.
            </p>
          </FadeUp>

          {/* Tech Stack — 3-col, larger cards */}
          <FadeUp delay={0.1}>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase mb-4" style={{ color: "#333" }}>Stack</p>
            <div className="grid grid-cols-3 gap-2 mb-10">
              {stack.map(({ name, Icon }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.12 + i * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="flex flex-col items-center gap-2.5 py-5 rounded-lg cursor-default"
                  style={{ border: "1px solid #1c1d22", background: "#000" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2e2e2e" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1c1d22" }}
                >
                  <Icon className="w-6 h-6" style={{ color: "#555" }} />
                  <span className="font-mono text-[9px]" style={{ color: "#333" }}>{name}</span>
                </motion.div>
              ))}
            </div>
          </FadeUp>

          {/* Skill proficiency bars */}
          <FadeUp delay={0.14}>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase mb-5" style={{ color: "#333" }}>Proficiency</p>
            <div className="space-y-4">
              {skills.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.18 + i * 0.06 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px]" style={{ color: "#444" }}>{s.name}</span>
                    <span className="font-mono text-[9px]" style={{ color: "#2a2a2a" }}>{s.pct}%</span>
                  </div>
                  <div className="h-px w-full" style={{ background: "#0f0f0f" }}>
                    <motion.div
                      className="h-px"
                      style={{ background: "#333" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.25 + i * 0.09, ease: [0.25, 1, 0.5, 1] }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Right — education, experience, interests, resume */}
        <div className="flex flex-col gap-8">
          <FadeUp delay={0.1}>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase mb-5" style={{ color: "#555" }}>Education</p>
            <div style={{ borderTop: "1px solid #181818" }}>
              {edu.map((e, i) => (
                <motion.div key={i}
                  className="group py-5 flex items-start justify-between gap-6 cursor-default transition-all duration-200"
                  style={{ borderBottom: "1px solid #181818" }}
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium mb-1 leading-snug transition-colors duration-200 group-hover:text-white"
                      style={{ color: "#e0e0e0" }}>{e.title}</p>
                    <p className="font-mono text-[10px]" style={{ color: "#444" }}>{e.sub}</p>
                    {e.meta && (
                      <span className="inline-block font-mono text-[9px] mt-2 px-2 py-0.5"
                        style={{ color: "#cc9166", border: "1px solid rgba(204,145,102,0.2)", borderRadius: 2, background: "rgba(204,145,102,0.04)" }}>
                        {e.meta}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] flex-shrink-0 pt-0.5" style={{ color: "#444" }}>{e.year}</p>
                </motion.div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.14}>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase mb-5" style={{ color: "#555" }}>Experience</p>
            <motion.div
              className="group relative py-5 cursor-default overflow-hidden"
              style={{ borderTop: "1px solid #181818", borderBottom: "1px solid #181818" }}
              whileHover={{ x: 6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <motion.div
                className="absolute left-0 inset-y-0"
                initial={{ scaleY: 0 }}
                whileHover={{ scaleY: 1 }}
                transition={{ duration: 0.22 }}
                style={{ width: 2, background: "#cc9166", transformOrigin: "top", borderRadius: 1 }}
              />
              <div className="flex items-start justify-between gap-6 mb-3">
                <div>
                  <p className="text-[14px] font-medium mb-1 transition-colors duration-200 group-hover:text-white"
                    style={{ color: "#e0e0e0" }}>Sales &amp; Marketing Associate</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-[10px]" style={{ color: "#444" }}>2025 – Present</p>
                    <span className="font-mono text-[8px] px-1.5 py-0.5"
                      style={{ color: "#cc9166", border: "1px solid rgba(204,145,102,0.2)", borderRadius: 2, background: "rgba(204,145,102,0.04)" }}>
                      Agility
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "#555" }}>
                Analyzed customer behavior data to identify upsell opportunities and track pipeline performance, bridging technical insight with business decisions.
              </p>
            </motion.div>
          </FadeUp>

          <FadeUp delay={0.18}>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase mb-4" style={{ color: "#555" }}>Interests</p>
            <div className="flex flex-wrap gap-2">
              {interests.map(item => (
                <span key={item} className="font-mono text-[10px] px-3 py-1.5"
                  style={{ border: "1px solid #1c1d22", color: "#555", borderRadius: 3, background: "#050505" }}>
                  {item}
                </span>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.22}>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-mono font-medium transition-colors hover:bg-[#e8e8e8]"
              style={{ background: "#fff", color: "#000", borderRadius: 3 }}>
              ↓ Download Resume
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── Capability Section ───────────────────────────────────────────────────────
function CapabilitySection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const bars = [28, 45, 36, 62, 51, 78, 94]
  const months = ["O", "N", "D", "J", "F", "M", "A"]
  const BAR_H = 128

  // Neural net node positions in a 300×220 viewBox
  const inNodes  = [{ x: 36,  y: 44  }, { x: 36,  y: 110 }, { x: 36,  y: 176 }]
  const hidNodes = [{ x: 150, y: 28  }, { x: 150, y: 84  }, { x: 150, y: 136 }, { x: 150, y: 192 }]
  const outNodes = [{ x: 264, y: 76  }, { x: 264, y: 144 }]

  const stackLayers = [
    { label: "Interface",  sub: "React · TypeScript · Tailwind" },
    { label: "API Layer",  sub: "Python · FastAPI · Auth"       },
    { label: "Database",   sub: "PostgreSQL · Redis"            },
    { label: "Infra",      sub: "Cloudflare · VPS · CI/CD"      },
  ]

  return (
    <section ref={ref}>
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ minHeight: "72vh" }}>

        {/* ── Col 1: Revenue bar chart ──────────────────── */}
        <div className="flex flex-col px-10 pt-14 pb-10"
          style={{ borderRight: "1px solid #1c1d22" }}>
          <div className="flex-1 flex flex-col justify-end">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="font-mono text-[9px] tracking-widest uppercase mb-2"
                  style={{ color: "#2a2a2a" }}>Revenue YTD</p>
                <p className="text-[36px] leading-none tracking-[-0.03em]"
                  style={{ fontFamily: "var(--font-playfair)", color: "#ededed" }}>
                  $84.2k
                </p>
              </div>
              <motion.span
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="font-mono text-[10px] px-2.5 py-1 rounded-full self-end mb-0.5"
                style={{ border: "1px solid #1a3828", color: "#22c55e", background: "#0a180f" }}>
                ↑ 12.4%
              </motion.span>
            </div>
            <div className="flex items-end gap-1.5" style={{ height: BAR_H }}>
              {bars.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end" style={{ height: "100%" }}>
                  <motion.div
                    className="w-full rounded-t-[2px]"
                    style={{ background: i === bars.length - 1 ? "#ededed" : "#141414" }}
                    initial={{ height: "0px" }}
                    animate={inView ? { height: `${Math.round((h / 100) * BAR_H)}px` } : { height: "0px" }}
                    transition={{ delay: 0.12 + i * 0.08, duration: 0.7, ease: [0.34, 1.1, 0.64, 1] }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 mt-2">
              {months.map((m, i) => (
                <span key={i} className="flex-1 font-mono text-[8px] text-center"
                  style={{ color: "#2a2a2a" }}>{m}</span>
              ))}
            </div>
          </div>
          <div className="mt-10 pt-7" style={{ borderTop: "1px solid #1c1d22" }}>
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-3"
              style={{ color: "#444" }}>01</p>
            <h3 className="text-[20px] leading-snug tracking-[-0.02em] mb-2"
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, color: "#ededed" }}>
              Data Analysis
            </h3>
            <p className="text-[12px] leading-relaxed" style={{ color: "#444" }}>
              Raw inputs turned into revenue-visible decisions.
            </p>
          </div>
        </div>

        {/* ── Col 2: Neural network SVG ─────────────────── */}
        <div className="flex flex-col px-10 pt-14 pb-10"
          style={{ borderRight: "1px solid #1c1d22" }}>
          <div className="flex-1 flex items-center justify-center">
            <svg viewBox="0 0 300 220" className="w-full max-w-[260px]">
              {/* Base connections — input → hidden */}
              {inNodes.map((a, ai) =>
                hidNodes.map((b, bi) => (
                  <motion.line key={`ih-${ai}-${bi}`}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke="#141414" strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.2 + ai * 0.04 + bi * 0.02 }}
                  />
                ))
              )}
              {/* Base connections — hidden → output */}
              {hidNodes.map((a, ai) =>
                outNodes.map((b, bi) => (
                  <motion.line key={`ho-${ai}-${bi}`}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke="#141414" strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.45 + ai * 0.04 + bi * 0.02 }}
                  />
                ))
              )}
              {/* Amber highlight path through the network */}
              <motion.line x1={36} y1={110} x2={150} y2={84}
                stroke="#cc9166" strokeWidth="1.5"
                initial={{ opacity: 0 }} animate={inView ? { opacity: 0.5 } : { opacity: 0 }}
                transition={{ delay: 0.85 }} />
              <motion.line x1={150} y1={84} x2={264} y2={76}
                stroke="#cc9166" strokeWidth="1.5"
                initial={{ opacity: 0 }} animate={inView ? { opacity: 0.5 } : { opacity: 0 }}
                transition={{ delay: 0.95 }} />
              {/* Input nodes */}
              {inNodes.map((n, i) => (
                <motion.circle key={`in-${i}`} cx={n.x} cy={n.y} r={8}
                  fill="#060606" stroke="#1c1d22" strokeWidth="1.5"
                  initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                />
              ))}
              {/* Hidden nodes */}
              {hidNodes.map((n, i) => (
                <motion.circle key={`hn-${i}`} cx={n.x} cy={n.y} r={8}
                  fill="#060606" stroke="#2a2a2a" strokeWidth="1.5"
                  initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.35 + i * 0.1 }}
                />
              ))}
              {/* Output nodes — amber accent */}
              {outNodes.map((n, i) => (
                <motion.circle key={`on-${i}`} cx={n.x} cy={n.y} r={10}
                  fill="#060606" stroke="#cc9166" strokeWidth="1.5"
                  initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.72 + i * 0.15 }}
                />
              ))}
              {/* Node labels */}
              {inNodes.map((n, i) => (
                <text key={`il-${i}`} x={n.x} y={n.y + 4} textAnchor="middle"
                  fontSize="6" fill="#2a2a2a" fontFamily="monospace">x{i + 1}</text>
              ))}
              {outNodes.map((n, i) => (
                <text key={`ol-${i}`} x={n.x} y={n.y + 4} textAnchor="middle"
                  fontSize="6" fill="#cc9166" fontFamily="monospace">y{i + 1}</text>
              ))}
            </svg>
          </div>
          <div className="pt-7" style={{ borderTop: "1px solid #1c1d22" }}>
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-3"
              style={{ color: "#444" }}>02</p>
            <h3 className="text-[20px] leading-snug tracking-[-0.02em] mb-2"
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, color: "#ededed" }}>
              Machine Learning
            </h3>
            <p className="text-[12px] leading-relaxed" style={{ color: "#444" }}>
              Models trained on your data, deployed on your stack.
            </p>
          </div>
        </div>

        {/* ── Col 3: Tech stack layers ──────────────────── */}
        <div className="flex flex-col px-10 pt-14 pb-10">
          <div className="flex-1 flex flex-col justify-center gap-2.5">
            {stackLayers.map((layer, i) => (
              <motion.div key={layer.label}
                initial={{ opacity: 0, x: 18 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 }}
                transition={{ delay: 0.1 + i * 0.13, duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                className="flex items-center justify-between px-4 py-3.5 rounded-lg"
                style={{ border: "1px solid #141414", background: "#050505" }}>
                <div>
                  <p className="font-mono text-[10px] font-medium mb-0.5"
                    style={{ color: "#888" }}>{layer.label}</p>
                  <p className="font-mono text-[8px]"
                    style={{ color: "#2a2a2a" }}>{layer.sub}</p>
                </div>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#22c55e" }}
                  animate={{ opacity: [1, 0.15, 1] }}
                  transition={{ duration: 2.2 + i * 0.45, repeat: Infinity, delay: i * 0.5 }}
                />
              </motion.div>
            ))}
          </div>
          <div className="pt-7" style={{ borderTop: "1px solid #1c1d22" }}>
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-3"
              style={{ color: "#444" }}>03</p>
            <h3 className="text-[20px] leading-snug tracking-[-0.02em] mb-2"
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, color: "#ededed" }}>
              Full-Stack Build
            </h3>
            <p className="text-[12px] leading-relaxed" style={{ color: "#444" }}>
              Frontend to database. Every layer owned and shipped.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Credentials Section ──────────────────────────────────────────────────────
function CredentialsSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-8 py-28">
      <div className="mb-16">
        <Reveal>
          <h2 className="text-[clamp(36px,5vw,52px)] leading-[1] tracking-[-0.025em]"
            style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}>
            Credentials
          </h2>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Certificate */}
        <FadeUp>
          <a href="/certificate.pdf" target="_blank" rel="noopener noreferrer"
            className="group flex flex-col rounded-xl p-8 h-full transition-all duration-300"
            style={{ border: "1px solid #1c1d22", background: "#000" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2e2e2e" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1c1d22" }}>
            <div className="flex-1 flex items-center justify-center py-12 rounded-lg mb-8"
              style={{ background: "#030303", border: "1px solid #1c1d22" }}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ border: "1px solid #cc9166" }}>
                  <span className="text-[18px]" style={{ color: "#cc9166" }}>✓</span>
                </div>
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-3" style={{ color: "#333" }}>Certificate of Completion</p>
                <p className="text-[15px] font-medium" style={{ fontFamily: "var(--font-playfair)", color: "#ededed" }}>Engineering Plus</p>
                <p className="font-mono text-[9px] mt-1.5" style={{ color: "#555" }}>Python &amp; Data Science</p>
              </div>
            </div>
            <p className="text-[15px] mb-1" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: "#ededed" }}>Engineering Plus: Python &amp; Data Science</p>
            <p className="font-mono text-[10px] mb-5" style={{ color: "#444" }}>New LJ Institute of Engineering &amp; Technology · 2024</p>
            <span className="font-mono text-[10px] transition-colors group-hover:text-[#ededed]" style={{ color: "#666" }}>View Certificate ↗</span>
          </a>
        </FadeUp>

        {/* Resume */}
        <FadeUp delay={0.08}>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
            className="group flex flex-col rounded-xl p-8 h-full transition-all duration-300"
            style={{ border: "1px solid #1c1d22", background: "#000" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2e2e2e" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1c1d22" }}>
            <div className="flex-1 rounded-lg mb-8 p-6 space-y-3"
              style={{ background: "#030303", border: "1px solid #1c1d22" }}>
              <div className="space-y-2 mb-4">
                <div className="h-2.5 rounded w-2/5" style={{ background: "#1c1d22" }} />
                <div className="h-1.5 rounded w-1/3" style={{ background: "#141414" }} />
              </div>
              {[["w-[88%]","#111"], ["w-[72%]","#0d0d0d"], ["w-[80%]","#111"], ["w-[65%]","#0d0d0d"], ["w-[85%]","#111"]].map(([w, bg], i) => (
                <div key={i} className={`h-1.5 rounded ${w}`} style={{ background: bg }} />
              ))}
              <div className="pt-2 space-y-2">
                {[["w-[60%]","#0a0a0a"], ["w-[70%]","#0a0a0a"], ["w-[55%]","#0a0a0a"]].map(([w, bg], i) => (
                  <div key={i} className={`h-1.5 rounded ${w}`} style={{ background: bg }} />
                ))}
              </div>
            </div>
            <p className="text-[15px] mb-1" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: "#ededed" }}>Kanishk Pansari: Résumé</p>
            <p className="font-mono text-[10px] mb-5" style={{ color: "#444" }}>Data Analyst &amp; AI Developer · 2026</p>
            <span className="font-mono text-[10px] transition-colors group-hover:text-[#ededed]" style={{ color: "#666" }}>Download PDF ↓</span>
          </a>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const projects = [
  {
    title: "Business Analyzer",
    sub: "Predictive Financial Analysis",
    year: "2025",
    desc: "Feed in your business numbers and see exactly where you're headed. ML model compares predicted vs. actual performance to surface trends and flag risks before they compound.",
    tags: ["Python", "Machine Learning", "FastAPI", "React", "TypeScript"],
    link: "https://business-analysis-3h9.pages.dev/",
    github: "https://github.com/Kanishk1217/business-analysis",
    Mockup: BusinessAnalyzerMockup,
  },
  {
    title: "CSV Analyzer",
    sub: "Instant Data Analysis",
    year: "2024",
    desc: "Upload any CSV and get a full column-by-column breakdown in seconds. Types, distributions, null rates, correlations. No code, no setup. Just answers.",
    tags: ["Python", "Pandas", "FastAPI", "React"],
    link: "https://csv--analysis.pages.dev/",
    github: "https://github.com/Kanishk1217/csv-analysis",
    Mockup: CSVAnalyzerMockup,
  },
  {
    title: "FinanceAI",
    sub: "AI-Powered Finance Tracker",
    year: "2026",
    desc: "Connect your real bank via Plaid. Automatic transaction sync, smart budget tracking, and AI-generated spending insights. Full-stack: React + FastAPI + PostgreSQL.",
    tags: ["React", "FastAPI", "PostgreSQL", "Plaid", "TypeScript"],
    link: "https://financial-ai.pages.dev",
    github: "https://github.com/Kanishk1217/Financial_AI",
    Mockup: FinanceAIMockup,
  },
]

const services = [
  { name: "Data Intelligence Dashboard", price: "$800 – $1,500", timeline: "1–2 weeks", subject: "Project Inquiry: Data Intelligence Dashboard" },
  { name: "Custom AI Agent", price: "$1,200 – $2,500", timeline: "1–2 weeks", subject: "Project Inquiry: Custom AI Agent" },
  { name: "Full AI Product Build", price: "$3,000 – $6,000", timeline: "3–5 weeks", subject: "Project Inquiry: Full AI Product Build" },
]

const posts = [
  { slug: "building-a-business-analyzer-what-ml-taught-me-about-real-decisions", title: "Building a Business Analyzer: What ML Taught Me About Real Decisions", date: "2025-03-10" },
  { slug: "building-financeai-when-your-bank-data-becomes-actually-useful", title: "Building FinanceAI: When Your Bank Data Becomes Actually Useful", date: "2026-05-14" },
  { slug: "what-i-learned-building-a-csv-analyzer", title: "What I Learned Building a CSV Analyzer", date: "2024-11-20" },
  { slug: "what-sales-taught-me-about-data-that-no-dataset-ever-could", title: "What Sales Taught Me About Data That No Dataset Ever Could", date: "2025-06-01" },
]

const marqueeItems = [
  "Python", "FastAPI", "React", "Machine Learning",
  "PostgreSQL", "TypeScript", "Data Analysis", "AI Development",
]

// ─── Work Section (scroll-scrubbed) ──────────────────────────────────────────
function WorkSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })

  // Each opacity/y value is a direct function of scrollYProgress — no state transitions.
  // Crossfade zone is the 0.25–0.38 and 0.62–0.75 bands. Pausing mid-scroll = visual pauses.
  const op0 = useTransform(scrollYProgress, [0, 0.25, 0.38, 1],       [1, 1, 0, 0])
  const op1 = useTransform(scrollYProgress, [0, 0.25, 0.38, 0.62, 0.75, 1], [0, 0, 1, 1, 0, 0])
  const op2 = useTransform(scrollYProgress, [0, 0.62, 0.75, 1],       [0, 0, 1, 1])

  const y0 = useTransform(scrollYProgress, [0, 0.25, 0.38, 1],       [0, 0, -20, -20])
  const y1 = useTransform(scrollYProgress, [0, 0.25, 0.38, 0.62, 0.75, 1], [20, 20, 0, 0, -20, -20])
  const y2 = useTransform(scrollYProgress, [0, 0.62, 0.75, 1],       [20, 20, 0, 0])

  const opacities = [op0, op1, op2]
  const yVals = [y0, y1, y2]

  // Mockup Y: outgoing slides up and out, incoming slides up into view
  // overflow-hidden on the container clips the movement at the panel edge
  const mockY0 = useTransform(scrollYProgress, [0, 0.25, 0.38, 1],             [0, 0, -80, -80])
  const mockY1 = useTransform(scrollYProgress, [0, 0.25, 0.38, 0.62, 0.75, 1], [80, 80, 0, 0, -80, -80])
  const mockY2 = useTransform(scrollYProgress, [0, 0.62, 0.75, 1],             [80, 80, 0, 0])
  const mockYVals = [mockY0, mockY1, mockY2]

  // Active index drives only the progress pills
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(projects.length - 1, Math.floor(v * projects.length)))
  })

  return (
    <section id="work">
      <div className="max-w-[1200px] mx-auto px-8 pt-20 pb-6">
        <FadeUp className="mb-5">
          <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.15em] uppercase px-3 py-1.5"
            style={{ border: "1px solid rgba(204,145,102,0.22)", color: "#cc9166", background: "rgba(204,145,102,0.05)", borderRadius: 3 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#cc9166", flexShrink: 0 }} />
            Selected Projects
          </span>
        </FadeUp>
        <Reveal>
          <h2 className="text-[clamp(40px,5.5vw,58px)] leading-[1] tracking-[-0.025em]"
            style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}>
            Work
          </h2>
        </Reveal>
      </div>

      {/* 400vh = ~133vh of scroll per project */}
      <div ref={containerRef} style={{ height: "400vh" }}>
        <div className="sticky overflow-hidden" style={{ top: 56, height: "calc(100vh - 56px)" }}>

          {/* Full-viewport flex: text aligns to page grid, mockup fills right edge-to-edge */}
          <div className="h-full flex flex-col lg:flex-row items-stretch">

            {/* Left: text panel — left padding mirrors the page's max-w-[1200px] mx-auto px-8 */}
            <div
              className="w-full lg:w-[42%] flex items-center py-8 lg:py-0 pr-10"
              style={{ paddingLeft: "max(2rem, calc((100vw - 1200px) / 2 + 2rem))" }}
            >
              <div className="w-full">
                {/* Progress pills */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="font-mono text-[10px]" style={{ color: "#555" }}>
                    0{active + 1} / 0{projects.length}
                  </span>
                  <div className="flex gap-2 items-center">
                    {projects.map((_, i) => (
                      <motion.div key={i}
                        animate={{ width: i === active ? 28 : 8, background: i === active ? "#ededed" : "#333" }}
                        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{ height: 2, borderRadius: 2 }}
                      />
                    ))}
                  </div>
                </div>

                {/* All 3 text blocks stacked; opacity + y driven by scroll */}
                <div className="relative" style={{ height: 360 }}>
                  {projects.map((p, i) => (
                    <motion.div
                      key={p.title}
                      className="absolute inset-0"
                      style={{ opacity: opacities[i], y: yVals[i] }}
                    >
                      <h3 className="leading-[1] tracking-[-0.025em] mb-2"
                        style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(32px, 4vw, 48px)", color: "#ededed" }}>
                        {p.title}
                      </h3>
                      <p className="font-mono text-[10px] mb-7" style={{ color: "#444" }}>
                        {p.sub} · {p.year}
                      </p>
                      <p className="text-[14px] leading-[1.8] mb-7" style={{ color: "#555", maxWidth: 380 }}>
                        {p.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-8">
                        {p.tags.map(tag => (
                          <span key={tag} className="font-mono text-[9px] px-2.5 py-1 rounded-full"
                            style={{ border: "1px solid #1c1d22", color: "#444" }}>{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <a href={p.github} target="_blank" rel="noopener noreferrer"
                          className="font-mono text-[11px] flex items-center gap-1.5 transition-colors hover:text-[#ededed]"
                          style={{ color: "#444" }}>
                          <SiGithub className="w-3.5 h-3.5" /> Source
                        </a>
                        <a href={p.link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-mono font-medium transition-colors hover:bg-[#e8e8e8]"
                          style={{ background: "#fff", color: "#000", borderRadius: 3 }}>
                          Live Demo <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: full-bleed product visual, no padding, no max-width */}
            <div
              className="w-full lg:w-[58%] relative overflow-hidden"
              style={{ borderLeft: "1px solid #1c1d22", background: "#000" }}
            >
              {projects.map((p, i) => {
                const M = p.Mockup
                return (
                  <motion.div
                    key={p.title}
                    className="absolute inset-0"
                    style={{ opacity: opacities[i], y: mockYVals[i] }}
                  >
                    <M />
                  </motion.div>
                )
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollY, scrollYProgress: pageProgress } = useScroll()
  const heroTextY = useTransform(scrollY, [0, 700], [0, -90])
  const heroDashY = useTransform(scrollY, [0, 700], [0, -40])
  const pageBg = useTransform(
    pageProgress,
    [0, 0.08, 0.22, 0.38, 0.52, 0.67, 0.80, 1.0],
    ["#000000", "#000000", "#05050e", "#000000", "#070707", "#000000", "#060612", "#000000"]
  )

  return (
    <motion.div style={{ background: pageBg, color: "#ededed", minHeight: "100vh" }}>
      <Nav />

      {/* ══ HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-14">
        <div className="max-w-[1200px] mx-auto w-full px-8 grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-16 items-center py-24">
          <motion.div style={{ y: heroTextY }}>
            {/* Fixed: animate directly, not whileInView — above-fold content */}
            <div className="overflow-hidden mb-[-4px]">
              <motion.h1 className="leading-[0.9] tracking-[-0.035em]"
                initial={{ y: "106%" }} animate={{ y: "0%" }}
                transition={{ duration: 0.88, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(66px, 9.5vw, 110px)", color: "#ffffff" }}>
                Kanishk
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-14">
              <motion.h1 className="leading-[0.9] tracking-[-0.035em]"
                initial={{ y: "106%" }} animate={{ y: "0%" }}
                transition={{ duration: 0.88, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(66px, 9.5vw, 110px)", color: "#cc9166" }}>
                Pansari
              </motion.h1>
            </div>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.48 }}
              className="text-[17px] leading-[1.68] max-w-[400px] mb-10" style={{ color: "#666" }}>
              I build custom AI tools that turn your business data into{" "}
              <em style={{ color: "#cc9166", fontFamily: "var(--font-playfair)" }}>decisions</em>
              . Shipped in 2 weeks.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.6 }}
              className="flex gap-3 flex-wrap">
              <a href="mailto:kanishkpansari1217@gmail.com?subject=Project%20Inquiry"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium transition-all duration-200 hover:bg-[#e8e8e8]"
                style={{ background: "#fff", color: "#000", borderRadius: 3 }}>
                <Mail className="w-3.5 h-3.5" /> Work With Me
              </a>
              <a href="#work"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium transition-all duration-200"
                style={{ border: "1px solid #1c1d22", color: "#666", borderRadius: 3 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#ededed" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1c1d22"; e.currentTarget.style.color = "#666" }}>
                View Work <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </motion.div>

          <motion.div style={{ y: heroDashY }}
            initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}>
            <HeroTechGraph />
          </motion.div>
        </div>
      </section>

      {/* ══ MARQUEE */}
      <div className="overflow-hidden" style={{ borderBottom: "1px solid #111116" }}>
        <div className="flex py-3" style={{ animation: "marquee 28s linear infinite", width: "max-content", gap: 56 }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="font-mono text-[10px] tracking-[0.2em] uppercase whitespace-nowrap" style={{ color: "#555" }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ══ STATS */}
      <section className="max-w-[1200px] mx-auto px-8 py-28">
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ border: "1px solid #1c1d22" }}>
          {[
            { to: 3, suffix: "", label: "AI tools shipped" },
            { to: 2, suffix: " wk", label: "average delivery" },
            { to: 500, suffix: "k+", label: "rows processed" },
            { to: 100, suffix: "%", label: "on-time delivery" },
          ].map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.08}>
              <div className="px-8 py-10" style={{ background: "#000", borderRight: i < 3 ? "1px solid #1c1d22" : "none" }}>
                <p className="text-[48px] font-bold leading-none mb-2 tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-playfair)", color: "#ededed" }}>
                  <Counter to={s.to} suffix={s.suffix} />
                </p>
                <p className="font-mono text-[11px] tracking-[0.1em] uppercase" style={{ color: "#555" }}>{s.label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══ ABOUT */}
      <AboutSection />

      {/* ══ CAPABILITIES */}
      <CapabilitySection />

      {/* ══ WORK (scroll-scrubbed) */}
      <WorkSection />

      {/* ══ CREDENTIALS */}
      <CredentialsSection />

      {/* ══ SERVICES */}
      <section id="services" className="max-w-[1200px] mx-auto px-8 py-28">
        <div className="flex items-end justify-between mb-20">
          <div>
            <FadeUp className="mb-5">
              <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.15em] uppercase px-3 py-1.5"
                style={{ border: "1px solid rgba(204,145,102,0.22)", color: "#cc9166", background: "rgba(204,145,102,0.05)", borderRadius: 3 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#cc9166", flexShrink: 0 }} />
                What I Build
              </span>
            </FadeUp>
            <Reveal>
              <h2 className="text-[clamp(40px,5.5vw,58px)] leading-[1] tracking-[-0.025em]"
                style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}>
                Services
              </h2>
            </Reveal>
          </div>
          <FadeUp>
            <Link href="/services" className="font-mono text-[11px] transition-colors hover:text-[#ededed]" style={{ color: "#444" }}>
              Full details →
            </Link>
          </FadeUp>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-4">
          <FadeUp>
            <SpotlightCard className="rounded-xl h-full min-h-[280px] flex flex-col justify-between p-8 transition-all duration-300"
              style={{ border: "1px solid #1c1d22", background: "#000" }}>
              <div>
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase mb-4" style={{ color: "#555" }}>{services[2].timeline}</p>
                <h3 className="text-[26px] leading-[1.1] tracking-[-0.02em] mb-3"
                  style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, color: "#ededed" }}>{services[2].name}</h3>
                <p className="font-mono text-[22px] font-medium" style={{ color: "#ededed" }}>{services[2].price}</p>
              </div>
              <a href={`mailto:kanishkpansari1217@gmail.com?subject=${encodeURIComponent(services[2].subject)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 self-start text-[13px] font-medium transition-colors hover:bg-[#e8e8e8]"
                style={{ background: "#fff", color: "#000", borderRadius: 3 }}>
                <Mail className="w-3.5 h-3.5" /> Get a Quote
              </a>
            </SpotlightCard>
          </FadeUp>
          <div className="flex flex-col gap-4">
            {services.slice(0, 2).map((s, i) => (
              <FadeUp key={s.name} delay={0.08 + i * 0.08}>
                <SpotlightCard className="rounded-xl flex flex-col justify-between p-6 transition-all duration-300"
                  style={{ border: "1px solid #1c1d22", background: "#000", minHeight: 132 }}>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.15em] uppercase mb-3" style={{ color: "#555" }}>{s.timeline}</p>
                    <h3 className="text-[17px] leading-snug tracking-[-0.01em] mb-2"
                      style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, color: "#ededed" }}>{s.name}</h3>
                    <p className="font-mono text-[13px]" style={{ color: "#888" }}>{s.price}</p>
                  </div>
                </SpotlightCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WRITING */}
      <section id="writing" className="max-w-[1200px] mx-auto px-8 py-28">
        <div className="flex items-end justify-between mb-20">
          <div>
            <FadeUp className="mb-5">
              <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.15em] uppercase px-3 py-1.5"
                style={{ border: "1px solid rgba(204,145,102,0.22)", color: "#cc9166", background: "rgba(204,145,102,0.05)", borderRadius: 3 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#cc9166", flexShrink: 0 }} />
                Latest Articles
              </span>
            </FadeUp>
            <Reveal>
              <h2 className="text-[clamp(40px,5.5vw,58px)] leading-[1] tracking-[-0.025em]"
                style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}>
                Writing
              </h2>
            </Reveal>
          </div>
          <FadeUp>
            <Link href="/blog" className="font-mono text-[11px] transition-colors hover:text-[#ededed]" style={{ color: "#444" }}>All posts →</Link>
          </FadeUp>
        </div>
        <div style={{ borderTop: "1px solid #1c1d22" }}>
          {posts.map((post, i) => (
            <motion.a key={post.slug} href={`/blog/${post.slug}`}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group flex items-center justify-between py-5 transition-all duration-200"
              style={{ borderBottom: "1px solid #1c1d22" }}
              onMouseEnter={e => { e.currentTarget.style.paddingLeft = "8px" }}
              onMouseLeave={e => { e.currentTarget.style.paddingLeft = "0px" }}>
              <div className="flex items-baseline gap-8 flex-1 min-w-0">
                <span className="font-mono text-[10px] flex-shrink-0" style={{ color: "#555" }}>
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
                <span className="text-[14px] font-medium leading-snug truncate transition-colors duration-200 group-hover:text-white" style={{ color: "#888" }}>
                  {post.title}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 ml-4 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1" style={{ color: "#555" }} />
            </motion.a>
          ))}
        </div>
      </section>

      {/* ══ FOOTER */}
      <footer className="max-w-[1200px] mx-auto px-8 py-16">
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="text-[28px] leading-none tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, color: "#ededed" }}>
              Let's work together.
            </p>
            <a href="mailto:kanishkpansari1217@gmail.com" className="font-mono text-[12px] transition-colors hover:text-[#ededed]" style={{ color: "#444" }}>
              kanishkpansari1217@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-5 pt-1">
            <a href="https://github.com/Kanishk1217" target="_blank" rel="noopener noreferrer"
              className="transition-colors hover:text-[#ededed]" style={{ color: "#555" }} aria-label="GitHub">
              <SiGithub className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/kanishk-pansari-8b60a2356/" target="_blank" rel="noopener noreferrer"
              className="transition-colors hover:text-[#ededed]" style={{ color: "#555" }} aria-label="LinkedIn">
              <LinkedInIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
        <p className="font-mono text-[10px] mt-14" style={{ color: "#333" }}>© 2026 Kanishk Pansari</p>
      </footer>
    </motion.div>
  )
}
