import { FolderKanban, LayoutGrid, Star } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { StatsCards, type Stat } from "@/components/dashboard/StatsCards";
import { collections, itemTypes, items, type Item, type ItemType } from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

const byLastUsedDesc = (a: Item, b: Item) =>
  a.lastUsedAt < b.lastUsedAt ? 1 : -1;

export default function DashboardPage() {
  const stats: Stat[] = [
    { label: "Items", value: items.length, icon: LayoutGrid, color: "#3b82f6" },
    {
      label: "Collections",
      value: collections.length,
      icon: FolderKanban,
      color: "#8b5cf6",
    },
    {
      label: "Favorite Items",
      value: items.filter((item) => item.isFavorite).length,
      icon: Star,
      color: "#f59e0b",
    },
    {
      label: "Favorite Collections",
      value: collections.filter((collection) => collection.isFavorite).length,
      icon: Star,
      color: "#ec4899",
    },
  ];

  const recentCollections = collections.slice(0, RECENT_COLLECTIONS_LIMIT);

  const pinnedItems = items.filter((item) => item.isPinned).sort(byLastUsedDesc);
  const recentItems = items
    .filter((item) => !item.isPinned)
    .sort(byLastUsedDesc)
    .slice(0, RECENT_ITEMS_LIMIT);

  const typeById = new Map(itemTypes.map((type) => [type.id, type]));
  const pinnedAndRecentItems = [...pinnedItems, ...recentItems]
    .map((item) => ({ item, type: typeById.get(item.itemTypeId) }))
    .filter(
      (entry): entry is { item: Item; type: ItemType } => entry.type !== undefined
    );

  return (
    <div className="flex flex-col gap-8">
      <StatsCards stats={stats} />

      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          {items.length} items · {collections.length} collections
        </p>
      </div>

      <section>
        <h3 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Collections
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              items={items}
              itemTypes={itemTypes}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Pinned &amp; Recent
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pinnedAndRecentItems.map(({ item, type }) => (
            <ItemCard key={item.id} item={item} type={type} />
          ))}
        </div>
      </section>
    </div>
  );
}
