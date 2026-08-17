// Mock data for the dashboard UI. Single source of truth until Prisma/Neon
// is wired up — mirrors the shape described in @context/project-overview.md
// §7-8, simplified for display only (e.g. tags and collection membership
// are plain arrays here instead of join tables).

export type ContentType = "TEXT" | "URL" | "FILE";
export type Plan = "FREE" | "PRO";

export interface ItemType {
  id: string;
  name: string;
  slug: string;
  icon: string; // lucide-react icon name
  color: string; // hex
  contentType: ContentType;
  isProOnly: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  isFavorite: boolean;
  defaultTypeId: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  itemTypeId: string;
  contentType: ContentType;
  content?: string; // TEXT items
  language?: string; // syntax highlighting hint
  url?: string; // URL items
  fileName?: string; // FILE items
  fileSize?: number; // bytes
  isFavorite: boolean;
  isPinned: boolean;
  lastUsedAt: string; // ISO date
  tags: string[];
  collectionIds: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  plan: Plan;
}

export const currentUser: User = {
  id: "user-1",
  name: "Dana Okafor",
  email: "dana@example.com",
  plan: "PRO",
};

export const itemTypes: ItemType[] = [
  { id: "type-snippet", name: "Snippet", slug: "snippets", icon: "Code", color: "#3b82f6", contentType: "TEXT", isProOnly: false },
  { id: "type-prompt", name: "Prompt", slug: "prompts", icon: "Sparkles", color: "#8b5cf6", contentType: "TEXT", isProOnly: false },
  { id: "type-command", name: "Command", slug: "commands", icon: "Terminal", color: "#f97316", contentType: "TEXT", isProOnly: false },
  { id: "type-note", name: "Note", slug: "notes", icon: "StickyNote", color: "#fde047", contentType: "TEXT", isProOnly: false },
  { id: "type-link", name: "Link", slug: "links", icon: "Link", color: "#10b981", contentType: "URL", isProOnly: false },
  { id: "type-file", name: "File", slug: "files", icon: "File", color: "#6b7280", contentType: "FILE", isProOnly: true },
  { id: "type-image", name: "Image", slug: "images", icon: "Image", color: "#ec4899", contentType: "FILE", isProOnly: true },
];

export const collections: Collection[] = [
  { id: "col-react-patterns", name: "React Patterns", slug: "react-patterns", description: "Hooks, composition, and rendering tricks", isFavorite: true, defaultTypeId: "type-snippet" },
  { id: "col-interview-prep", name: "Interview Prep", slug: "interview-prep", description: "Algorithms, system design, gotchas", isFavorite: false, defaultTypeId: "type-snippet" },
  { id: "col-ai-prompts", name: "AI Prompts", slug: "ai-prompts", description: "System messages and prompt templates", isFavorite: true, defaultTypeId: "type-prompt" },
  { id: "col-devops-toolbox", name: "DevOps Toolbox", slug: "devops-toolbox", description: "Docker, k8s, and shell commands", isFavorite: false, defaultTypeId: "type-command" },
  { id: "col-reading-list", name: "Reading List", slug: "reading-list", description: "Articles and docs worth revisiting", isFavorite: false, defaultTypeId: "type-link" },
  { id: "col-brand-assets", name: "Brand Assets", slug: "brand-assets", description: "Logos and reference images", isFavorite: false, defaultTypeId: "type-image" },
];

export const items: Item[] = [
  {
    id: "item-1",
    title: "useDebounce hook",
    description: "Debounce a fast-changing value with a configurable delay.",
    itemTypeId: "type-snippet",
    contentType: "TEXT",
    language: "typescript",
    content: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}`,
    isFavorite: true,
    isPinned: true,
    lastUsedAt: "2026-08-16T16:00:00.000Z",
    tags: ["react", "hooks", "typescript"],
    collectionIds: ["col-react-patterns"],
  },
  {
    id: "item-2",
    title: "Senior code reviewer",
    description: "System prompt that reviews diffs for correctness and style.",
    itemTypeId: "type-prompt",
    contentType: "TEXT",
    content: `You are a meticulous senior engineer reviewing a pull request.
Focus on correctness, edge cases, and readability.
Return findings as a bulleted list ordered by severity.`,
    isFavorite: false,
    isPinned: true,
    lastUsedAt: "2026-08-16T13:00:00.000Z",
    tags: ["review", "system-prompt"],
    collectionIds: ["col-ai-prompts"],
  },
  {
    id: "item-3",
    title: "Prune Docker system",
    description: "Reclaim disk by removing dangling images, containers and volumes.",
    itemTypeId: "type-command",
    contentType: "TEXT",
    language: "bash",
    content: "docker system prune --all --volumes --force",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-08-15T18:00:00.000Z",
    tags: ["docker", "cleanup"],
    collectionIds: ["col-devops-toolbox"],
  },
  {
    id: "item-4",
    title: "useLocalStorage hook",
    description: "Persist state to localStorage with an SSR-safe fallback.",
    itemTypeId: "type-snippet",
    contentType: "TEXT",
    language: "typescript",
    content: `export function useLocalStorage<T>(key: string, initial: T) {
  // ...reads/writes JSON to localStorage, guarded for SSR
}`,
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-08-14T09:30:00.000Z",
    tags: ["react", "hooks"],
    collectionIds: ["col-react-patterns"],
  },
  {
    id: "item-5",
    title: "TanStack Query docs",
    description: "Reference docs for data fetching and caching in React.",
    itemTypeId: "type-link",
    contentType: "URL",
    url: "https://tanstack.com/query/latest",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-08-13T11:00:00.000Z",
    tags: ["react", "reference"],
    collectionIds: ["col-react-patterns", "col-reading-list"],
  },
  {
    id: "item-6",
    title: "Binary search template",
    description: "Reusable binary search over a sorted array.",
    itemTypeId: "type-snippet",
    contentType: "TEXT",
    language: "typescript",
    content: `function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}`,
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-08-12T15:00:00.000Z",
    tags: ["algorithms", "arrays"],
    collectionIds: ["col-interview-prep"],
  },
  {
    id: "item-7",
    title: "System design cheat sheet",
    description: "PDF covering load balancing, caching, and sharding basics.",
    itemTypeId: "type-file",
    contentType: "FILE",
    fileName: "system-design-cheatsheet.pdf",
    fileSize: 482_000,
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-08-11T10:00:00.000Z",
    tags: ["system-design", "reference"],
    collectionIds: ["col-interview-prep"],
  },
  {
    id: "item-8",
    title: "Big-O complexity notes",
    description: "Quick reference for common time and space complexities.",
    itemTypeId: "type-note",
    contentType: "TEXT",
    content: `- Array access: O(1)
- Hash map lookup: O(1) average
- Binary search: O(log n)
- Sorting (comparison-based): O(n log n)`,
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-08-10T08:00:00.000Z",
    tags: ["algorithms", "reference"],
    collectionIds: ["col-interview-prep"],
  },
  {
    id: "item-9",
    title: "List running k8s pods",
    description: "Show all pods across namespaces with wide output.",
    itemTypeId: "type-command",
    contentType: "TEXT",
    language: "bash",
    content: "kubectl get pods --all-namespaces -o wide",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-08-09T17:00:00.000Z",
    tags: ["kubernetes"],
    collectionIds: ["col-devops-toolbox"],
  },
  {
    id: "item-10",
    title: "Dockerfile for Next.js",
    description: "Multi-stage Dockerfile for a production Next.js build.",
    itemTypeId: "type-snippet",
    contentType: "TEXT",
    language: "dockerfile",
    content: `FROM node:20-slim AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=build /app ./
CMD ["npm", "start"]`,
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-08-08T12:00:00.000Z",
    tags: ["docker", "nextjs"],
    collectionIds: ["col-devops-toolbox"],
  },
  {
    id: "item-11",
    title: "Prompt engineering guide",
    description: "A practical guide to writing effective prompts.",
    itemTypeId: "type-link",
    contentType: "URL",
    url: "https://docs.claude.com/prompt-engineering",
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-08-07T14:00:00.000Z",
    tags: ["prompts", "guide"],
    collectionIds: ["col-reading-list"],
  },
  {
    id: "item-12",
    title: "Logo pack (dark + light)",
    description: "Primary logo variants for dark and light backgrounds.",
    itemTypeId: "type-image",
    contentType: "FILE",
    fileName: "logo-pack.zip",
    fileSize: 1_250_000,
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-08-06T09:00:00.000Z",
    tags: ["branding"],
    collectionIds: ["col-brand-assets"],
  },
  {
    id: "item-13",
    title: "Regex cheat sheet explainer",
    description: "Explains and rewrites a regex pattern in plain English.",
    itemTypeId: "type-prompt",
    contentType: "TEXT",
    content: `Given a regular expression, explain what it matches in plain
English, then suggest a clearer, equivalent pattern if one exists.`,
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-08-05T16:00:00.000Z",
    tags: ["regex", "explain"],
    collectionIds: ["col-ai-prompts"],
  },
];

// Derived from `items` rather than stored, so it can't drift out of sync.
export function getItemCountByType(itemTypeId: string): number {
  return items.filter((item) => item.itemTypeId === itemTypeId).length;
}
