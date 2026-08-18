import { FolderKanban, LayoutGrid, Star } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { StatsCards, type Stat } from "@/components/dashboard/StatsCards";
import {
  CURRENT_USER_ID,
  getCollectionStats,
  getRecentCollections,
} from "@/lib/db/collections";
import { getItemStats, getPinnedAndRecentItems } from "@/lib/db/items";

const RECENT_COLLECTIONS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

export default async function DashboardPage() {
  const [collectionStats, recentCollections, itemStats, { pinned, recent }] =
    await Promise.all([
      getCollectionStats(CURRENT_USER_ID),
      getRecentCollections(CURRENT_USER_ID, RECENT_COLLECTIONS_LIMIT),
      getItemStats(CURRENT_USER_ID),
      getPinnedAndRecentItems(CURRENT_USER_ID, RECENT_ITEMS_LIMIT),
    ]);

  const stats: Stat[] = [
    { label: "Items", value: itemStats.total, icon: LayoutGrid, color: "#3b82f6" },
    {
      label: "Collections",
      value: collectionStats.total,
      icon: FolderKanban,
      color: "#8b5cf6",
    },
    {
      label: "Favorite Items",
      value: itemStats.favorites,
      icon: Star,
      color: "#f59e0b",
    },
    {
      label: "Favorite Collections",
      value: collectionStats.favorites,
      icon: Star,
      color: "#ec4899",
    },
  ];

  // Pinned items first, then most-recently-used unpinned items. If there
  // are no pinned items, `pinned` is simply empty — nothing extra to render.
  const pinnedAndRecentItems = [...pinned, ...recent];

  return (
    <div className="flex flex-col gap-8">
      <StatsCards stats={stats} />

      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          {itemStats.total} items · {collectionStats.total} collections
        </p>
      </div>

      <section>
        <h3 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Collections
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Pinned &amp; Recent
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pinnedAndRecentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
