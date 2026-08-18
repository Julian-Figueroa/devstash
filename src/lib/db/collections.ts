// Data fetching for collections, read directly from Prisma/Neon.
// Replaces the mock `collections` array in @/lib/mock-data for the
// dashboard's collections grid — see @context/features/dashboard-collections-spec.md.

import { db } from "@/lib/db";

// TODO: replace with the session user once auth ships (see
// @context/project-overview.md §13, Auth.js note). Matches the demo user
// id seeded by `prisma/seed.ts`.
export const CURRENT_USER_ID = "seed_user_demo";

export interface CollectionTypeSummary {
  id: string;
  name: string;
  icon: string; // lucide-react icon name
  color: string; // hex
}

export interface CollectionSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  /** Item type most represented in the collection; falls back to the
   *  collection's `defaultType` when it has no items yet. */
  dominantType: CollectionTypeSummary | null;
  /** All item types present in the collection, most-represented first. */
  presentTypes: CollectionTypeSummary[];
}

export interface CollectionStats {
  total: number;
  favorites: number;
}

/**
 * Most-recently-updated collections for the dashboard grid.
 *
 * Dominant type and border colour are derived from the collection's items
 * rather than stored, per @context/project-overview.md §4-B — an empty
 * collection falls back to `defaultTypeId`.
 */
export async function getRecentCollections(
  userId: string,
  limit = 6
): Promise<CollectionSummary[]> {
  const collections = await db.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      defaultType: {
        select: { id: true, name: true, icon: true, color: true },
      },
      items: {
        select: {
          item: {
            select: {
              itemType: {
                select: { id: true, name: true, icon: true, color: true },
              },
            },
          },
        },
      },
    },
  });

  return collections.map((collection) => {
    const typeCounts = new Map<
      string,
      { count: number; type: CollectionTypeSummary }
    >();
    for (const { item } of collection.items) {
      const type = item.itemType;
      const entry = typeCounts.get(type.id);
      if (entry) entry.count += 1;
      else typeCounts.set(type.id, { count: 1, type });
    }

    const presentTypes = [...typeCounts.values()]
      .sort((a, b) => b.count - a.count)
      .map((entry) => entry.type);

    const dominantType = presentTypes[0] ?? collection.defaultType ?? null;

    return {
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      dominantType,
      presentTypes,
    };
  });
}

/** Collection counts for the dashboard stats cards. */
export async function getCollectionStats(
  userId: string
): Promise<CollectionStats> {
  const [total, favorites] = await Promise.all([
    db.collection.count({ where: { userId } }),
    db.collection.count({ where: { userId, isFavorite: true } }),
  ]);

  return { total, favorites };
}
