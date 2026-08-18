import Link from "next/link";
import { Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getTypeIcon } from "@/lib/item-type-icons";
import type { CollectionSummary } from "@/lib/db/collections";

interface CollectionCardProps {
  collection: CollectionSummary;
}

// Background tint and type chips are derived from the collection's items
// rather than stored, per @context/project-overview.md §4-B — an empty
// collection falls back to `defaultTypeId`.
export function CollectionCard({ collection }: CollectionCardProps) {
  const { dominantType, presentTypes, itemCount } = collection;

  return (
    <Link href={`/collections/${collection.slug}`}>
      <Card
        className="h-full justify-between gap-3 border p-4 transition-colors hover:ring-foreground/20"
        style={{
          borderColor: dominantType ? `${dominantType.color}66` : undefined,
          backgroundImage: dominantType
            ? `linear-gradient(180deg, ${dominantType.color}26 0%, transparent 65%)`
            : undefined,
        }}
      >
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium">{collection.name}</h3>
            {collection.isFavorite && (
              <Star className="size-4 shrink-0 fill-amber-400 text-amber-400" />
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {collection.description}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex gap-1.5">
            {presentTypes.map((type) => {
              const Icon = getTypeIcon(type.icon);
              return (
                <span
                  key={type.id}
                  title={type.name}
                  className="flex size-6 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${type.color}26`, color: type.color }}
                >
                  <Icon className="size-3.5" />
                </span>
              );
            })}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </Card>
    </Link>
  );
}
