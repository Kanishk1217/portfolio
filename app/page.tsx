"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Mail, ExternalLink, MapPin, Phone, Download, PenLine } from "lucide-react"
import { SiPython, SiNumpy, SiPostgresql, SiGit, SiGithub, SiJupyter } from "react-icons/si"
import { Dock } from "@/components/ui/dock-two"
import { ThemeToggle } from "@/components/theme-toggle"
import { ShaderBackground } from "@/components/shader-background"
import { AdminPanel } from "@/components/admin-panel"

// ─── LinkedIn Icon ────────────────────────────────────────────────────────────
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

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
    <div className="w-full h-full bg-card flex items-center justify-center relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" width="100%" height="100%">
        <defs>
          <pattern id="csv-dot" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#csv-dot)" />
      </svg>

      <div className="relative z-10 w-full px-5 space-y-1">
        {/* Header row */}
        <div className="flex gap-1.5 pb-1 border-b border-border/40">
          {headers.map((h, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + ci * 0.06, duration: 0.4 }}
              className="font-mono text-[8px] font-semibold text-foreground/60 flex-1 text-center"
            >
              {h}
            </motion.div>
          ))}
        </div>

        {/* Data rows */}
        {rows.map((row, ri) => (
          <motion.div
            key={ri}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + ri * 0.18, duration: 0.45, ease: "easeOut" }}
            className="flex gap-1.5 py-0.5"
          >
            {row.map((cell, ci) => (
              <div key={ci} className={`font-mono text-[8px] flex-1 text-center ${ci === 0 ? "text-foreground/80" : "text-muted-foreground"}`}>
                {cell}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-foreground/20 pointer-events-none"
        initial={{ top: "20%", opacity: 0 }}
        animate={{ top: ["20%", "85%", "20%"], opacity: [0, 0.6, 0] }}
        transition={{ delay: 1.8, duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
      />
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

  const incomePath = income.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ")
  const expensePath = expense.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ")

  return (
    <div className="w-full h-full bg-card flex flex-col items-center justify-center relative overflow-hidden px-4 gap-2">
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" width="100%" height="100%">
        <defs><pattern id="fin-dot" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="currentColor" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#fin-dot)" />
      </svg>

      <div className="relative z-10 flex gap-4 w-full justify-center mb-1">
        {[{ label: "Income", val: "+₹70k" }, { label: "Expense", val: "₹47k" }, { label: "Saved", val: "₹23k" }].map(({ label, val }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.12 }}
            className="flex flex-col items-center">
            <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest">{label}</span>
            <span className="font-mono text-[11px] font-semibold text-foreground/80">{val}</span>
          </motion.div>
        ))}
      </div>

      <svg className="relative z-10 w-full" viewBox={`0 0 ${w} ${h}`}>
        {[30, 50, 70].map(y => (
          <line key={y} x1={padL} y1={toY(y)} x2={w} y2={toY(y)} stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
        ))}
        <motion.path d={incomePath} fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 0.5, duration: 1.1, ease: "easeInOut" }} />
        <motion.path d={expensePath} fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 0.7, duration: 1.1, ease: "easeInOut" }} />
        {income.map((v, i) => (
          <motion.circle key={i} cx={toX(i)} cy={toY(v)} r="2.5" fill="currentColor" fillOpacity="0.7"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 + i * 0.07, type: "spring", stiffness: 220, damping: 12 }} />
        ))}
        {months.map((m, i) => (
          <text key={m} x={toX(i)} y={h - 4} textAnchor="middle" className="font-mono" fontSize="6" fill="currentColor" fillOpacity="0.3">{m}</text>
        ))}
      </svg>

      <div className="relative z-10 flex gap-3">
        <span className="font-mono text-[8px] text-muted-foreground/40 flex items-center gap-1"><span className="inline-block w-4 border-t border-foreground/40" />Income</span>
        <span className="font-mono text-[8px] text-muted-foreground/40 flex items-center gap-1"><span className="inline-block w-4 border-t border-dashed border-foreground/25" />Expense</span>
      </div>
    </div>
  )
}

function BusinessThumbnail() {
  const bars = [
    { h: 55, y: 105 },
    { h: 85, y: 75 },
    { h: 48, y: 112 },
    { h: 108, y: 52 },
    { h: 72, y: 88 },
  ]
  const linePoints = bars.map((b, i) => `${38 + i * 52},${b.y}`).join(" ")

  return (
    <div className="w-full h-full bg-card flex items-center justify-center relative overflow-hidden">
      <svg className="w-full h-4/5 px-4" viewBox="0 0 270 175">
        {/* Grid lines */}
        {[50, 90, 130, 160].map((y) => (
          <line key={y} x1="0" y1={y} x2="270" y2={y} stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
        ))}

        {/* Bars */}
        {bars.map((b, i) => (
          <motion.rect
            key={i}
            x={20 + i * 52}
            rx="3"
            fill="currentColor"
            fillOpacity={0.15 + i * 0.04}
            initial={{ y: 160, height: 0 }}
            animate={{ y: b.y, height: b.h }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.34, 1.2, 0.64, 1] }}
            width={32}
          />
        ))}

        {/* Trend line */}
        <motion.polyline
          points={linePoints}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ delay: 1.0, duration: 0.9, ease: "easeInOut" }}
        />

        {/* Dots */}
        {bars.map((b, i) => (
          <motion.circle
            key={i}
            cx={38 + i * 52}
            cy={b.y}
            r="3.5"
            fill="currentColor"
            fillOpacity="0.8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2 + i * 0.06, type: "spring", stiffness: 220, damping: 12 }}
          />
        ))}

        {/* Top glow */}
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

// ─── View Project Button ──────────────────────────────────────────────────────
function ViewProjectButton({ href }: { href: string }) {
  return (
    <button
      onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
      className="group relative overflow-hidden inline-flex items-center rounded-md px-4 h-9 bg-card border border-border text-foreground text-[11px] font-mono font-medium cursor-pointer hover:border-foreground/30 transition-colors duration-300"
    >
      <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0 whitespace-nowrap">
        View Project
      </span>
      <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-foreground/[0.07] group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-foreground">
        <ExternalLink size={12} aria-hidden="true" />
      </i>
    </button>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const projects = [
  {
    num: "01",
    title: "CSV File Analyzer",
    sub: "Data Analysis Tool",
    year: "2024",
    metric: "10+ column types · null detection · instant EDA",
    desc: "Upload any CSV and instantly understand everything inside it — column types, distributions, null values, and hidden patterns. No code required. Just clean, actionable insight from your data.",
    tags: ["Python", "Pandas", "Data Analysis", "Visualization"],
    link: "https://csv--analysis.pages.dev/",
    Thumb: CSVThumbnail,
    status: "live" as const,
  },
  {
    num: "02",
    title: "Business Analyzer",
    sub: "Predictive Financial Analysis",
    year: "2025",
    metric: "6 financial KPIs · predicted vs. actual trajectory",
    desc: "Feed in your business numbers and see exactly where you're headed. ML model compares predicted vs. actual performance to surface trends, flag risks, and give you a data-backed view of your business trajectory.",
    tags: ["Python", "Machine Learning", "Scikit-learn", "Financial Data"],
    link: "https://business-analysis-3h9.pages.dev/",
    Thumb: BusinessThumbnail,
    status: "live" as const,
  },
  {
    num: "03",
    title: "FinanceAI",
    sub: "AI-Powered Finance Tracker",
    year: "2026",
    metric: "Plaid bank sync · multi-account · anomaly detection",
    desc: "Connect your real bank via Plaid and let the app surface what matters — spending categories that suddenly spiked, recurring subscriptions you forgot about, and month-over-month trends. Full-stack: React 19 + FastAPI + PostgreSQL.",
    tags: ["React", "FastAPI", "PostgreSQL", "Plaid"],
    link: "https://financial-ai.pages.dev",
    Thumb: FinancialThumbnail,
    status: "live" as "live" | "building",
  },
]

const techSkills = [
  { name: "Python", Icon: SiPython },
  { name: "NumPy", Icon: SiNumpy },
  { name: "SQL", Icon: SiPostgresql },
  { name: "Git", Icon: SiGit },
  { name: "GitHub", Icon: SiGithub },
  { name: "Jupyter", Icon: SiJupyter },
]

const otherSkills = ["Pandas", "Matplotlib", "Scikit-learn", "Machine Learning", "DSA", "Data Visualization", "EDA", "Statistical Analysis"]

const contactLinks = [
  { icon: Mail, label: "kanishkpansari1217@gmail.com", href: "mailto:kanishkpansari1217@gmail.com" },
  { icon: SiGithub, label: "Kanishk1217", href: "https://github.com/Kanishk1217" },
  { icon: Phone, label: "9512782280", href: "tel:9512782280" },
  { icon: MapPin, label: "Ahmedabad, Gujarat", href: null },
]

const education = [
  { title: "Computer Science Engineering", sub: "New LJ Institute of Engineering & Technology", meta: "6th Semester", year: "2022 – 2026" },
  { title: "Engineering Plus — Python & Data Science", sub: "New LJ Institute · Certified", meta: "✓ Completed", year: "2024" },
]

const experience = [
  {
    title: "Sales & Marketing Associate",
    sub: "Analyzed customer behavior data to identify upsell opportunities and track pipeline performance — bridging technical insight with business decisions.",
    year: "2025 – Present",
  },
]

const interests = ["Problem Solving", "Data Analysis", "Karate ◉ Black Belt", "Japanese", "AI & ML"]

// ─── Page ─────────────────────────────────────────────────────────────────────
interface PostMeta { slug: string; title: string; date: string; description: string; tags: string[] }

export default function Home() {
  const [showContent, setShowContent] = useState(false)
  const [latestPost, setLatestPost] = useState<PostMeta | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [bioEditActive, setBioEditActive] = useState(false)
  const bioRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    setLatestPost({
      slug: "building-financeai-when-your-bank-data-becomes-actually-useful",
      title: "Building FinanceAI — When Your Bank Data Becomes Actually Useful",
      date: "2026-05-14",
      description: "Banks already have all your transaction data. The problem isn't capture — it's that the data sits behind clunky interfaces nobody opens twice a month. FinanceAI is what happens when you treat that data as a product instead of a statement.",
      tags: ["React", "FastAPI", "PostgreSQL", "Plaid", "Full-Stack"],
    })
  }, [])

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem("kp-admin") === "true")
  }, [])

  const dockItems = [
    { icon: SiGithub, label: "GitHub", onClick: () => window.open("https://github.com/Kanishk1217", "_blank") },
    { icon: LinkedInIcon, label: "LinkedIn", onClick: () => window.open("https://www.linkedin.com/in/kanishk-pansari-8b60a2356/", "_blank") },
    { icon: Mail, label: "Email", onClick: () => window.open("mailto:kanishkpansari1217@gmail.com") },
    { icon: PenLine, label: "Writing", onClick: () => window.open("/blog", "_self") },
    { icon: Download, label: "Resume", onClick: () => window.open("/resume.pdf", "_blank") },
  ]

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">

      {/* Background — always visible */}
      <ShaderBackground />

      {/* Content — appears after background draws */}
      {showContent && (
        <>
          {/* Top branding bar */}
          <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-20 h-10 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md flex-shrink-0"
          >
            <span className="font-mono text-[11px] tracking-widest text-foreground/80 uppercase select-none">
              Kanishk Pansari <span className="text-muted-foreground">/ Portfolio</span>
            </span>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full border border-foreground/20 text-foreground/50">
                    Admin
                  </span>
                  <button
                    onClick={() => { sessionStorage.removeItem("kp-admin"); setIsAdmin(false) }}
                    className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/30 hover:text-muted-foreground transition-colors"
                  >
                    Exit
                  </button>
                </div>
              )}
              <ThemeToggle />
            </div>
          </motion.header>

          {/* 3-column grid */}
          <main className="relative z-10 flex-1 overflow-hidden grid grid-cols-[260px_1fr_300px]">

            {/* ── LEFT: ABOUT ── */}
            <motion.aside
              id="col-about"
              initial={{ opacity: 0, x: -48 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full overflow-y-auto border-r border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-5 py-3">
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">About</p>
              </div>
              <div className="px-5 pt-5 pb-28 space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <p className="font-mono text-sm font-semibold text-foreground">Kanishk Pansari</p>
                  <p className="font-mono text-[11px] text-muted-foreground mt-1 leading-relaxed">I build custom AI tools that turn your business data into decisions — shipped in 2 weeks.</p>
                  <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">Ahmedabad, India</p>
                </motion.div>


                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34 }}
                  className="flex gap-2 pt-1"
                >
                  <a
                    href="mailto:kanishkpansari1217@gmail.com?subject=Project%20Inquiry"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[10px] font-semibold text-white transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: '#0ea5e9' }}
                  >
                    <Mail className="w-3 h-3" />
                    Work With Me
                  </a>
                  <button
                    onClick={() => document.getElementById('col-work')?.scrollTo({ behavior: 'smooth', top: 0 })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[10px] font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer"
                  >
                    View My Work
                  </button>
                </motion.div>
                <motion.p
                  ref={bioRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 }}
                  contentEditable={bioEditActive}
                  suppressContentEditableWarning
                  className={`text-xs text-muted-foreground leading-relaxed outline-none transition-all duration-200 ${
                    bioEditActive ? "border border-dashed border-foreground/20 rounded-md p-2 -mx-2" : ""
                  }`}
                >
                  I build data products that work in production — live tools with real users, not notebooks that live on my machine. My work spans the full data lifecycle: ingestion, cleaning, modeling, and user-facing analytics, built with Python, SQL, Pandas, and Scikit-learn. What makes my profile different is direct experience at the intersection of data and business — working on the technical side of Sales & Marketing gives me the context to understand what a metric needs to drive before I write the first query. Open to Data Analyst and Data Engineering roles.
                </motion.p>

                {latestPost && (
                  <motion.a
                    href={`/blog/${latestPost.slug}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.42 }}
                    className="group block rounded-lg border border-border bg-card/50 px-4 py-3 hover:border-foreground/20 hover:bg-card transition-all duration-200"
                  >
                    <p className="font-mono text-[9px] tracking-widest text-muted-foreground/40 uppercase mb-1.5">Latest Writing</p>
                    <p className="font-mono text-[11px] font-medium text-foreground leading-snug group-hover:text-foreground mb-1">
                      {latestPost.title}
                    </p>
                    <p className="font-mono text-[9px] text-muted-foreground/50 leading-relaxed line-clamp-2">
                      {latestPost.description}
                    </p>
                    <p className="font-mono text-[9px] text-muted-foreground/30 mt-2">
                      {new Date(latestPost.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} →
                    </p>
                  </motion.a>
                )}

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase mb-2">Contact</p>
                  {(contactLinks as { icon: React.ElementType; label: string; href: string | null }[]).map(({ icon: Icon, label, href }) => (
                    <div key={label} className="flex items-center gap-2.5 py-2.5 border-b border-border last:border-0">
                      <Icon className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors truncate">{label}</a>
                      ) : (
                        <span className="font-mono text-[10px] text-muted-foreground">{label}</span>
                      )}
                    </div>
                  ))}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}>
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase mb-3">Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {interests.map((tag) => (
                      <span key={tag} className="font-mono text-[9px] px-2 py-1 rounded border border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground transition-all duration-200 cursor-default">{tag}</span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.aside>

            {/* ── CENTER: WORK ── */}
            <motion.section
              id="col-work"
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full overflow-y-auto border-r border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between">
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Work</p>
                <p className="font-mono text-[10px] text-muted-foreground">2024 – 2025</p>
              </div>
              <div className="px-6 pt-6 pb-28 space-y-8">
                {projects.map((project, i) => (
                  <motion.div key={project.num} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.15, duration: 0.5, ease: "easeOut" }}>
                    <div className="rounded-lg border border-border overflow-hidden bg-card">
                      <div className="h-44 relative"><project.Thumb /></div>
                      <div className="p-5 border-t border-border">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-mono text-[9px] text-muted-foreground/50 tracking-widest uppercase">{project.num} / 03 · {project.year}</p>
                          {project.status === "building" && (
                            <span className="font-mono text-[8px] px-2 py-0.5 rounded-full border border-border text-muted-foreground/60 tracking-widest uppercase">Building</span>
                          )}
                        </div>
                        <h3 className="font-mono text-sm font-semibold text-foreground mb-0.5">{project.title}</h3>
                        <p className="font-mono text-[10px] text-muted-foreground mb-1">{project.sub}</p>
                        <p className="font-mono text-[9px] text-muted-foreground/40 mb-3">{project.metric}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{project.desc}</p>
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {project.tags.map((tag) => (
                            <span key={tag} className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{tag}</span>
                          ))}
                        </div>
                        {project.status === "live" && <ViewProjectButton href={project.link} />}
                        {project.status === "building" && (
                          <span className="font-mono text-[10px] text-muted-foreground/40">In progress — link coming soon</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── RIGHT: CV ── */}
            <motion.aside
              id="col-cv"
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.34, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-5 py-3">
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">CV</p>
              </div>
              <div className="px-5 pt-5 pb-28 space-y-8">

                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase mb-3">Tech Stack</p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {techSkills.map(({ name, Icon }, i) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.08, y: -3 }}
                        transition={{ delay: 0.5 + i * 0.06, type: "spring", stiffness: 160 }}
                        className="flex flex-col items-center gap-1.5 py-3 rounded-lg border border-border cursor-default group"
                        style={{ transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s" }}
                        onMouseEnter={e => {
                          const el = e.currentTarget
                          el.style.borderColor = "rgba(255,255,255,0.25)"
                          el.style.boxShadow = "0 0 16px rgba(255,255,255,0.06)"
                          el.style.background = "rgba(255,255,255,0.04)"
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget
                          el.style.borderColor = ""
                          el.style.boxShadow = ""
                          el.style.background = ""
                        }}
                      >
                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                        <span className="font-mono text-[8px] text-muted-foreground/50 group-hover:text-foreground/80 transition-colors duration-200">{name}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {otherSkills.map((skill, i) => (
                      <motion.span key={skill} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + i * 0.04 }}
                        className="font-mono text-[9px] px-2 py-1 rounded border border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground transition-all duration-200 cursor-default">
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}>
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase mb-3">Education</p>
                  {education.map((entry, i) => (
                    <div key={i} className="py-3 border-b border-border last:border-0">
                      <p className="font-mono text-[11px] font-semibold text-foreground leading-snug">{entry.title}</p>
                      <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{entry.sub}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="font-mono text-[9px] text-muted-foreground/50">{entry.meta}</span>
                        <span className="font-mono text-[9px] text-muted-foreground/50">{entry.year}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.62 }}>
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase mb-3">Experience</p>
                  {experience.map((entry, i) => (
                    <div key={i} className="py-3 border-b border-border last:border-0">
                      <p className="font-mono text-[11px] font-semibold text-foreground">{entry.title}</p>
                      <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{entry.sub}</p>
                      <p className="font-mono text-[9px] text-muted-foreground/50 mt-1.5">{entry.year}</p>
                    </div>
                  ))}
                </motion.div>

              </div>
            </motion.aside>

          </main>

          {/* Admin Panel */}
          {isAdmin && (
            <AdminPanel
              onBioEdit={() => setBioEditActive(v => !v)}
              bioEditActive={bioEditActive}
              onBioSave={() => {
                setBioEditActive(false)
              }}
            />
          )}

          {/* Floating Dock */}
          <motion.nav
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
          >
            <div className="pointer-events-auto">
              <Dock items={dockItems} />
            </div>
          </motion.nav>
        </>
      )}

    </div>
  )
}
