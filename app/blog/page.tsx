import Link from "next/link"
import { getAllPosts } from "@/lib/blog"
import type { Metadata } from "next"
import Nav from "@/components/nav"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Writing — Kanishk Pansari",
  description: "Thoughts on data, engineering, and building things.",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div style={{ background: "#000", color: "#ededed", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-8 pt-36 pb-20">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase mb-10" style={{ color: "#444" }}>Writing</p>
        <h1
          className="text-[clamp(52px,7vw,88px)] leading-[0.9] tracking-[-0.03em] mb-8"
          style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}
        >
          Thinking out loud
        </h1>
        <p className="font-mono text-[11px]" style={{ color: "#555" }}>
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </section>

      {/* Post list */}
      <section className="max-w-[1200px] mx-auto px-8 pb-28" style={{ borderTop: "1px solid #1c1d22" }}>
        {posts.length === 0 ? (
          <p className="font-mono text-[13px] pt-12" style={{ color: "#444" }}>No posts yet. First one coming soon.</p>
        ) : (
          posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-start justify-between gap-8 py-8 pl-0 hover:pl-2 transition-all duration-200"
              style={{ borderBottom: "1px solid #1c1d22" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-6 mb-3">
                  <span className="font-mono text-[10px]" style={{ color: "#555" }}>
                    {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  {post.tags?.length > 0 && (
                    <div className="flex gap-1.5">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="font-mono text-[8px] px-2 py-0.5 rounded-full"
                          style={{ border: "1px solid #1c1d22", color: "#333" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <h2 className="text-[18px] leading-[1.2] tracking-[-0.01em] mb-2 transition-colors duration-200 group-hover:text-white"
                  style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, color: "#888" }}>
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-[13px] leading-relaxed" style={{ color: "#444" }}>{post.description}</p>
                )}
              </div>
              <ArrowRight className="w-4 h-4 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1"
                style={{ color: "#555" }} />
            </Link>
          ))
        )}
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
