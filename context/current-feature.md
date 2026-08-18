# Current Feature

Stats & Sidebar

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Initial Next.js + Tailwind CSS setup committed and pushed to GitHub (origin/main)
- Dashboard UI — Phase 1: shadcn/ui init, `/dashboard` route with dark-mode layout, sidebar (DS brand mark + placeholder) and main placeholder, top bar with search and new item/collection buttons (display only)
- Dashboard UI — Phase 2: collapsible sidebar (desktop) with a Sheet-based drawer (always, on mobile); nav links for All Items/Favorites/Recently Used; item type links to `/items/[slug]` with per-type item counts and Pro lock badges; 5 most-recent collections; user avatar area at the bottom
- Dashboard UI — Phase 3: main area with 4 stats cards (items, collections, favorite items, favorite collections), 6 recent collections (dominant-type gradient, type chips, item count), and a pinned + 10-most-recent items grid (type badge, pin/favorite indicators, content preview, tags, relative time); also split `Sidebar`/`TopBar` into Server Components with small Client Component islands (`SidebarShell`, `MobileSidebarTrigger`) for the interactive bits only
- Prisma + Neon PostgreSQL Setup: Prisma 7 schema (User, Account, Session, VerificationToken, ItemType, Item, Collection, ItemCollection, Tag, ItemTag) with indexes and cascade deletes; `prisma-client` generator + `@prisma/adapter-pg` driver adapter, `prisma.config.ts` on the direct Neon connection for migrations, pooled connection for runtime; initial migration seeds the 7 system item types and adds the partial unique index on `ItemType.slug` for system rows; `scripts/test-db.ts` (`npm run db:test`) to verify connectivity; `package.json` marked as an ES module per Prisma 7's ESM client
- Seed Data: `prisma/seed.ts` (`npm run db:seed`, wired into `prisma.config.ts`'s `migrations.seed` for `prisma db seed`) — upserts the demo user (demo@devstash.io, bcryptjs-hashed password, `plan: FREE` — the spec's `isPro: false` maps onto the `Plan` enum already in the schema) and, idempotently, 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with 18 items across snippets/prompts/commands/links using the existing system item types; added `bcryptjs` + `@types/bcryptjs` deps
- Dashboard Collections: `src/lib/db/collections.ts` — `getRecentCollections` and `getCollectionStats`, fetched directly in the (now async) `/dashboard` server component in place of `mock-data.ts`'s `collections` array; dominant type and present-type icons computed from each collection's items via Prisma, falling back to `defaultType` when empty; `CollectionCard` takes the resulting `CollectionSummary` and gains a border tinted by the dominant type (matching `ItemCard`'s pattern) alongside the existing gradient tint; stats cards' Collections/Favorite Collections counts now come from the DB, Items/Favorite Items stay on mock data until items are migrated; temporary `CURRENT_USER_ID` constant (seeded demo user) stands in until auth ships; items grid under the collections left untouched, per spec
- Dashboard Items: `src/lib/db/items.ts` — `getPinnedAndRecentItems` (all pinned items + the 10 most-recently-used unpinned ones, ordered by `lastUsedAt` with `nulls: "last"`, falling back to `createdAt` for display when an item has never been used) and `getItemStats`; `ItemCard` now takes a single `ItemSummary` (icon/border from `item.type`) instead of separate mock `item`/`type` props; `formatRelativeTime` widened to accept a `Date` as well as an ISO string; all four dashboard stats cards and the "N items · N collections" line now read from the DB — `mock-data.ts`'s `items` array is no longer used on the dashboard (sidebar per-type counts are still mock, out of scope for this feature)
- Stats & Sidebar: `src/lib/db/items.ts` gains `getSidebarItemTypes` — system (+ future custom) item types ordered by `sortOrder` with per-user item counts via a filtered Prisma relation count; `Sidebar.tsx` is now an async Server Component fetching item types and the existing `getRecentCollections` in place of `mock-data.ts`'s `itemTypes`/`collections`; `SidebarShell` renders a favorite star or a colored dot (dominant/most-used item type) per collection row, plus a "View all collections" link to `/collections` under the list; `currentUser` stays on mock data until auth ships, out of scope. Confirmed the dashboard's main-area stats cards were already fully DB-backed from the prior Dashboard Items feature — no changes needed there
