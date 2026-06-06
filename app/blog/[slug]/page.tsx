import { getPost } from "@/lib/blog"
import { MDXRemote } from "next-mdx-remote/rsc"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Nav from "@/components/nav"

export async function generateStaticParams() {
  const { getAllPosts } = await import("@/lib/blog")
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return { title: `${post.title} | Kanishk Pansari`, description: post.description }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <div style={{ background: "#000", color: "#ededed", minHeight: "100vh" }}>
      <Nav />

      {/* Post header */}
      <header className="max-w-[760px] mx-auto px-8 pt-36 pb-16">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/blog" className="font-mono text-[10px] tracking-[0.15em] uppercase transition-colors hover:text-[#ededed]"
            style={{ color: "#777" }}>
            ← Writing
          </Link>
          <span className="font-mono text-[10px]" style={{ color: "#777" }}>·</span>
          <span className="font-mono text-[10px]" style={{ color: "#777" }}>
            {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {post.tags?.length > 0 && (
          <div className="flex gap-1.5 mb-8">
            {post.tags.map(tag => (
              <span key={tag} className="font-mono text-[9px] px-2.5 py-1 rounded-full"
                style={{ border: "1px solid #1c1d22", color: "#777" }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1
          className="text-[clamp(32px,5vw,56px)] leading-[1.05] tracking-[-0.025em] mb-6"
          style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, color: "#ededed" }}
        >
          {post.title}
        </h1>

        {post.description && (
          <p className="text-[16px] leading-[1.75]" style={{ color: "#999" }}>{post.description}</p>
        )}
      </header>

      {/* Divider */}
      <div className="max-w-[760px] mx-auto px-8">
        <div style={{ height: "1px", background: "#1c1d22" }} />
      </div>

      {/* Post body */}
      <article className="max-w-[760px] mx-auto px-8 py-16">
        <div className="
          prose prose-invert max-w-none
          prose-p:text-[15px] prose-p:leading-[1.85] prose-p:text-[#aaa] prose-p:mb-5
          prose-h2:text-[22px] prose-h2:leading-snug prose-h2:tracking-[-0.015em] prose-h2:text-[#ededed] prose-h2:mt-14 prose-h2:mb-4
          prose-h2:font-normal
          prose-h3:text-[17px] prose-h3:leading-snug prose-h3:text-[#888] prose-h3:mt-10 prose-h3:mb-3 prose-h3:font-normal
          prose-strong:text-[#888] prose-strong:font-medium
          prose-em:text-white
          prose-a:text-[#888] prose-a:underline prose-a:underline-offset-3 hover:prose-a:text-[#ededed]
          prose-code:font-mono prose-code:text-[13px] prose-code:bg-[#0a0a0a] prose-code:border prose-code:border-[#1c1d22] prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#888]
          prose-pre:bg-[#050505] prose-pre:border prose-pre:border-[#1c1d22] prose-pre:rounded-xl
          prose-li:text-[15px] prose-li:text-[#aaa] prose-li:leading-[1.8]
          prose-ul:my-5 prose-ol:my-5
          prose-blockquote:border-l-white/30 prose-blockquote:text-[#aaa] prose-blockquote:italic
        ">
          <MDXRemote source={post.content} />
        </div>
      </article>

      {/* Post footer */}
      <div className="max-w-[760px] mx-auto px-8 pb-28">
        <div className="flex items-center justify-between pt-12" style={{ borderTop: "1px solid #1c1d22" }}>
          <Link href="/blog"
            className="font-mono text-[11px] flex items-center gap-1.5 transition-colors hover:text-[#ededed]"
            style={{ color: "#777" }}>
            ← All posts
          </Link>
          <a href="mailto:kanishkpansari1217@gmail.com"
            className="font-mono text-[11px] transition-colors hover:text-[#ededed]"
            style={{ color: "#777" }}>
            Reply by email →
          </a>
        </div>
      </div>

      <footer className="max-w-[760px] mx-auto px-8 py-10" style={{ borderTop: "1px solid #1c1d22" }}>
        <p className="font-mono text-[10px]" style={{ color: "#aaa" }}>© 2026 Kanishk Pansari</p>
      </footer>
    </div>
  )
}
