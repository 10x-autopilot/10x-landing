# Agent instructions

- This is a Next.js 16 App Router project. Read the version-matched docs in `node_modules/next/dist/docs/` before using a Next.js API; do not rely on memory.
- Read `DESIGN.md` before any visual or copy change. It defines tokens, motion rules, forbidden words and product-truth rules.
- Content lives in `lib/` (`site-config.ts`, `businesses.ts`, `pricing.ts`, `testimonials.ts`, `faq.ts`). Edit data there, not in JSX.
- Testimonial quotes are verbatim. Never edit them.
- Never present unreleased capabilities as live, and never publish internal roadmap labels (coming soon, rollout, integration-dependent). Route setup-dependent questions to the sales form.
- Public contact is `Sales Team` / `admin@tenx.my` and the company is `BTB SOLUTIONS`. Never add personal or founder phone numbers.
- The page has seven chapters (hero, team, leak, how it works, product demos, pricing and trust, sales contact). Do not add sections. Product demos are simulations with made-up data and must match `docs/CURRENT_FEATURES.md` in the app repo.
- Checks: `npm run typecheck` and `npm run build` must pass.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
