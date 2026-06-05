"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SiGithub } from "react-icons/si"

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-8 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <Link href="/" className="font-mono text-[11px] tracking-[0.18em] text-foreground/70 uppercase hover:text-foreground transition-colors select-none">
        Kanishk Pansari
      </Link>

      <nav className="flex items-center gap-7">
        <a href="/#work"     className="font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors">Work</a>
        <a href="/#writing"  className="font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors">Writing</a>
        <Link href="/services" className="font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors">Services</Link>
        <a
          href="https://github.com/Kanishk1217"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="GitHub"
        >
          <SiGithub className="w-[15px] h-[15px]" />
        </a>
      </nav>
    </header>
  )
}
