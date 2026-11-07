"use client"

import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { DottedSurface } from "@/components/dotted-surface"
import { ShimmerText } from "@/components/ui/shimmer-text"

const ADMIN_PASSWORD = "KP@123456"

export default function AdminPage() {
  const router = useRouter()
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = inputRef.current?.value ?? ""
    if (value === ADMIN_PASSWORD) {
      sessionStorage.setItem("kp-admin", "true")
      router.push("/")
    } else {
      setError(true)
      if (inputRef.current) inputRef.current.value = ""
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* z-0 overrides the component's default -z-1 so it renders above the page bg */}
      <DottedSurface className="z-0" />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <div className="text-center space-y-3">
          <ShimmerText
            className="text-4xl font-light tracking-tight text-foreground"
            duration={2.5}
            delay={0.3}
          >
            Admin Access
          </ShimmerText>
          <p className="text-xs font-medium text-muted-foreground/50 ">
            Kanishk Pansari · Portfolio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-64">
          <input
            ref={inputRef}
            type="password"
            placeholder={error ? "Incorrect — try again" : "Password"}
            autoFocus
            autoComplete="off"
            className={`
              w-full text-sm bg-transparent border-b-2 text-center text-foreground
              placeholder:text-muted-foreground/40 outline-none pb-2.5 tracking-widest
              transition-all duration-300
              ${error
                ? "border-red-500/50 placeholder:text-red-400/50"
                : "border-border focus:border-foreground/30"
              }
            `}
          />
          <button
            type="submit"
            className="text-xs font-medium text-muted-foreground/30 hover:text-muted-foreground transition-colors duration-200"
          >
            Enter →
          </button>
        </form>
      </div>
    </div>
  )
}
