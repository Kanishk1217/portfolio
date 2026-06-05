"use client"

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
} from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Mail, ExternalLink, ArrowRight } from "lucide-react"
import { SiGithub } from "react-icons/si"
import Link from "next/link"
import Nav from "@/components/nav"

// ─── Icons ────────────────────────────────────────────────────────────────────
const LinkedInIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

// ─── Motion Helpers ───────────────────────────────────────────────────────────

/** Slide-up reveal: wraps children in overflow:hidden, slides content up into view */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
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

/** Fade + translateY for non-heading elements */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
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

/** 3-D tilt card — follows cursor */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useTransform(my, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(mx, [-0.5, 0.5], [-4, 4])
  const sx = useSpring(rotateX, { stiffness: 140, damping: 18 })
  const sy = useSpring(rotateY, { stiffness: 140, damping: 18 })

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: sx, rotateY: sy, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onMouseLeave={() => { mx.set(0); my.set(0) }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Cursor-follow spotlight */
function SpotlightCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
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
          background: `radial-gradient(240px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.035), transparent 70%)`,
        }}
      />
      {children}
    </div>
  )
}

/** Animated counter */
function Counter({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number
  prefix?: string
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const tick = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 1400, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.floor(eased * to))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, to])

  return (
    <span ref={ref}>
      {prefix}
      {val}
      {suffix}
    </span>
  )
}

// ─── Hero Dashboard ───────────────────────────────────────────────────────────
function HeroDashboard() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setLoaded(true) }, [])

  const kpis = [
    { label: "Revenue", value: "$84.2k", delta: "+12.4%", pos: true },
    { label: "Customers", value: "1,284", delta: "+8.1%", pos: true },
    { label: "Churn", value: "2.3%", delta: "-0.4%", pos: false },
  ]
  const bars = [42, 68, 53, 81, 60, 94, 72]
  const days = ["M", "T", "W", "T", "F", "S", "S"]
  const txns = [
    { name: "Stripe Payment", amount: "+$2,400", time: "2m ago", pos: true },
    { name: "AWS Invoice", amount: "-$340", time: "1h ago", pos: false },
    { name: "New Customer", amount: "+$890", time: "3h ago", pos: true },
  ]

  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{ border: "1px solid #1c1d22", background: "#000" }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid #1c1d22" }}
      >
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "#444" }}>
          Business Analyzer
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
          <span className="font-mono text-[10px]" style={{ color: "#444" }}>Live</span>
        </div>
      </div>

      {/* kpis */}
      <div className="grid grid-cols-3" style={{ borderBottom: "1px solid #1c1d22" }}>
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ delay: 0.25 + i * 0.1 }}
            className="px-4 py-4"
            style={{ borderRight: i < 2 ? "1px solid #1c1d22" : "none" }}
          >
            <p className="font-mono text-[9px] tracking-widest uppercase mb-1.5" style={{ color: "#444" }}>
              {k.label}
            </p>
            <p className="text-[17px] font-semibold leading-none mb-1.5" style={{ color: "#ededed" }}>
              {k.value}
            </p>
            <p className="font-mono text-[10px]" style={{ color: k.pos ? "#22c55e" : "#ef4444" }}>
              {k.delta}
            </p>
          </motion.div>
        ))}
      </div>

      {/* bar chart */}
      <div className="px-5 py-4" style={{ borderBottom: "1px solid #1c1d22" }}>
        <p className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{ color: "#444" }}>
          Weekly Revenue
        </p>
        <div className="flex items-end gap-1.5" style={{ height: 56 }}>
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <motion.div
                className="w-full rounded-[2px]"
                style={{ background: "#1c1d22" }}
                initial={{ height: 0 }}
                animate={loaded ? { height: `${h}%` } : { height: 0 }}
                transition={{ delay: 0.55 + i * 0.07, duration: 0.55, ease: [0.34, 1.1, 0.64, 1] }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 mt-1.5">
          {days.map((d, i) => (
            <span key={i} className="flex-1 font-mono text-[8px] text-center" style={{ color: "#333" }}>
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* transactions */}
      <div>
        {txns.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, x: -10 }}
            animate={loaded ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1.0 + i * 0.12 }}
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: i < txns.length - 1 ? "1px solid #1c1d22" : "none" }}
          >
            <div>
              <p className="text-[12px]" style={{ color: "#888" }}>{t.name}</p>
              <p className="font-mono text-[9px] mt-0.5" style={{ color: "#333" }}>{t.time}</p>
            </div>
            <p
              className="font-mono text-[12px] font-medium"
              style={{ color: t.pos ? "#ededed" : "#555" }}
            >
              {t.amount}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Project Thumbnails ───────────────────────────────────────────────────────
function CSVThumbnail() {
  const headers = ["Column", "Type", "Unique", "Null %"]
  const rows = [
    ["user_id", "int64", "1,024", "0.0%"],
    ["category", "object", "12", "1.2%"],
    ["revenue", "float64", "890", "0.4%"],
    ["date", "datetime", "365", "0.0%"],
  ]
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden" style={{ background: "#000" }}>
      <div className="relative z-10 w-full px-6 space-y-1.5">
        <div className="flex gap-2 pb-2" style={{ borderBottom: "1px solid #1c1d22" }}>
          {headers.map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="font-mono text-[9px] font-medium flex-1 text-center" style={{ color: "#555" }}>
              {h}
            </motion.div>
          ))}
        </div>
        {rows.map((row, ri) => (
          <motion.div key={ri} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.3 + ri * 0.1 }}
            className="flex gap-2 py-1">
            {row.map((cell, ci) => (
              <div key={ci} className="font-mono text-[9px] flex-1 text-center"
                style={{ color: ci === 0 ? "#888" : "#555" }}>{cell}</div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function FinancialThumbnail() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  const income = [42, 55, 48, 61, 58, 70]
  const expense = [30, 38, 35, 40, 44, 47]
  const maxVal = 80
  const w = 260, h = 120, padL = 8, padB = 20, padT = 10
  const chartW = w - padL, chartH = h - padB - padT
  const toX = (i: number) => padL + (i / (months.length - 1)) * chartW
  const toY = (v: number) => padT + chartH - (v / maxVal) * chartH
  const ip = income.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ")
  const ep = expense.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ")
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden px-4 gap-3" style={{ background: "#000" }}>
      <div className="relative z-10 flex gap-6 w-full justify-center">
        {[{ l: "Income", v: "+$70k" }, { l: "Expense", v: "$47k" }, { l: "Saved", v: "$23k" }].map(({ l, v }, i) => (
          <motion.div key={l} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.1 }} className="flex flex-col items-center gap-0.5">
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#444" }}>{l}</span>
            <span className="font-mono text-[12px] font-semibold" style={{ color: "#888" }}>{v}</span>
          </motion.div>
        ))}
      </div>
      <svg className="relative z-10 w-full" viewBox={`0 0 ${w} ${h}`}>
        {[30, 50, 70].map(y => <line key={y} x1={padL} y1={toY(y)} x2={w} y2={toY(y)} stroke="#1c1d22" strokeWidth="1" />)}
        <motion.path d={ip} fill="none" stroke="#ededed" strokeOpacity="0.4" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }} />
        <motion.path d={ep} fill="none" stroke="#555" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"
          initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeInOut" }} />
        {income.map((v, i) => (
          <motion.circle key={i} cx={toX(i)} cy={toY(v)} r="2.5" fill="#ededed" fillOpacity="0.6"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
            transition={{ delay: 1.1 + i * 0.06, type: "spring", stiffness: 260, damping: 14 }} />
        ))}
        {months.map((m, i) => (
          <text key={m} x={toX(i)} y={h - 4} textAnchor="middle" fontSize="7" fill="#333">{m}</text>
        ))}
      </svg>
    </div>
  )
}

function BusinessThumbnail() {
  const bars = [{ h: 55, y: 105 }, { h: 85, y: 75 }, { h: 48, y: 112 }, { h: 108, y: 52 }, { h: 72, y: 88 }]
  const lp = bars.map((b, i) => `${38 + i * 52},${b.y}`).join(" ")
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden" style={{ background: "#000" }}>
      <svg className="w-full h-4/5 px-4" viewBox="0 0 270 175">
        {[50, 90, 130, 160].map((y) => (
          <line key={y} x1="0" y1={y} x2="270" y2={y} stroke="#1c1d22" strokeWidth="1" />
        ))}
        {bars.map((b, i) => (
          <motion.rect key={i} x={20 + i * 52} rx="2" fill="#ededed" fillOpacity={0.06 + i * 0.03}
            initial={{ y: 160, height: 0 }} whileInView={{ y: b.y, height: b.h }} viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: [0.34, 1.1, 0.64, 1] }} width={32} />
        ))}
        <motion.polyline points={lp} fill="none" stroke="#ededed" strokeOpacity="0.35" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ opacity: 0, pathLength: 0 }} whileInView={{ opacity: 1, pathLength: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1.0, ease: "easeInOut" }} />
        {bars.map((b, i) => (
          <motion.circle key={i} cx={38 + i * 52} cy={b.y} r="3" fill="#ededed" fillOpacity="0.7"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
            transition={{ delay: 1.0 + i * 0.06, type: "spring", stiffness: 240, damping: 14 }} />
        ))}
      </svg>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const projects = [
  {
    num: "01",
    title: "Business Analyzer",
    sub: "Predictive Financial Analysis",
    year: "2025",
    desc: "Feed in your business numbers and see exactly where you're headed. ML model compares predicted vs. actual performance to surface trends, flag risks, and give you a data-backed view of your trajectory.",
    outcome: "KPI tracking, revenue forecasting, customer segmentation.",
    tags: ["Python", "Machine Learning", "FastAPI", "React", "TypeScript"],
    link: "https://business-analysis-3h9.pages.dev/",
    github: "https://github.com/Kanishk1217/business-analysis",
    Thumb: BusinessThumbnail,
  },
  {
    num: "02",
    title: "CSV Analyzer",
    sub: "Data Analysis Tool",
    year: "2024",
    desc: "Upload any CSV and instantly understand what's inside it. Column types, distributions, null rates, correlations. No code required.",
    outcome: "",
    tags: ["Python", "Pandas", "FastAPI", "React"],
    link: "https://csv--analysis.pages.dev/",
    github: "https://github.com/Kanishk1217/csv-analysis",
    Thumb: CSVThumbnail,
  },
  {
    num: "03",
    title: "FinanceAI",
    sub: "AI-Powered Finance Tracker",
    year: "2026",
    desc: "Connect your real bank via Plaid. Automatic transaction sync, budget tracking, and AI spending insights. Full-stack: React + FastAPI + PostgreSQL.",
    outcome: "",
    tags: ["React", "FastAPI", "PostgreSQL", "Plaid"],
    link: "https://financial-ai.pages.dev",
    github: "https://github.com/Kanishk1217/Financial_AI",
    Thumb: FinancialThumbnail,
  },
]

const services = [
  { name: "Data Intelligence Dashboard", price: "$800 – $1,500", timeline: "1–2 weeks", subject: "Project Inquiry — Data Intelligence Dashboard" },
  { name: "Custom AI Agent", price: "$1,200 – $2,500", timeline: "1–2 weeks", subject: "Project Inquiry — Custom AI Agent" },
  { name: "Full AI Product Build", price: "$3,000 – $6,000", timeline: "3–5 weeks", subject: "Project Inquiry — Full AI Product Build" },
]

const posts = [
  {
    slug: "building-a-business-analyzer-what-ml-taught-me-about-real-decisions",
    title: "Building a Business Analyzer — What ML Taught Me About Real Decisions",
    date: "2025-03-10",
  },
  {
    slug: "building-financeai-when-your-bank-data-becomes-actually-useful",
    title: "Building FinanceAI — When Your Bank Data Becomes Actually Useful",
    date: "2026-05-14",
  },
  {
    slug: "what-i-learned-building-a-csv-analyzer",
    title: "What I Learned Building a CSV Analyzer",
    date: "2024-11-20",
  },
  {
    slug: "what-sales-taught-me-about-data-that-no-dataset-ever-could",
    title: "What Sales Taught Me About Data That No Dataset Ever Could",
    date: "2025-06-01",
  },
]

const marqueeItems = [
  "Available for Projects",
  "Python",
  "FastAPI",
  "React",
  "Machine Learning",
  "PostgreSQL",
  "TypeScript",
  "Data Analysis",
  "AI Development",
  "2 Weeks to Ship",
  "Ahmedabad, India",
  "Open to Remote",
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 480], [1, 0])
  const heroY = useTransform(scrollY, [0, 480], [0, -72])

  return (
    <div style={{ background: "#000", color: "#ededed", minHeight: "100vh" }}>
      <Nav />

      {/* ══════════════════════════════════════════════ HERO */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex items-center pt-14 overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto w-full px-8 grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-16 items-center py-24">

          {/* left */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-mono text-[10px] tracking-[0.22em] uppercase mb-10"
              style={{ color: "#444" }}
            >
              Ahmedabad, India · Available for projects
            </motion.p>

            <div className="mb-2">
              <Reveal>
                <h1
                  className="leading-[0.9] tracking-[-0.03em]"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(68px, 9.5vw, 108px)",
                    color: "#ededed",
                  }}
                >
                  Kanishk
                </h1>
              </Reveal>
            </div>
            <div className="mb-12">
              <Reveal delay={0.08}>
                <h1
                  className="leading-[0.9] tracking-[-0.03em]"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontWeight: 400,
                    fontSize: "clamp(68px, 9.5vw, 108px)",
                    color: "#ededed",
                  }}
                >
                  Pansari
                </h1>
              </Reveal>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.42 }}
              className="text-[17px] leading-[1.68] max-w-[400px] mb-10"
              style={{ color: "#666" }}
            >
              I build custom AI tools that turn your business data into{" "}
              <em style={{ color: "#cc9166", fontFamily: "var(--font-playfair)" }}>decisions</em>
              {" "}— shipped in 2 weeks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.58 }}
              className="flex gap-3 flex-wrap"
            >
              <a
                href="mailto:kanishkpansari1217@gmail.com?subject=Project%20Inquiry"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium transition-all duration-200 hover:bg-[#e8e8e8]"
                style={{ background: "#fff", color: "#000", borderRadius: 3 }}
              >
                <Mail className="w-3.5 h-3.5" /> Work With Me
              </a>
              <a
                href="#work"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium transition-all duration-200"
                style={{ border: "1px solid #1c1d22", color: "#666", borderRadius: 3 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#333"
                  e.currentTarget.style.color = "#ededed"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1c1d22"
                  e.currentTarget.style.color = "#666"
                }}
              >
                View Work <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </div>

          {/* right — live dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroDashboard />
          </motion.div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════ MARQUEE */}
      <div className="overflow-hidden" style={{ borderTop: "1px solid #1c1d22", borderBottom: "1px solid #1c1d22" }}>
        <div
          className="flex py-3"
          style={{
            animation: "marquee 28s linear infinite",
            width: "max-content",
            gap: 56,
          }}
        >
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="font-mono text-[10px] tracking-[0.2em] uppercase whitespace-nowrap" style={{ color: "#333" }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════ STATS */}
      <section className="max-w-[1200px] mx-auto px-8 py-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ border: "1px solid #1c1d22" }}>
          {[
            { to: 3, suffix: "", label: "AI tools shipped" },
            { to: 2, suffix: " wk", label: "average delivery" },
            { to: 500, suffix: "k+", label: "rows processed" },
            { to: 100, suffix: "%", label: "on-time delivery" },
          ].map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.08}>
              <div
                className="px-8 py-10"
                style={{ background: "#000", borderRight: i < 3 ? "1px solid #1c1d22" : "none" }}
              >
                <p
                  className="text-[48px] font-bold leading-none mb-2 tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-playfair)", color: "#ededed" }}
                >
                  <Counter to={s.to} suffix={s.suffix} />
                </p>
                <p className="font-mono text-[11px] tracking-[0.1em] uppercase" style={{ color: "#444" }}>
                  {s.label}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════ PROJECTS */}
      <section id="work" className="max-w-[1200px] mx-auto px-8 pb-28" style={{ borderTop: "1px solid #1c1d22" }}>
        <div className="pt-20 mb-20">
          <Reveal>
            <h2
              className="text-[clamp(36px,5vw,52px)] leading-[1] tracking-[-0.025em]"
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}
            >
              Work
            </h2>
          </Reveal>
        </div>

        {/* Featured — Business Analyzer */}
        <TiltCard className="mb-4">
          <div
            className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] rounded-xl overflow-hidden transition-all duration-300 group"
            style={{ border: "1px solid #1c1d22", background: "#000" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.borderColor = "#2e2e2e"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.borderColor = "#1c1d22"
            }}
          >
            {/* text */}
            <div className="p-8 flex flex-col justify-between" style={{ borderRight: "1px solid #1c1d22" }}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "#333" }}>01</span>
                  <span
                    className="font-mono text-[9px] px-2.5 py-1 rounded-full"
                    style={{ border: "1px solid #cc9166", color: "#cc9166", letterSpacing: "0.1em" }}
                  >
                    Featured
                  </span>
                </div>
                <h3
                  className="text-[28px] leading-[1.1] tracking-[-0.02em] mb-1"
                  style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, color: "#ededed" }}
                >
                  Business Analyzer
                </h3>
                <p className="font-mono text-[10px] mb-6" style={{ color: "#444" }}>
                  Predictive Financial Analysis · 2025
                </p>
                <p className="text-[14px] leading-relaxed mb-3 italic" style={{ color: "#cc9166", fontFamily: "var(--font-playfair)" }}>
                  KPI tracking, revenue forecasting, customer segmentation.
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "#666" }}>
                  Feed in your business numbers and see exactly where you're headed. ML model compares predicted vs. actual performance to surface trends and flag risks.
                </p>
              </div>
              <div>
                <div className="flex flex-wrap gap-1.5 mb-6 mt-6">
                  {["Python", "Machine Learning", "FastAPI", "React", "TypeScript"].map(tag => (
                    <span key={tag} className="font-mono text-[9px] px-2.5 py-1 rounded-full"
                      style={{ border: "1px solid #1c1d22", color: "#555" }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-5">
                  <a href="https://github.com/Kanishk1217/business-analysis" target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[11px] flex items-center gap-1.5 transition-colors duration-200 hover:text-[#ededed]"
                    style={{ color: "#444" }}>
                    <SiGithub className="w-3.5 h-3.5" /> Source
                  </a>
                  <a href="https://business-analysis-3h9.pages.dev/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-medium font-mono transition-colors duration-200 hover:bg-[#e8e8e8]"
                    style={{ background: "#fff", color: "#000", borderRadius: 3 }}>
                    Live Demo <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
            {/* visual */}
            <div style={{ height: 400 }}>
              <BusinessThumbnail />
            </div>
          </div>
        </TiltCard>

        {/* Grid — CSV + FinanceAI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.slice(1).map((p, i) => (
            <FadeUp key={p.num} delay={i * 0.1}>
              <TiltCard>
                <div
                  className="rounded-xl overflow-hidden flex flex-col transition-all duration-300"
                  style={{ border: "1px solid #1c1d22", background: "#000" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2e2e2e" }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1c1d22" }}
                >
                  <div style={{ height: 200, borderBottom: "1px solid #1c1d22" }}>
                    <p.Thumb />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase block mb-3" style={{ color: "#333" }}>
                      {p.num} · {p.year}
                    </span>
                    <h3
                      className="text-[20px] leading-[1.1] tracking-[-0.015em] mb-1"
                      style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, color: "#ededed" }}
                    >
                      {p.title}
                    </h3>
                    <p className="font-mono text-[10px] mb-4" style={{ color: "#444" }}>{p.sub}</p>
                    <p className="text-[13px] leading-relaxed mb-5 flex-1" style={{ color: "#666" }}>{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.tags.map(tag => (
                        <span key={tag} className="font-mono text-[9px] px-2.5 py-1 rounded-full"
                          style={{ border: "1px solid #1c1d22", color: "#555" }}>{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <a href={p.github} target="_blank" rel="noopener noreferrer"
                        className="font-mono text-[10px] flex items-center gap-1.5 transition-colors hover:text-[#ededed]"
                        style={{ color: "#444" }}>
                        <SiGithub className="w-3 h-3" /> Source
                      </a>
                      <a href={p.link} target="_blank" rel="noopener noreferrer"
                        className="font-mono text-[10px] flex items-center gap-1.5 transition-colors hover:text-[#ededed]"
                        style={{ color: "#444" }}>
                        <ExternalLink className="w-3 h-3" /> Live
                      </a>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════ SERVICES */}
      <section id="services" className="max-w-[1200px] mx-auto px-8 py-28" style={{ borderTop: "1px solid #1c1d22" }}>
        <div className="flex items-end justify-between mb-20">
          <Reveal>
            <h2
              className="text-[clamp(36px,5vw,52px)] leading-[1] tracking-[-0.025em]"
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}
            >
              Services
            </h2>
          </Reveal>
          <FadeUp>
            <Link href="/services" className="font-mono text-[11px] transition-colors hover:text-[#ededed]"
              style={{ color: "#444" }}>
              Full details →
            </Link>
          </FadeUp>
        </div>

        {/* bento: 1 large left + 2 stacked right */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-4">
          {/* large card */}
          <FadeUp>
            <SpotlightCard
              className="rounded-xl h-full min-h-[280px] flex flex-col justify-between p-8 transition-all duration-300"
              style={{ border: "1px solid #1c1d22", background: "#000" }}
            >
              <div>
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase mb-4" style={{ color: "#333" }}>
                  {services[2].timeline}
                </p>
                <h3
                  className="text-[26px] leading-[1.1] tracking-[-0.02em] mb-3"
                  style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, color: "#ededed" }}
                >
                  {services[2].name}
                </h3>
                <p className="font-mono text-[22px] font-medium" style={{ color: "#ededed" }}>
                  {services[2].price}
                </p>
              </div>
              <a
                href={`mailto:kanishkpansari1217@gmail.com?subject=${encodeURIComponent(services[2].subject)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 self-start text-[13px] font-medium transition-colors hover:bg-[#e8e8e8]"
                style={{ background: "#fff", color: "#000", borderRadius: 3 }}
              >
                <Mail className="w-3.5 h-3.5" /> Get a Quote
              </a>
            </SpotlightCard>
          </FadeUp>

          {/* 2 stacked */}
          <div className="flex flex-col gap-4">
            {services.slice(0, 2).map((s, i) => (
              <FadeUp key={s.name} delay={0.08 + i * 0.08}>
                <SpotlightCard
                  className="rounded-xl flex flex-col justify-between p-6 transition-all duration-300"
                  style={{ border: "1px solid #1c1d22", background: "#000", minHeight: 132 }}
                >
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.15em] uppercase mb-3" style={{ color: "#333" }}>
                      {s.timeline}
                    </p>
                    <h3
                      className="text-[17px] leading-snug tracking-[-0.01em] mb-2"
                      style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, color: "#ededed" }}
                    >
                      {s.name}
                    </h3>
                    <p className="font-mono text-[13px]" style={{ color: "#888" }}>{s.price}</p>
                  </div>
                </SpotlightCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ WRITING */}
      <section id="writing" className="max-w-[1200px] mx-auto px-8 py-28" style={{ borderTop: "1px solid #1c1d22" }}>
        <div className="flex items-end justify-between mb-20">
          <Reveal>
            <h2
              className="text-[clamp(36px,5vw,52px)] leading-[1] tracking-[-0.025em]"
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}
            >
              Writing
            </h2>
          </Reveal>
          <FadeUp>
            <Link href="/blog" className="font-mono text-[11px] transition-colors hover:text-[#ededed]"
              style={{ color: "#444" }}>
              All posts →
            </Link>
          </FadeUp>
        </div>

        <div style={{ borderTop: "1px solid #1c1d22" }}>
          {posts.map((post, i) => (
            <motion.a
              key={post.slug}
              href={`/blog/${post.slug}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group flex items-center justify-between py-5 transition-all duration-200"
              style={{ borderBottom: "1px solid #1c1d22" }}
              onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "8px" }}
              onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0px" }}
            >
              <div className="flex items-baseline gap-8 flex-1 min-w-0">
                <span className="font-mono text-[10px] flex-shrink-0" style={{ color: "#333" }}>
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
                <span className="text-[14px] font-medium leading-snug truncate transition-colors duration-200 group-hover:text-white"
                  style={{ color: "#888" }}>
                  {post.title}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 ml-4 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                style={{ color: "#555" }} />
            </motion.a>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════ FOOTER */}
      <footer
        className="max-w-[1200px] mx-auto px-8 py-16"
        style={{ borderTop: "1px solid #1c1d22" }}
      >
        <div className="flex items-start justify-between gap-8">
          <div>
            <p
              className="text-[28px] leading-none tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, color: "#ededed" }}
            >
              Let's work together.
            </p>
            <a
              href="mailto:kanishkpansari1217@gmail.com"
              className="font-mono text-[12px] transition-colors hover:text-[#ededed]"
              style={{ color: "#555" }}
            >
              kanishkpansari1217@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-5 pt-1">
            <a href="https://github.com/Kanishk1217" target="_blank" rel="noopener noreferrer"
              className="transition-colors hover:text-[#ededed]" style={{ color: "#444" }} aria-label="GitHub">
              <SiGithub className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/kanishk-pansari-8b60a2356/" target="_blank" rel="noopener noreferrer"
              className="transition-colors hover:text-[#ededed]" style={{ color: "#444" }} aria-label="LinkedIn">
              <LinkedInIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
        <p className="font-mono text-[10px] mt-14" style={{ color: "#2a2a2a" }}>
          © 2026 Kanishk Pansari
        </p>
      </footer>
    </div>
  )
}
