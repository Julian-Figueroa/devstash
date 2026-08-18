# Current Feature

<!-- Feature Name -->

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
