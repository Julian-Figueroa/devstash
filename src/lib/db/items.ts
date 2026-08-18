// Data fetching for items, read directly from Prisma/Neon.
// Replaces the mock `items` array in @/lib/mock-data for the dashboard's
// pinned + recent items grid — see @context/features/dashboard-items-spec.md.

import type { ContentType } from "@/generated/prisma/client";
import { db } from "@/lib/db";

export interface ItemTypeSummary {
  id: string;
  name: string;
  slug: string;
  icon: string; // lucide-react icon name
  color: string; // hex
}

export interface ItemSummary {
  id: string;
  title: string;
  description: string | null;
  contentType: ContentType;
  content: string | null; // TEXT items
  url: string | null; // URL items
  fileName: string | null; // FILE items
  fileSize: number | null; // bytes
  isFavorite: boolean;
  isPinned: boolean;
  lastUsedAt: Date;
  tags: string[];
  type: ItemTypeSummary;
}

export interface PinnedAndRecentItems {
  pinned: ItemSummary[];
  recent: ItemSummary[];
}

export interface ItemStats {
  total: number;
  favorites: number;
}

const ITEM_SELECT = {
  id: true,
  title: true,
  description: true,
  contentType: true,
  content: true,
  url: true,
  fileName: true,
  fileSize: true,
  isFavorite: true,
  isPinned: true,
  lastUsedAt: true,
  createdAt: true,
  itemType: {
    select: { id: true, name: true, slug: true, icon: true, color: true },
  },
  tags: { select: { tag: { select: { name: true } } } },
};

type ItemWhere = NonNullable<Parameters<typeof db.item.findMany>[0]>["where"];
type ItemRow = Awaited<ReturnType<typeof fetchItemRows>>[number];

// Most-recently-used first; items that have never been used sort last.
function fetchItemRows(where: ItemWhere, take?: number) {
  return db.item.findMany({
    where,
    orderBy: { lastUsedAt: { sort: "desc", nulls: "last" } },
    take,
    select: ITEM_SELECT,
  });
}

// `lastUsedAt` is nullable (an item may never have been used since
// creation) — fall back to `createdAt` so cards always have a timestamp
// to show, per @context/project-overview.md §7's `Item.lastUsedAt`.
function toItemSummary(item: ItemRow): ItemSummary {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    contentType: item.contentType,
    content: item.content,
    url: item.url,
    fileName: item.fileName,
    fileSize: item.fileSize,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    lastUsedAt: item.lastUsedAt ?? item.createdAt,
    tags: item.tags.map(({ tag }) => tag.name),
    type: item.itemType,
  };
}

/**
 * Pinned items (all of them) and the most-recently-used unpinned items, for
 * the dashboard grid.
 */
export async function getPinnedAndRecentItems(
  userId: string,
  recentLimit = 10
): Promise<PinnedAndRecentItems> {
  const [pinnedRows, recentRows] = await Promise.all([
    fetchItemRows({ userId, isPinned: true }),
    fetchItemRows({ userId, isPinned: false }, recentLimit),
  ]);

  return {
    pinned: pinnedRows.map(toItemSummary),
    recent: recentRows.map(toItemSummary),
  };
}

/** Item counts for the dashboard stats cards. */
export async function getItemStats(userId: string): Promise<ItemStats> {
  const [total, favorites] = await Promise.all([
    db.item.count({ where: { userId } }),
    db.item.count({ where: { userId, isFavorite: true } }),
  ]);

  return { total, favorites };
}

export interface SidebarItemType extends ItemTypeSummary {
  isProOnly: boolean;
  /** Count of the user's items of this type. */
  count: number;
}

/**
 * System item types (plus the user's own custom types, once Phase 4 ships)
 * with per-user item counts, for the sidebar's type list.
 */
export async function getSidebarItemTypes(
  userId: string
): Promise<SidebarItemType[]> {
  const types = await db.itemType.findMany({
    where: { OR: [{ isSystem: true }, { userId }] },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      color: true,
      isProOnly: true,
      _count: { select: { items: { where: { userId } } } },
    },
  });

  return types.map((type) => ({
    id: type.id,
    name: type.name,
    slug: type.slug,
    icon: type.icon,
    color: type.color,
    isProOnly: type.isProOnly,
    count: type._count.items,
  }));
}
