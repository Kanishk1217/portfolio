import type { Metadata } from "next"
import Link from "next/link"
import { Mail } from "lucide-react"
import Nav from "@/components/nav"

export const metadata: Metadata = {
  title: "Services: Kanishk Pansari",
  description: "Custom AI tools, cold outreach, profile building, and full-stack development. Transparent pricing, 2-week delivery.",
}

const services = [
  {
    num: "01",
    name: "Data Intelligence Dashboard",
    price: "$800 – $1,500",
    timeline: "1–2 weeks",
    description: "Custom business analytics tool built on your data. Upload a CSV or connect your database and get KPI tracking, revenue forecasting, customer segmentation, and AI-generated insights. Delivered as a live web app.",
    bestFor: "SMBs with sales, ops, or finance data they can't act on.",
    includes: ["CSV / database ingestion", "KPI dashboard", "Revenue forecasting", "Customer segmentation", "Live web app deployment"],
    subject: "Project Inquiry: Data Intelligence Dashboard",
  },
  {
    num: "02",
    name: "Custom AI Agent",
    price: "$1,200 – $2,500",
    timeline: "1–2 weeks",
    description: "A scoped AI agent built for one specific workflow. Lead qualifier, support bot, report generator, or data processor. Built with Python and FastAPI, integrated into your existing tools.",
    bestFor: "Businesses with repetitive manual processes eating team time.",
    includes: ["Scoped workflow automation", "Python + FastAPI backend", "Tool integrations (Slack, email, CRM)", "Deployment + handoff docs"],
    subject: "Project Inquiry: Custom AI Agent",
  },
  {
    num: "03",
    name: "Full AI Product Build",
    price: "$3,000 – $6,000",
    timeline: "3–5 weeks",
    description: "End-to-end custom product. Full-stack TypeScript frontend, Python backend, database, auth, and deployment. Built for founders who have a product idea but no technical team.",
    bestFor: "Early-stage founders who need a technical partner, not just a contractor.",
    includes: ["Full-stack TypeScript + Python", "Database + auth", "Cloudflare / VPS deployment", "2 weeks post-launch support"],
    subject: "Project Inquiry: Full AI Product Build",
  },
  {
    num: "04",
    name: "Cold Email Campaign",
    price: "$600 – $1,200",
    timeline: "1–2 weeks",
    description: "End-to-end outbound engine. Lead list building, personalised sequences, A/B testing, and automated follow-ups. You get daily reply monitoring and a weekly analytics report on opens, clicks, and booked calls.",
    bestFor: "Founders and consultants who need pipeline, not just a form on their website.",
    includes: ["Lead list building & enrichment", "5–7 touch email sequence", "A/B subject line testing", "Automated follow-up logic", "Weekly performance report"],
    subject: "Project Inquiry: Cold Email Campaign",
  },
  {
    num: "05",
    name: "Profile & Brand Building",
    price: "$400 – $800",
    timeline: "1 week",
    description: "LinkedIn optimisation, positioning strategy, and a 30-day content calendar that turns your expertise into inbound leads. We rewrite your profile and build the first month of content.",
    bestFor: "Professionals and founders who need a credible presence before their next raise or launch.",
    includes: ["LinkedIn full rewrite", "Personal positioning statement", "30-day content calendar", "Headline A/B variants", "CTA audit across platforms"],
    subject: "Project Inquiry: Profile & Brand Building",
  },
]

const retainerIncludes = [
  "Bug fixes & updates within 48h",
  "Monthly feature additions",
  "Hosting & uptime management",
  "Weekly status report",
  "Monthly strategy call",
  "Priority support",
]

const process = [
  { step: "01", title: "Discovery call", desc: "30 minutes to understand your data, your goal, and what success looks like." },
  { step: "02", title: "Scoped proposal", desc: "A clear spec with timeline, deliverables, and price. No surprises." },
  { step: "03", title: "Build sprint", desc: "Weekly check-ins. You see real progress, not a black box." },
  { step: "04", title: "Delivery + handoff", desc: "Live product, source code, and a walkthrough. You own everything." },
]

export default function ServicesPage() {
  return (
    <div style={{ background: "#000", color: "#ededed", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-8 pt-36 pb-24">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase mb-10" style={{ color: "#444" }}>Services</p>
        <h1
          className="text-[clamp(52px,7vw,88px)] leading-[0.9] tracking-[-0.03em] mb-8"
          style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}
        >
          What I Build
        </h1>
        <p className="text-[17px] leading-[1.7] max-w-[480px]" style={{ color: "#555" }}>
          Custom AI tools, outbound campaigns, and full-stack products. Every engagement starts with your goal and ends with something that works{" "}
          <em style={{ color: "#cc9166", fontFamily: "var(--font-playfair)" }}>in production</em>.
        </p>
      </section>

      {/* Service list */}
      <section className="max-w-[1200px] mx-auto px-8 pb-0" style={{ borderTop: "1px solid #1c1d22" }}>
        {services.map((s) => (
          <div key={s.num} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 py-16"
            style={{ borderBottom: "1px solid #1c1d22" }}>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-[10px] tracking-[0.18em]" style={{ color: "#555" }}>{s.num}</span>
                <span className="font-mono text-[9px] px-2.5 py-1 rounded-full" style={{ border: "1px solid #1c1d22", color: "#555" }}>
                  {s.timeline}
                </span>
              </div>
              <h2 className="leading-[1.1] tracking-[-0.02em] mb-4"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, color: "#ededed", fontSize: "clamp(24px,3vw,36px)" }}>
                {s.name}
              </h2>
              <p className="font-mono text-[20px] font-medium mb-6" style={{ color: "#cc9166" }}>{s.price}</p>
              <p className="text-[14px] leading-[1.8] mb-6 max-w-[500px]" style={{ color: "#555" }}>{s.description}</p>
              <p className="font-mono text-[11px] mb-8" style={{ color: "#555" }}>
                Best for: <span style={{ color: "#555" }}>{s.bestFor}</span>
              </p>
              <a href={`mailto:kanishkpansari1217@gmail.com?subject=${encodeURIComponent(s.subject)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-[#e8e8e8]"
                style={{ background: "#fff", color: "#000", borderRadius: 3 }}>
                <Mail className="w-3.5 h-3.5" /> Get a Quote
              </a>
            </div>
            <div className="lg:pt-14">
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-4" style={{ color: "#555" }}>Includes</p>
              <div style={{ borderTop: "1px solid #1c1d22" }}>
                {s.includes.map((item, j) => (
                  <div key={j} className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid #1c1d22" }}>
                    <span className="font-mono text-[10px]" style={{ color: "#cc9166" }}>→</span>
                    <span className="font-mono text-[11px]" style={{ color: "#555" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Monthly Retainer Add-On */}
      <section className="max-w-[1200px] mx-auto px-8 py-20" style={{ borderTop: "1px solid #1c1d22" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16 items-start">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase mb-6" style={{ color: "#cc9166" }}>Add-On · Available with any project</p>
            <h2
              className="text-[clamp(32px,4.5vw,52px)] leading-[1.05] tracking-[-0.025em] mb-6"
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}
            >
              Monthly Retainer
            </h2>
            <p className="font-mono text-[28px] font-medium mb-6" style={{ color: "#cc9166" }}>$300 – $600 / month</p>
            <p className="text-[15px] leading-[1.8] mb-8 max-w-[460px]" style={{ color: "#555" }}>
              This is where recurring revenue lives, for both of us. After launch, the product needs to grow. Bug fixes within 48 hours, monthly feature additions, hosting fully managed,
              and a weekly status report. One contact, no hourly billing, no surprises.
            </p>
            <p className="font-mono text-[11px] mb-10" style={{ color: "#333" }}>
              Best for: <span style={{ color: "#555" }}>Businesses that want the product to keep evolving without managing a dev relationship.</span>
            </p>
            <a href="mailto:kanishkpansari1217@gmail.com?subject=Retainer%20Inquiry"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-[#e8e8e8]"
              style={{ background: "#fff", color: "#000", borderRadius: 3 }}>
              <Mail className="w-3.5 h-3.5" /> Discuss Retainer
            </a>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-4" style={{ color: "#333" }}>Includes</p>
            <div style={{ borderTop: "1px solid #1c1d22" }}>
              {retainerIncludes.map((item, j) => (
                <div key={j} className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid #1c1d22" }}>
                  <span className="font-mono text-[10px]" style={{ color: "#cc9166" }}>→</span>
                  <span className="font-mono text-[11px]" style={{ color: "#555" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-[1200px] mx-auto px-8 py-28" style={{ borderTop: "1px solid #1c1d22" }}>
        <h2 className="text-[clamp(32px,4vw,48px)] leading-[1] tracking-[-0.025em] mb-16"
          style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}>
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ border: "1px solid #1c1d22" }}>
          {process.map((p, i) => (
            <div key={p.step} className="px-6 py-8"
              style={{ background: "#000", borderRight: i < 3 ? "1px solid #1c1d22" : "none" }}>
              <p className="font-mono text-[10px] tracking-[0.18em] mb-5" style={{ color: "#555" }}>{p.step}</p>
              <p className="text-[15px] font-medium mb-3" style={{ color: "#ededed" }}>{p.title}</p>
              <p className="text-[13px] leading-relaxed" style={{ color: "#555" }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1200px] mx-auto px-8 py-28" style={{ borderTop: "1px solid #1c1d22" }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-[clamp(32px,4.5vw,52px)] leading-[1] tracking-[-0.025em] mb-4"
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}>
              Ready to start?
            </h2>
            <p className="text-[15px]" style={{ color: "#555" }}>Send a message. I reply within 24 hours.</p>
          </div>
          <a href="mailto:kanishkpansari1217@gmail.com?subject=Project%20Inquiry"
            className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium transition-colors hover:bg-[#e8e8e8] flex-shrink-0"
            style={{ background: "#fff", color: "#000", borderRadius: 3 }}>
            <Mail className="w-3.5 h-3.5" /> kanishkpansari1217@gmail.com
          </a>
        </div>
      </section>

      <footer className="max-w-[1200px] mx-auto px-8 py-10" style={{ borderTop: "1px solid #1c1d22" }}>
        <div className="flex items-center justify-between">
          <Link href="/" className="font-mono text-[11px] transition-colors hover:text-[#ededed]" style={{ color: "#444" }}>
            ← Back to Home
          </Link>
          <p className="font-mono text-[10px]" style={{ color: "#333" }}>© 2026 Kanishk Pansari</p>
        </div>
      </footer>
    </div>
  )
}
