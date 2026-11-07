"use client"

import { useId, useRef, useState } from "react"
import { Loader2, ArrowRight, Check } from "lucide-react"

const EMAIL = "kanishkpansari1217@gmail.com"

const SERVICES = [
  { value: "ai_chatbot", label: "AI chatbot for my business" },
  { value: "machine_learning", label: "Machine learning and data science" },
  { value: "web_development", label: "Website or web app development" },
  { value: "ai_dashboard", label: "AI dashboards and analytics" },
  { value: "automation", label: "Business automation (email, sheets, WhatsApp)" },
  { value: "other", label: "Something else" },
] as const

type Via = "email" | "phone"
type Status = "idle" | "sending" | "success" | "error" | "limited"
type Errors = Partial<Record<"contact" | "email" | "phone" | "service", string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(via: Via, value: string): string | null {
  const v = value.trim()
  if (!v) return via === "email" ? "Enter your email address." : "Enter your phone number."
  if (via === "email") return EMAIL_RE.test(v) ? null : "That email address does not look right."
  const digits = v.replace(/\D/g, "")
  if (!/^[+\d\s\-()]+$/.test(v) || digits.length < 7 || digits.length > 15)
    return "Enter a phone number with 7 to 15 digits."
  return null
}

const fieldStyle = (invalid: boolean) => ({
  background: "#000",
  border: `1px solid ${invalid ? "#ff8a80" : "#2a2b31"}`,
  color: "#ededed",
  borderRadius: 3,
})

export default function ContactForm() {
  const uid = useId()
  const [via, setVia] = useState<Via>("email")
  const [value, setValue] = useState("")
  const [service, setService] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>("idle")
  const inputRef = useRef<HTMLInputElement>(null)
  const sending = status === "sending"

  function switchVia(next: Via) {
    if (next === via) return
    setVia(next)
    setValue("")
    setErrors({})
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return
    const local = validate(via, value)
    if (local) {
      setErrors({ [via]: local })
      setStatus("idle")
      inputRef.current?.focus()
      return
    }
    setErrors({})
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [via]: value.trim(),
          ...(service ? { service } : {}),
          website: "",
        }),
      })
      if (res.status === 200) {
        setStatus("success")
        return
      }
      if (res.status === 429) {
        setStatus("limited")
        return
      }
      if (res.status === 400) {
        const data = (await res.json().catch(() => null)) as { errors?: Errors } | null
        if (data?.errors && Object.keys(data.errors).length) {
          const { contact, ...rest } = data.errors
          setErrors({ ...rest, ...(contact ? { [via]: contact } : {}) })
          setStatus("idle")
          return
        }
      }
      setStatus("error")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl p-8 max-w-[560px]" style={{ border: "1px solid #1c1d22" }}>
        <div className="flex items-center gap-3 mb-3">
          <Check className="w-4 h-4" style={{ color: "#8fd6a4" }} aria-hidden="true" />
          <p className="text-[22px] leading-none tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, color: "#ededed" }}>
            Got it, thank you.
          </p>
        </div>
        <p className="text-[12px] leading-relaxed" style={{ color: "#aaa" }}>
          I will reply by {via} soon. You do not need to do anything else.
        </p>
      </div>
    )
  }

  const inputId = `${uid}-contact`
  const errId = `${uid}-contact-err`
  const svcId = `${uid}-service`
  const svcErrId = `${uid}-service-err`

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-[560px] flex flex-col gap-8" aria-busy={sending}>
      <fieldset className="min-w-0" disabled={sending}>
        <legend className="text-sm font-medium mb-3" style={{ color: "#bbb" }}>
          How should I reach you?
        </legend>
        <div className="inline-flex p-1 gap-1" style={{ border: "1px solid #2a2b31", borderRadius: 4 }}>
          {(["email", "phone"] as const).map((opt) => (
            <label key={opt} className="cursor-pointer">
              <input type="radio" name={`${uid}-via`} value={opt} checked={via === opt}
                onChange={() => switchVia(opt)} className="peer sr-only" />
              <span className="block px-5 py-2 text-[13px] font-medium transition-colors duration-200 peer-checked:bg-white peer-checked:text-black text-[#bbb] hover:text-[#ededed] peer-checked:hover:text-black peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white"
                style={{ borderRadius: 2 }}>
                {opt === "email" ? "Email" : "Phone"}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={inputId} className="block text-sm font-medium mb-3" style={{ color: "#bbb" }}>
          {via === "email" ? "Your email address" : "Your phone number"}
        </label>
        <input
          key={via}
          ref={inputRef}
          id={inputId}
          name={via}
          type={via === "email" ? "email" : "tel"}
          inputMode={via === "email" ? "email" : "tel"}
          autoComplete={via === "email" ? "email" : "tel"}
          placeholder={via === "email" ? "you@company.com" : "+91 98765 43210"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={sending}
          aria-invalid={!!errors[via]}
          aria-describedby={errors[via] ? errId : undefined}
          className="w-full px-4 py-3 text-[15px] placeholder:text-[#777] transition-colors duration-200 hover:border-[#444] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
          style={fieldStyle(!!errors[via])}
        />
        {errors[via] && (
          <p id={errId} role="alert" className="text-[12px] mt-2" style={{ color: "#ff8a80" }}>{errors[via]}</p>
        )}
      </div>

      <div>
        <label htmlFor={svcId} className="block text-sm font-medium mb-3" style={{ color: "#bbb" }}>
          What do you need?
        </label>
        <select
          id={svcId}
          name="service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          disabled={sending}
          aria-invalid={!!errors.service}
          aria-describedby={errors.service ? svcErrId : undefined}
          className="w-full px-4 py-3 text-[15px] cursor-pointer transition-colors duration-200 hover:border-[#444] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
          style={{ ...fieldStyle(!!errors.service), colorScheme: "dark" }}
        >
          <option value="">Choose one</option>
          {SERVICES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {errors.service && (
          <p id={svcErrId} role="alert" className="text-[12px] mt-2" style={{ color: "#ff8a80" }}>{errors.service}</p>
        )}
      </div>

      {/* Spam trap: off-screen rather than display:none, skipped by keyboard and screen readers. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="flex flex-col gap-4 items-start">
        <button type="submit" disabled={sending}
          className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium cursor-pointer transition-colors duration-200 hover:bg-[#e8e8e8] active:bg-[#d4d4d4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: "#fff", color: "#000", borderRadius: 3 }}>
          {sending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 motion-safe:animate-spin" aria-hidden="true" /> Sending
            </>
          ) : (
            <>
              Send <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </>
          )}
        </button>

        <div aria-live="polite" className="min-h-[1px] w-full">
          {status === "limited" && (
            <p className="text-[12px] leading-relaxed" style={{ color: "#ffcf8a" }}>
              Too many tries from your connection. Please try again in a few minutes.
            </p>
          )}
          {status === "error" && (
            <p className="text-[12px] leading-relaxed" style={{ color: "#ff8a80" }}>
              That did not go through, and it is not your fault. Please email me directly at{" "}
              <a href={`mailto:${EMAIL}`} className="underline underline-offset-4 break-all" style={{ color: "#ededed" }}>{EMAIL}</a>.
            </p>
          )}
        </div>
      </div>
    </form>
  )
}
