// Populates the database with sample data for development and demos.
// Safe to re-run: the demo user's collections/items/tags are cleared and
// recreated on every run. System item types are seeded by the init
// migration (see project-overview.md §8) — this script only reads them.
// Run with: npm run db:seed
import "dotenv/config";

import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import type { ContentType, ItemType } from "@/generated/prisma/client";

const DEMO_USER_ID = "seed_user_demo";
const PASSWORD_HASH_ROUNDS = 12;

function daysAgo(days: number, hours = 12): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, 0, 0, 0);
  return date;
}

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("12345678", PASSWORD_HASH_ROUNDS);

  const user = await db.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {
      name: "Demo User",
      passwordHash,
      plan: "FREE",
      emailVerified: new Date(),
    },
    create: {
      id: DEMO_USER_ID,
      email: "demo@devstash.io",
      name: "Demo User",
      passwordHash,
      plan: "FREE",
      emailVerified: new Date(),
    },
  });
  console.log(`✔ Demo user ready: ${user.email}`);

  const systemTypes = await db.itemType.findMany({ where: { isSystem: true } });
  const typeBySlug = new Map(systemTypes.map((type) => [type.slug, type]));
  const snippetType = typeBySlug.get("snippets");
  const promptType = typeBySlug.get("prompts");
  const commandType = typeBySlug.get("commands");
  const linkType = typeBySlug.get("links");

  if (!snippetType || !promptType || !commandType || !linkType) {
    throw new Error(
      "System item types not found — run `npm run db:migrate` before seeding."
    );
  }

  // Clear this user's collections/items/tags so the script is idempotent.
  // Item deletion cascades ItemCollection and ItemTag rows.
  await db.item.deleteMany({ where: { userId: user.id } });
  await db.collection.deleteMany({ where: { userId: user.id } });
  await db.tag.deleteMany({ where: { userId: user.id } });

  const tagCache = new Map<string, string>();
  async function tag(name: string): Promise<string> {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const cached = tagCache.get(slug);
    if (cached) return cached;
    const created = await db.tag.create({
      data: { userId: user.id, name, slug },
    });
    tagCache.set(slug, created.id);
    return created.id;
  }

  async function collection(opts: {
    id: string;
    name: string;
    slug: string;
    description: string;
    defaultType: ItemType;
  }) {
    return db.collection.create({
      data: {
        id: opts.id,
        userId: user.id,
        name: opts.name,
        slug: opts.slug,
        description: opts.description,
        defaultTypeId: opts.defaultType.id,
      },
    });
  }

  interface ItemSeed {
    id: string;
    title: string;
    description: string;
    itemType: ItemType;
    content?: string;
    language?: string;
    url?: string;
    tags: string[];
    collectionIds: string[];
    isFavorite?: boolean;
    isPinned?: boolean;
    lastUsedAt?: Date;
  }

  async function item(seed: ItemSeed) {
    const tagIds = await Promise.all(seed.tags.map(tag));
    return db.item.create({
      data: {
        id: seed.id,
        userId: user.id,
        itemTypeId: seed.itemType.id,
        contentType: seed.itemType.contentType as ContentType,
        title: seed.title,
        description: seed.description,
        content: seed.content,
        language: seed.language,
        url: seed.url,
        isFavorite: seed.isFavorite ?? false,
        isPinned: seed.isPinned ?? false,
        lastUsedAt: seed.lastUsedAt,
        collections: {
          create: seed.collectionIds.map((collectionId) => ({ collectionId })),
        },
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
      },
    });
  }

  // ---------- Collections ----------

  const reactPatterns = await collection({
    id: "seed_collection_react_patterns",
    name: "React Patterns",
    slug: "react-patterns",
    description: "Reusable React patterns and hooks",
    defaultType: snippetType,
  });

  const aiWorkflows = await collection({
    id: "seed_collection_ai_workflows",
    name: "AI Workflows",
    slug: "ai-workflows",
    description: "AI prompts and workflow automations",
    defaultType: promptType,
  });

  const devOps = await collection({
    id: "seed_collection_devops",
    name: "DevOps",
    slug: "devops",
    description: "Infrastructure and deployment resources",
    defaultType: commandType,
  });

  const terminalCommands = await collection({
    id: "seed_collection_terminal_commands",
    name: "Terminal Commands",
    slug: "terminal-commands",
    description: "Useful shell commands for everyday development",
    defaultType: commandType,
  });

  const designResources = await collection({
    id: "seed_collection_design_resources",
    name: "Design Resources",
    slug: "design-resources",
    description: "UI/UX resources and references",
    defaultType: linkType,
  });

  console.log("✔ Collections created");

  // ---------- React Patterns (3 snippets) ----------

  await item({
    id: "seed_item_custom_hooks",
    title: "useDebounce & useLocalStorage hooks",
    description: "Debounce a fast-changing value and persist state to localStorage.",
    itemType: snippetType,
    language: "typescript",
    content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initial;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
    tags: ["react", "hooks", "typescript"],
    collectionIds: [reactPatterns.id],
    isFavorite: true,
    isPinned: true,
    lastUsedAt: daysAgo(0, 16),
  });

  await item({
    id: "seed_item_compound_component",
    title: "Compound component pattern",
    description: "Context-driven Tabs component built from composable subcomponents.",
    itemType: snippetType,
    language: "tsx",
    content: `import { createContext, useContext, useState, type ReactNode } from "react";

const TabsContext = createContext<{
  active: string;
  setActive: (id: string) => void;
} | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs.* must be used within <Tabs>");
  return ctx;
}

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }: { children: ReactNode }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Trigger = function TabsTrigger({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabsContext();
  return (
    <button role="tab" aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabsContext();
  return active === id ? <div role="tabpanel">{children}</div> : null;
};`,
    tags: ["react", "patterns", "typescript"],
    collectionIds: [reactPatterns.id],
    lastUsedAt: daysAgo(3),
  });

  await item({
    id: "seed_item_array_utils",
    title: "Array utility functions",
    description: "groupBy, chunk and unique helpers for everyday array wrangling.",
    itemType: snippetType,
    language: "typescript",
    content: `export function groupBy<T, K extends PropertyKey>(items: T[], key: (item: T) => K) {
  return items.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

export function chunk<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, i * size + size)
  );
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}`,
    tags: ["typescript", "utilities"],
    collectionIds: [reactPatterns.id],
    lastUsedAt: daysAgo(5),
  });

  // ---------- AI Workflows (3 prompts) ----------

  await item({
    id: "seed_item_code_review_prompt",
    title: "Senior code reviewer",
    description: "System prompt that reviews a diff for correctness, edge cases and style.",
    itemType: promptType,
    content: `You are a meticulous senior engineer reviewing a pull request.
Focus on correctness, edge cases, security and readability — in that order.
Return findings as a bulleted list ordered by severity, each with a one-line
explanation of the concrete failure scenario. Say nothing if there is nothing
worth flagging.`,
    tags: ["review", "system-prompt"],
    collectionIds: [aiWorkflows.id],
    isFavorite: true,
    isPinned: true,
    lastUsedAt: daysAgo(1),
  });

  await item({
    id: "seed_item_docs_generator_prompt",
    title: "Documentation generator",
    description: "Turns a function or module into clear reference documentation.",
    itemType: promptType,
    content: `Given the following code, write reference documentation: a one-sentence
summary, a parameters table (name, type, description), the return type, and
one realistic usage example. Match the doc style already used elsewhere in
the file if any is shown. Do not invent behavior that isn't in the code.`,
    tags: ["docs", "system-prompt"],
    collectionIds: [aiWorkflows.id],
    lastUsedAt: daysAgo(4),
  });

  await item({
    id: "seed_item_refactor_prompt",
    title: "Refactoring assistant",
    description: "Suggests a minimal, behavior-preserving refactor with rationale.",
    itemType: promptType,
    content: `Review the code below for readability, duplication and unnecessary
complexity. Propose the smallest refactor that meaningfully improves it —
do not change behavior or public interfaces. Explain the reasoning for each
change in one sentence, and skip anything merely stylistic.`,
    tags: ["refactoring", "system-prompt"],
    collectionIds: [aiWorkflows.id],
    lastUsedAt: daysAgo(7),
  });

  // ---------- DevOps (1 snippet, 1 command, 2 links) ----------

  await item({
    id: "seed_item_dockerfile_nextjs",
    title: "Dockerfile for Next.js",
    description: "Multi-stage Dockerfile for a production Next.js build.",
    itemType: snippetType,
    language: "dockerfile",
    content: `FROM node:20-slim AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
CMD ["npm", "start"]`,
    tags: ["docker", "nextjs", "ci-cd"],
    collectionIds: [devOps.id],
    lastUsedAt: daysAgo(2),
  });

  await item({
    id: "seed_item_deploy_script",
    title: "Zero-downtime deploy",
    description: "Build, health-check, then cut traffic over to the new release.",
    itemType: commandType,
    language: "bash",
    content: `npm run build && \\
pm2 reload ecosystem.config.js --update-env && \\
curl -sf https://example.com/health || pm2 rollback`,
    tags: ["deploy", "ci-cd"],
    collectionIds: [devOps.id],
    isPinned: true,
    lastUsedAt: daysAgo(6),
  });

  await item({
    id: "seed_item_docker_docs_link",
    title: "Docker documentation",
    description: "Official Docker reference docs.",
    itemType: linkType,
    url: "https://docs.docker.com/",
    tags: ["docker", "reference"],
    collectionIds: [devOps.id],
    lastUsedAt: daysAgo(8),
  });

  await item({
    id: "seed_item_github_actions_link",
    title: "GitHub Actions documentation",
    description: "Official docs for GitHub Actions workflows and CI/CD.",
    itemType: linkType,
    url: "https://docs.github.com/en/actions",
    tags: ["ci-cd", "reference"],
    collectionIds: [devOps.id],
    lastUsedAt: daysAgo(9),
  });

  console.log("✔ DevOps items created");

  // ---------- Terminal Commands (4 commands) ----------

  await item({
    id: "seed_item_git_undo_commit",
    title: "Undo last commit, keep changes",
    description: "Roll back the last commit but leave the working tree untouched.",
    itemType: commandType,
    language: "bash",
    content: "git reset --soft HEAD~1",
    tags: ["git"],
    collectionIds: [terminalCommands.id],
    isFavorite: true,
    lastUsedAt: daysAgo(0, 9),
  });

  await item({
    id: "seed_item_docker_prune",
    title: "Prune Docker system",
    description: "Reclaim disk by removing dangling images, containers and volumes.",
    itemType: commandType,
    language: "bash",
    content: "docker system prune --all --volumes --force",
    tags: ["docker", "cleanup"],
    collectionIds: [terminalCommands.id],
    lastUsedAt: daysAgo(2, 8),
  });

  await item({
    id: "seed_item_kill_port",
    title: "Kill process on a port",
    description: "Find and kill whatever is holding a given port (e.g. 3000).",
    itemType: commandType,
    language: "bash",
    content: "lsof -ti:3000 | xargs kill -9",
    tags: ["process-management"],
    collectionIds: [terminalCommands.id],
    lastUsedAt: daysAgo(4, 10),
  });

  await item({
    id: "seed_item_clean_install",
    title: "Clean install node_modules",
    description: "Wipe node_modules and the lockfile, then reinstall from scratch.",
    itemType: commandType,
    language: "bash",
    content: "rm -rf node_modules package-lock.json && npm install",
    tags: ["npm", "package-manager"],
    collectionIds: [terminalCommands.id],
    lastUsedAt: daysAgo(5, 14),
  });

  console.log("✔ Terminal Commands items created");

  // ---------- Design Resources (4 links) ----------

  await item({
    id: "seed_item_tailwind_docs",
    title: "Tailwind CSS docs",
    description: "Utility-class reference for Tailwind CSS.",
    itemType: linkType,
    url: "https://tailwindcss.com/docs",
    tags: ["css", "reference"],
    collectionIds: [designResources.id],
    isFavorite: true,
    lastUsedAt: daysAgo(1, 11),
  });

  await item({
    id: "seed_item_shadcn_docs",
    title: "shadcn/ui",
    description: "Composable, accessible component library built on Radix.",
    itemType: linkType,
    url: "https://ui.shadcn.com",
    tags: ["components", "reference"],
    collectionIds: [designResources.id],
    lastUsedAt: daysAgo(3, 13),
  });

  await item({
    id: "seed_item_material_design",
    title: "Material Design 3",
    description: "Google's open-source design system guidelines.",
    itemType: linkType,
    url: "https://m3.material.io/",
    tags: ["design-systems", "reference"],
    collectionIds: [designResources.id],
    lastUsedAt: daysAgo(6, 15),
  });

  await item({
    id: "seed_item_lucide_icons",
    title: "Lucide icons",
    description: "Open-source icon set used throughout DevStash.",
    itemType: linkType,
    url: "https://lucide.dev/icons/",
    tags: ["icons", "reference"],
    collectionIds: [designResources.id],
    lastUsedAt: daysAgo(10, 17),
  });

  console.log("✔ Design Resources items created");

  const [itemCount, collectionCount] = await Promise.all([
    db.item.count({ where: { userId: user.id } }),
    db.collection.count({ where: { userId: user.id } }),
  ]);
  console.log(`🌱 Done — ${itemCount} items across ${collectionCount} collections.`);
}

main()
  .catch((error) => {
    console.error("✘ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
