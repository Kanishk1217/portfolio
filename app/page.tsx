import { getAllPosts } from "@/lib/blog"
import Home from "@/components/home"

// Server shell: reads the MDX frontmatter so the homepage Writing list is the
// same source of truth as /blog. It used to be a hardcoded array here, which had
// silently drifted from the posts (stale dates, slug ordering, edited titles).
export default function Page() {
  return <Home posts={getAllPosts()} />
}
