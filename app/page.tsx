import type { Metadata } from "next"
import { getAllPosts } from "@/lib/blog"
import Home from "@/components/home"

const SITE = "https://kanishk-portfolio.pages.dev"
const TITLE = "Kanishk Pansari: Data Science & AI Engineer"
const OG_ALT = "Kanishk Pansari, Data Science & AI Engineer"
const DESCRIPTION =
  "Kanishk Pansari builds AI chatbots, machine learning and data science projects, websites and web apps, AI dashboards, and business automation."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Kanishk Pansari",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: OG_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: OG_ALT }],
  },
}

const EMAIL = "kanishkpansari1217@gmail.com"
const GITHUB = "https://github.com/Kanishk1217"
const LINKEDIN = "https://www.linkedin.com/in/kanishk-pansari-8b60a2356/"

const SERVICES = [
  "AI chatbot for my business",
  "Machine learning and data science",
  "Website or web app development",
  "AI dashboards and analytics",
  "Business automation (email, sheets, WhatsApp)",
]

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: "Kanishk Pansari",
      url: SITE,
      email: EMAIL,
      jobTitle: "Data Science & AI Engineer",
      sameAs: [GITHUB, LINKEDIN],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE}/#service`,
      name: "Kanishk Pansari",
      url: SITE,
      email: EMAIL,
      founder: { "@id": `${SITE}/#person` },
      sameAs: [GITHUB, LINKEDIN],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: SERVICES.map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
    },
  ],
}

// Server shell: reads the MDX frontmatter so the homepage Writing list is the
// same source of truth as /blog. It used to be a hardcoded array here, which had
// silently drifted from the posts (stale dates, slug ordering, edited titles).
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Home posts={getAllPosts()} />
    </>
  )
}
