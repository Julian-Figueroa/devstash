# Devstash

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Stack

- Next.js 16.3.1 (App Router) + React 19.2.8 + TypeScript, styled with Tailwind CSS v4 (CSS-based config via `@tailwindcss/postcss` — there is no `tailwind.config.js`; theme/config lives in `src/app/globals.css`).
- All app code lives under `src/app/`. The `@/*` import alias maps to `./src/*`.

## Commands

- `npm run dev` / `npm run build` / `npm run start` — standard Next.js scripts.
- `npm run lint` — ESLint via `eslint-config-next` (`core-web-vitals` + `typescript` configs).
- No test suite and no code formatter (Prettier/Biome) are configured yet.
