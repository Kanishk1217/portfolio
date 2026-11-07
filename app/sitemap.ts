import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"

export const dynamic = "force-static"

const SITE = "https://kanishk-portfolio.pages.dev"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((p) => ({ url: `${SITE}/blog/${p.slug}` }))
  return [{ url: SITE }, { url: `${SITE}/services` }, { url: `${SITE}/blog` }, ...posts]
}
