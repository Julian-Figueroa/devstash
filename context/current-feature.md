# Current Feature

<!-- Feature Name -->

Prisma + Neon PostgreSQL Setup

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

- Set up Prisma ORM (v7) with Neon PostgreSQL (serverless) as the database
- Create the initial schema based on the data models in `context/project-overview.md` §7–8 (User, Account, Session, VerificationToken, ItemType, Item, Collection, ItemCollection, Tag, ItemTag) — expected to evolve as features are built
- Include NextAuth/Auth.js models: `Account`, `Session`, `VerificationToken`
- Add appropriate indexes and cascade deletes per the schema in the spec
- Follow Prisma 7 breaking changes: `prisma-client` generator (not `prisma-client-js`), driver adapter (`@prisma/adapter-pg`) required, no `url` in the `datasource` block, connection string moved to `prisma.config.ts`, explicit `prisma generate` (no postinstall hook)
- Use Neon's pooled connection string at runtime (`DATABASE_URL`) and the direct connection string for migrations (`DIRECT_DATABASE_URL`)
- Always use migrations (`prisma migrate dev`), never `prisma db push` — dev branch feeds `DATABASE_URL`, separate production branch for prod

## Notes

<!-- Any extra notes -->

- Reference spec: `context/features/database-spec.md`
- Read the full Prisma 7 upgrade guide before implementing: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Prisma Postgres quickstart for reference: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
- System item types (Snippet, Prompt, Command, Note, Link, File, Image) should be seeded via migration, not app code, per §8 of `project-overview.md`

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Initial Next.js + Tailwind CSS setup committed and pushed to GitHub (origin/main)
- Dashboard UI — Phase 1: shadcn/ui init, `/dashboard` route with dark-mode layout, sidebar (DS brand mark + placeholder) and main placeholder, top bar with search and new item/collection buttons (display only)
- Dashboard UI — Phase 2: collapsible sidebar (desktop) with a Sheet-based drawer (always, on mobile); nav links for All Items/Favorites/Recently Used; item type links to `/items/[slug]` with per-type item counts and Pro lock badges; 5 most-recent collections; user avatar area at the bottom
- Dashboard UI — Phase 3: main area with 4 stats cards (items, collections, favorite items, favorite collections), 6 recent collections (dominant-type gradient, type chips, item count), and a pinned + 10-most-recent items grid (type badge, pin/favorite indicators, content preview, tags, relative time); also split `Sidebar`/`TopBar` into Server Components with small Client Component islands (`SidebarShell`, `MobileSidebarTrigger`) for the interactive bits only
