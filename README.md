# Kanishk Pansari — Portfolio

Personal developer portfolio and technical blog. Showcases deployed data tools, full-stack web apps, and client projects. Includes technical writing on machine learning, data engineering, and product builds.

**Live:** https://kanishk-portfolio.pages.dev/

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Content | MDX — blog posts and project write-ups |
| Styling | Tailwind CSS + shadcn/ui |
| Font | Geist (Vercel) |
| Hosting | Cloudflare Pages + Cloudflare Workers |

## Project structure

```
portfolio/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable UI components (shadcn/ui)
├── content/
│   └── blog/         # MDX blog posts
├── lib/              # Utilities — MDX parser, post metadata helpers
└── public/           # Static assets
```

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Writing a blog post

Create a `.mdx` file in `content/blog/` with frontmatter:

```mdx
---
title: "Your post title"
date: "2026-01-01"
description: "One-line summary shown in the post list."
tags: ["tag1", "tag2"]
---

Post content here. MDX supports embedded React components inline.
```

## Deployment

Deployed automatically on push to `main` via Cloudflare Pages GitHub integration.
