"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Mail, ExternalLink, ArrowRight, Download, PenLine, Briefcase } from "lucide-react"
import { SiGithub } from "react-icons/si"
import Link from "next/link"
import Nav from "@/components/nav"
import { MagneticDock, type DockItemData } from "@/components/ui/magnetic-dock"

// ─── LinkedIn Icon ─────────────────────────────────────────────────────────────
const LinkedInIcon = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

// ─── Animated Thumbnails ───────────────────────────────────────────────────────
function CSVThumbnail() {
  const headers = ["Column", "Type", "Unique", "Null %"]
  const rows = [
    ["user_id", "int64", "1,024", "0.0%"],
    ["category", "object", "12", "1.2%"],
    ["revenue", "float64", "890", "0.4%"],
    ["date", "datetime", "365", "0.0%"],
  ]
  return (
    <div className="w-full h-full bg-card flex items-center justify-center relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" width="100%" height="100%">
        <defs><pattern id="csv-dot" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="currentColor" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#csv-dot)" />
      </svg>
      <div className="relative z-10 w-full px-5 space-y-1">
        <div className="flex gap-1.5 pb-1 border-b border-border/40">
          {headers.map((h, ci) => (
            <motion.div key={ci} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + ci * 0.06, duration: 0.4 }}
              className="font-mono text-[8px] font-semibold text-foreground/60 flex-1 text-center">{h}</motion.div>
          ))}
        </div>
        {rows.map((row, ri) => (
          <motion.div key={ri} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + ri * 0.18, duration: 0.45, ease: "easeOut" }}
            className="flex gap-1.5 py-0.5">
            {row.map((cell, ci) => (
              <div key={ci} className={`font-mono text-[8px] flex-1 text-center ${ci === 0 ? "text-foreground/80" : "text-muted-foreground"}`}>{cell}</div>
            ))}
          </motion.div>
        ))}
      </div>
      <motion.div className="absolute left-0 right-0 h-px bg-foreground/20 pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0, 0.6, 0] }}
        transition={{ delay: 1.8, duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }} />
    </div>
  )
}

function FinancialThumbnail() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  const income =  [42, 55, 48, 61, 58, 70]
  const expense = [30, 38, 35, 40, 44, 47]
  const maxVal = 80
  const w = 240, h = 110, padL = 8, padB = 18, padT = 8
  const chartW = w - padL, chartH = h - padB - padT
  const toX = (i: number) => padL + (i / (months.length - 1)) * chartW
  const toY = (v: number) => padT + chartH - (v / maxVal) * chartH
  const incomePath  = income.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ")
  const expensePath = expense.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ")
  return (
    <div className="w-full h-full bg-card flex flex-col items-center justify-center relative overflow-hidden px-4 gap-2">
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" width="100%" height="100%">
        <defs><pattern id="fin-dot" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="currentColor" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#fin-dot)" />
      </svg>
      <div className="relative z-10 flex gap-4 w-full justify-center mb-1">
        {[{ label: "Income", val: "+70k" }, { label: "Expense", val: "47k" }, { label: "Saved", val: "23k" }].map(({ label, val }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.12 }} className="flex flex-col items-center">
            <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest">{label}</span>
            <span className="font-mono text-[11px] font-semibold text-foreground/80">{val}</span>
          </motion.div>
        ))}
      </div>
      <svg className="relative z-10 w-full" viewBox={`0 0 ${w} ${h}`}>
        {[30, 50, 70].map(y => <line key={y} x1={padL} y1={toY(y)} x2={w} y2={toY(y)} stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />)}
        <motion.path d={incomePath} fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 0.5, duration: 1.1, ease: "easeInOut" }} />
        <motion.path d={expensePath} fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 0.7, duration: 1.1, ease: "easeInOut" }} />
        {income.map((v, i) => (
          <motion.circle key={i} cx={toX(i)} cy={toY(v)} r="2.5" fill="currentColor" fillOpacity="0.7"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 + i * 0.07, type: "spring", stiffness: 220, damping: 12 }} />
        ))}
        {months.map((m, i) => <text key={m} x={toX(i)} y={h - 4} textAnchor="middle" className="font-mono" fontSize="6" fill="currentColor" fillOpacity="0.3">{m}</text>)}
      </svg>
    </div>
  )
}

function BusinessThumbnail() {
  const bars = [{ h: 55, y: 105 }, { h: 85, y: 75 }, { h: 48, y: 112 }, { h: 108, y: 52 }, { h: 72, y: 88 }]
  const linePoints = bars.map((b, i) => `${38 + i * 52},${b.y}`).join(" ")
  return (
    <div className="w-full h-full bg-card flex items-center justify-center relative overflow-hidden">
      <svg className="w-full h-4/5 px-4" viewBox="0 0 270 175">
        {[50, 90, 130, 160].map((y) => <line key={y} x1="0" y1={y} x2="270" y2={y} stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />)}
        {bars.map((b, i) => (
          <motion.rect key={i} x={20 + i * 52} rx="3" fill="currentColor" fillOpacity={0.15 + i * 0.04}
            initial={{ y: 160, height: 0 }} animate={{ y: b.y, height: b.h }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.34, 1.2, 0.64, 1] }} width={32} />
        ))}
        <motion.polyline points={linePoints} fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ opacity: 0, pathLength: 0 }} animate={{ opacity: 1, pathLength: 1 }} transition={{ delay: 1.0, duration: 0.9, ease: "easeInOut" }} />
        {bars.map((b, i) => (
          <motion.circle key={i} cx={38 + i * 52} cy={b.y} r="3.5" fill="currentColor" fillOpacity="0.8"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 + i * 0.06, type: "spring", stiffness: 220, damping: 12 }} />
        ))}
        <defs>
          <linearGradient id="chart-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.06" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="270" height="80" fill="url(#chart-fade)" />
      </svg>
    </div>
  )
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const projects = [
  {
    num: "01",
    title: "Business Analyzer",
    sub: "Predictive Financial Analysis",
    year: "2025",
    featured: true,
    outcome: "KPI tracking, revenue forecasting, customer segmentation — all from a CSV upload.",
    desc: "Feed in your business numbers and see exactly where you're headed. ML model compares predicted vs. actual performance to surface trends, flag risks, and give you a data-backed view of your business trajectory.",
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
    desc: "Upload any CSV and instantly understand everything inside it — column types, distributions, null values, and hidden patterns. No code required.",
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
    tags: ["React", "FastAPI", "PostgreSQL", "Plaid"],
    link: "https://financial-ai.pages.dev",
    github: "https://github.com/Kanishk1217/Financial_AI",
    Thumb: FinancialThumbnail,
  },
]

const services = [
  { name: "Data Intelligence Dashboard", price: "$800 – $1,500", timeline: "1–2 weeks", subject: "Project Inquiry — Data Intelligence Dashboard" },
  { name: "Custom AI Agent",             price: "$1,200 – $2,500", timeline: "1–2 weeks", subject: "Project Inquiry — Custom AI Agent" },
  { name: "Full AI Product Build",       price: "$3,000 – $6,000", timeline: "3–5 weeks", subject: "Project Inquiry — Full AI Product Build" },
]

const posts = [
  {
    slug: "building-a-business-analyzer-what-ml-taught-me-about-real-decisions",
    title: "Building a Business Analyzer — What ML Taught Me About Real Decisions",
    date: "2025-03-10",
    desc: "Predicting business performance sounds straightforward until the model is right and the business still makes the wrong call.",
  },
  {
    slug: "building-financeai-when-your-bank-data-becomes-actually-useful",
    title: "Building FinanceAI — When Your Bank Data Becomes Actually Useful",
    date: "2026-05-14",
    desc: "Banks already have all your transaction data. The problem isn't capture — it's that the data sits behind clunky interfaces nobody opens twice a month.",
  },
  {
    slug: "what-i-learned-building-a-csv-analyzer",
    title: "What I Learned Building a CSV Analyzer",
    date: "2024-11-20",
    desc: "The hardest part wasn't the ML model. It was making the output mean something to someone who doesn't know what a p-value is.",
  },
  {
    slug: "what-sales-taught-me-about-data-that-no-dataset-ever-could",
    title: "What Sales Taught Me About Data That No Dataset Ever Could",
    date: "2025-06-01",
    desc: "The most important thing about a metric is who is going to act on it — and whether they trust it.",
  },
]

// ─── Fade-in wrapper ───────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 120)
    return () => clearTimeout(t)
  }, [])

  const dockItems: DockItemData[] = [
    { id: "github",   label: "GitHub",   icon: <SiGithub className="w-full h-full" />,  onClick: () => window.open("https://github.com/Kanishk1217", "_blank") },
    { id: "linkedin", label: "LinkedIn", icon: <LinkedInIcon />,                          onClick: () => window.open("https://www.linkedin.com/in/kanishk-pansari-8b60a2356/", "_blank") },
    { id: "email",    label: "Email",    icon: <Mail className="w-full h-full" />,        onClick: () => window.open("mailto:kanishkpansari1217@gmail.com") },
    { id: "writing",  label: "Writing",  icon: <PenLine className="w-full h-full" />,     onClick: () => { window.location.href = "/blog" } },
    { id: "services", label: "Services", icon: <Briefcase className="w-full h-full" />,  onClick: () => { window.location.href = "/services" } },
    { id: "resume",   label: "Resume",   icon: <Download className="w-full h-full" />,   onClick: () => window.open("/resume.pdf", "_blank") },
  ]

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />

      {ready && (
        <>
          {/* ══════════════════════════════════════ HERO */}
          <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* gradient orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              <div
                className="absolute -top-40 left-[8%] w-[750px] h-[750px] rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)",
                  filter: "blur(60px)",
                  animation: "orb1 24s ease-in-out infinite",
                }}
              />
              <div
                className="absolute bottom-[-10%] right-[4%] w-[560px] h-[560px] rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 65%)",
                  filter: "blur(60px)",
                  animation: "orb2 30s ease-in-out infinite reverse",
                }}
              />
            </div>

            <div className="relative z-10 max-w-[1100px] mx-auto w-full px-8 pt-36 pb-28">
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <p className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground/45 uppercase mb-8 select-none">
                  Ahmedabad, India · Available for projects
                </p>

                <h1
                  className="text-[clamp(54px,8.5vw,86px)] font-extrabold leading-[0.92] tracking-[-0.032em] text-foreground mb-8 select-none"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  Kanishk<br />Pansari
                </h1>

                <p className="text-[17px] text-muted-foreground leading-[1.68] max-w-[500px] mb-11 tracking-[-0.005em]">
                  I build custom AI tools that turn your business data into decisions — shipped in 2 weeks.
                </p>

                <div className="flex gap-3 flex-wrap">
                  <a
                    href="mailto:kanishkpansari1217@gmail.com?subject=Project%20Inquiry"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-medium text-white transition-all duration-200 hover:opacity-[0.88] active:scale-[0.98]"
                    style={{ backgroundColor: "#6366f1" }}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Work With Me
                  </a>
                  <a
                    href="#work"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-medium text-muted-foreground border border-border hover:text-foreground hover:border-foreground/20 transition-all duration-200"
                  >
                    View My Work
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            </div>

            {/* scroll indicator */}
            <div className="absolute bottom-10 left-8">
              <motion.div
                className="w-px bg-foreground/20"
                initial={{ height: 0 }}
                animate={{ height: 52 }}
                transition={{ delay: 1.3, duration: 0.9, ease: "easeInOut" }}
              />
            </div>
          </section>

          {/* ══════════════════════════════════════ PROJECTS */}
          <section id="work" className="max-w-[1100px] mx-auto px-8 py-28">
            <FadeIn className="flex items-baseline justify-between mb-14">
              <h2
                className="text-[34px] font-bold tracking-[-0.022em]"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                What I've Built
              </h2>
              <span className="font-mono text-[10px] text-muted-foreground/35 tracking-[0.2em] uppercase">
                2024 – 2026
              </span>
            </FadeIn>

            {/* featured card */}
            <FadeIn delay={0.08}>
              <div
                className="rounded-2xl border border-border overflow-hidden mb-4 transition-all duration-300 hover:border-indigo-500/25 group"
                style={{ background: "rgba(255,255,255,0.018)" }}
              >
                <div className="h-52 relative">
                  <BusinessThumbnail />
                </div>
                <div className="p-6 border-t border-border">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground/35 uppercase pt-0.5">
                      01 · 2025
                    </span>
                    <span className="font-mono text-[8px] px-2 py-0.5 rounded-full border border-indigo-500/25 text-indigo-400/70 tracking-[0.12em] uppercase">
                      Featured
                    </span>
                  </div>
                  <h3
                    className="text-[19px] font-bold tracking-[-0.015em] text-foreground mb-0.5"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    Business Analyzer
                  </h3>
                  <p className="font-mono text-[10px] text-muted-foreground/45 mb-4">Predictive Financial Analysis</p>
                  <p className="text-[14px] text-foreground/60 italic leading-relaxed mb-3 max-w-[540px]">
                    KPI tracking, revenue forecasting, customer segmentation — all from a CSV upload.
                  </p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[580px] mb-6">
                    Feed in your business numbers and see exactly where you're headed. ML model compares predicted vs. actual performance to surface trends, flag risks, and give you a data-backed view of your business trajectory.
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {["Python", "Machine Learning", "FastAPI", "React", "TypeScript"].map(tag => (
                        <span key={tag} className="font-mono text-[9px] px-2.5 py-1 rounded-full border border-border text-muted-foreground/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <a
                        href="https://github.com/Kanishk1217/business-analysis"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] text-muted-foreground/40 hover:text-muted-foreground transition-colors flex items-center gap-1.5"
                      >
                        <SiGithub className="w-3.5 h-3.5" /> Source
                      </a>
                      <a
                        href="https://business-analysis-3h9.pages.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-mono text-[11px] font-medium text-white transition-all duration-200 hover:opacity-[0.88]"
                        style={{ backgroundColor: "#6366f1" }}
                      >
                        Live Demo <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* 2-col grid */}
            <div className="grid grid-cols-2 gap-4">
              {projects.slice(1).map((p, i) => (
                <FadeIn key={p.num} delay={0.06 + i * 0.1}>
                  <div
                    className="rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:border-indigo-500/20 hover:-translate-y-1 h-full flex flex-col"
                    style={{ background: "rgba(255,255,255,0.018)" }}
                  >
                    <div className="h-40 relative flex-shrink-0"><p.Thumb /></div>
                    <div className="p-5 border-t border-border flex flex-col flex-1">
                      <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground/35 uppercase block mb-1.5">
                        {p.num} · {p.year}
                      </span>
                      <h3
                        className="text-[15px] font-bold tracking-[-0.01em] text-foreground mb-0.5"
                        style={{ fontFamily: "var(--font-syne)" }}
                      >
                        {p.title}
                      </h3>
                      <p className="font-mono text-[10px] text-muted-foreground/45 mb-3">{p.sub}</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed mb-4 flex-1">{p.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.tags.map(tag => (
                          <span key={tag} className="font-mono text-[9px] px-2.5 py-1 rounded-full border border-border text-muted-foreground/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors flex items-center gap-1.5"
                        >
                          <SiGithub className="w-3 h-3" /> Source
                        </a>
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[10px] text-muted-foreground/40 hover:text-foreground transition-colors flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3 h-3" /> Live
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════ SERVICES */}
          <section id="services" className="max-w-[1100px] mx-auto px-8 py-28 border-t border-border">
            <FadeIn className="flex items-baseline justify-between mb-14">
              <h2
                className="text-[34px] font-bold tracking-[-0.022em]"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                How I Can Help
              </h2>
              <Link
                href="/services"
                className="font-mono text-[11px] text-muted-foreground/35 hover:text-muted-foreground transition-colors"
              >
                All services
              </Link>
            </FadeIn>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {services.map((s, i) => (
                <FadeIn key={s.name} delay={i * 0.07}>
                  <div
                    className="rounded-2xl border border-border p-5 flex flex-col gap-4 h-full transition-all duration-200 hover:border-foreground/10"
                    style={{ background: "rgba(255,255,255,0.018)" }}
                  >
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground/35 uppercase mb-2">{s.timeline}</p>
                      <h3
                        className="text-[14px] font-bold tracking-[-0.008em] text-foreground mb-1.5"
                        style={{ fontFamily: "var(--font-syne)" }}
                      >
                        {s.name}
                      </h3>
                      <p className="font-mono text-[12px] font-medium tracking-[-0.01em]" style={{ color: "#6366f1" }}>
                        {s.price}
                      </p>
                    </div>
                    <a
                      href={`mailto:kanishkpansari1217@gmail.com?subject=${encodeURIComponent(s.subject)}`}
                      className="mt-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[10px] font-medium text-white transition-all duration-200 hover:opacity-[0.85]"
                      style={{ backgroundColor: "#6366f1" }}
                    >
                      <Mail className="w-3 h-3" /> Get a Quote
                    </a>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.22} className="text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 font-mono text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                See full service details and pricing <ArrowRight className="w-3 h-3" />
              </Link>
            </FadeIn>
          </section>

          {/* ══════════════════════════════════════ WRITING */}
          <section id="writing" className="max-w-[1100px] mx-auto px-8 py-28 border-t border-border">
            <FadeIn className="flex items-baseline justify-between mb-14">
              <h2
                className="text-[34px] font-bold tracking-[-0.022em]"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                Writing
              </h2>
              <Link
                href="/blog"
                className="font-mono text-[11px] text-muted-foreground/35 hover:text-muted-foreground transition-colors"
              >
                All posts
              </Link>
            </FadeIn>

            <div className="divide-y divide-border">
              {posts.map((post, i) => (
                <motion.a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="group flex items-start gap-8 py-5 hover:opacity-100"
                  style={{ opacity: 0.78 }}
                >
                  <span className="font-mono text-[10px] text-muted-foreground/35 flex-shrink-0 w-20 pt-0.5">
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-foreground leading-snug mb-1 group-hover:text-white transition-colors">
                      {post.title}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground/45 leading-relaxed line-clamp-1">
                      {post.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/25 group-hover:text-muted-foreground flex-shrink-0 mt-0.5 transition-colors" />
                </motion.a>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════ FOOTER */}
          <footer className="max-w-[1100px] mx-auto px-8 py-14 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground/30 mb-1.5 tracking-[0.1em]">
                  Available for projects · Response within 24 hours
                </p>
                <a
                  href="mailto:kanishkpansari1217@gmail.com"
                  className="font-mono text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  kanishkpansari1217@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-5">
                <a
                  href="https://github.com/Kanishk1217"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/35 hover:text-muted-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <SiGithub className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/kanishk-pansari-8b60a2356/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/35 hover:text-muted-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </footer>

          {/* ══════════════════════════════════════ MAGNETIC DOCK */}
          <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <MagneticDock
                items={dockItems}
                iconSize={44}
                showLabels={true}
                magneticDistance={120}
                maxScale={1.45}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
