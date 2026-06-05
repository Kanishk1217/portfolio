import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Services — Kanishk Pansari",
  description: "Custom AI tools and full-stack development. Three clear offers, transparent pricing, 2-week delivery.",
}

const services = [
  {
    name: "Data Intelligence Dashboard",
    price: "$800 – $1,500",
    timeline: "1–2 weeks",
    description:
      "Custom business analytics tool built on your data. Upload a CSV or connect your database and get KPI tracking, revenue forecasting, customer segmentation, and AI-generated insights. Delivered as a live web app.",
    bestFor: "SMBs with sales, ops, or finance data they can't act on",
    subject: "Project Inquiry — Data Intelligence Dashboard",
  },
  {
    name: "Custom AI Agent",
    price: "$1,200 – $2,500",
    timeline: "1–2 weeks",
    description:
      "A scoped AI agent built for one specific workflow. Lead qualifier, support bot, report generator, or data processor. Built with Python and FastAPI, integrated into your existing tools.",
    bestFor: "Businesses with repetitive manual processes eating team time",
    subject: "Project Inquiry — Custom AI Agent",
  },
  {
    name: "Full AI Product Build",
    price: "$3,000 – $6,000",
    timeline: "3–5 weeks",
    description:
      "End-to-end custom product. Full-stack TypeScript frontend, Python backend, database, auth, and deployment. Built for founders who have a product idea but no technical team.",
    bestFor: "Early-stage founders who need a technical partner, not just a contractor",
    subject: "Project Inquiry — Full AI Product Build",
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 h-10 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md">
        <span className="font-mono text-[11px] tracking-widest text-foreground/80 uppercase select-none">
          Kanishk Pansari <span className="text-muted-foreground">/ Services</span>
        </span>
        <Link
          href="/"
          className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Page heading */}
        <div className="mb-12">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground/50 uppercase mb-2">Services</p>
          <h1 className="font-mono text-2xl font-semibold text-foreground mb-3">What I Build</h1>
          <p className="font-mono text-[12px] text-muted-foreground max-w-xl leading-relaxed">
            Custom AI tools and full-stack products. Every engagement starts with your data and ends with something that works in production.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {services.map((service) => (
            <div
              key={service.name}
              className="rounded-xl border border-border p-5 flex flex-col gap-4 transition-all duration-200 hover:border-foreground/15"
              style={{ background: "rgba(255,255,255,0.025)", backdropFilter: "blur(12px)" }}
            >
              <div>
                <p className="font-mono text-[10px] text-muted-foreground/50 mb-2">{service.timeline}</p>
                <h2 className="font-mono text-[13px] font-semibold text-foreground mb-1">{service.name}</h2>
                <p className="font-mono text-[11px]" style={{ color: "#0ea5e9" }}>{service.price}</p>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed flex-1">{service.description}</p>
              <div>
                <p className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-wider mb-1">Best for</p>
                <p className="font-mono text-[10px] text-muted-foreground/70 leading-relaxed">{service.bestFor}</p>
              </div>
              <a
                href={`mailto:kanishkpansari1217@gmail.com?subject=${encodeURIComponent(service.subject)}`}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-mono text-[10px] font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "#0ea5e9" }}
              >
                <Mail className="w-3 h-3" />
                Get a Quote
              </a>
            </div>
          ))}
        </div>

        {/* Retainer strip */}
        <div
          className="rounded-xl border p-6"
          style={{
            background: "rgba(255,255,255,0.015)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <p className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-wider mb-1">Monthly Retainer</p>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h2 className="font-mono text-[13px] font-semibold text-foreground mb-1">Ongoing Support</h2>
              <p className="font-mono text-[11px] mb-3" style={{ color: "#0ea5e9" }}>$300 – $600 / month</p>
              <p className="font-mono text-[10px] text-muted-foreground/70 leading-relaxed max-w-xl">
                Ongoing maintenance, updates, new features, and hosting management for any product I have built. Available to all clients post-delivery.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
