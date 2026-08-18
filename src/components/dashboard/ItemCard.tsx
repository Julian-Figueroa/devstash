import Link from "next/link";
import { Pin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatFileSize, formatRelativeTime } from "@/lib/format";
import { getTypeIcon } from "@/lib/item-type-icons";
import type { Item, ItemType } from "@/lib/mock-data";

const VISIBLE_TAGS = 2;

interface ItemCardProps {
  item: Item;
  type: ItemType;
}

const previewClasses =
  "mt-3 line-clamp-2 rounded-md bg-muted px-2.5 py-2 font-mono text-xs text-muted-foreground";

function ItemPreview({ item }: { item: Item }) {
  if (item.contentType === "URL") {
    return <p className={previewClasses}>{item.url}</p>;
  }
  if (item.contentType === "FILE") {
    return (
      <p className={previewClasses}>
        {item.fileName}
        {item.fileSize ? ` · ${formatFileSize(item.fileSize)}` : ""}
      </p>
    );
  }
  return <p className={previewClasses}>{item.content}</p>;
}

// Deep-links into the item drawer per @context/project-overview.md §5 route
// map — `/items/[typeSlug]?item=[id]`.
export function ItemCard({ item, type }: ItemCardProps) {
  const visibleTags = item.tags.slice(0, VISIBLE_TAGS);
  const hiddenTagCount = item.tags.length - visibleTags.length;

  // Resolved in a nested closure rather than a top-level `const Icon = ...`
  // — react-hooks/static-components flags a capitalized variable assigned
  // directly in the render body and used as a JSX tag.
  const renderTypeIcon = () => {
    const Icon = getTypeIcon(type.icon);
    return <Icon className="size-3.5" />;
  };

  return (
    <Link href={`/items/${type.slug}?item=${item.id}`}>
      <Card
        className="h-full justify-between gap-0 border p-4"
        style={{ borderColor: `${type.color}66` }}
      >
        <div>
          <div className="flex items-center justify-between gap-2">
            <span
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase"
              style={{ color: type.color }}
            >
              {renderTypeIcon()}
              {type.name}
            </span>
            <div className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
              {item.isPinned && <Pin className="size-3.5" />}
              {item.isFavorite && (
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
              )}
            </div>
          </div>

          <h3 className="mt-2 font-medium">{item.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
          <ItemPreview item={item} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {visibleTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {hiddenTagCount > 0 && (
              <Badge variant="secondary">+{hiddenTagCount}</Badge>
            )}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeTime(item.lastUsedAt)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
