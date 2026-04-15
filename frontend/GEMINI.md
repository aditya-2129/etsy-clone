# ♊ Gemini Instructions — Etsy Clone

This file contains specific instructions for the Gemini model to utilize the MCP servers and development standards active in this project.

## 🛠️ MCP Server Integration

Gemini MUST utilize the following MCP tools for all operations:mcomc

### Data & Infrastructure

- **Appwrite Docs**: Reach into `appwrite-docs` for all API calls. Avoid halluncinations by verifying collection/document methods.
- **Docker**: Use `docker` server to monitor the local Appwrite instance.
- **Vercel**: Manage deployment and env variables.

### Logic & Planning

- **Sequential Thinking**: Always use this to break down complex features (e.g., "Seller Shop Onboarding").
- **Fetch**: Use this to read external documentation for `Tailwind`, `Framer Motion`, or `React` if my internal knowledge is stale.

### UI & Styling

- **Shadcn**: Use `shadcn` MCP to find and retrieve the correct component code before implementing.
- **Next DevTools**: Inspect the component tree to avoid unnecessary client component conversions.
- **Stitch / Chrome DevTools**: Use for visual verification and performance audits.

---

## 🎨 Design System Enforcement

All styles MUST use the defined design tokens in `globals.css` via the `[var(--token)]` pattern.

**Priority Checklist:**

1. Is it responsive? (md:, lg:)
2. Does it handle loading/error states?
3. Is it documented in `AGENTS.md`?
4. Did I use `sequential-thinking` for planning?
