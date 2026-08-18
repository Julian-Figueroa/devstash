"use client";

import Link from "next/link";
import {
  Clock,
  LayoutGrid,
  Lock,
  PanelLeft,
  PanelLeftClose,
  Settings,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSidebar } from "@/components/dashboard/sidebar-context";
import { getTypeIcon } from "@/lib/item-type-icons";
import type { User } from "@/lib/mock-data";
import type { CollectionSummary } from "@/lib/db/collections";
import type { SidebarItemType } from "@/lib/db/items";

const NAV_LINKS = [
  { label: "All Items", href: "/items", icon: LayoutGrid },
  { label: "Favorites", href: "/favorites", icon: Star },
  { label: "Recently Used", href: "/recently-used", icon: Clock },
];

const navLinkClasses = (collapsed: boolean) =>
  cn(
    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground",
    collapsed && "justify-center px-0"
  );

function SidebarBrand() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
      DS
    </span>
  );
}

interface SidebarShellProps {
  itemTypes: SidebarItemType[];
  collections: CollectionSummary[];
  currentUser: User;
}

// A collection row: a star for favorites, otherwise a colored dot for the
// collection's dominant (most-used) item type.
function CollectionLink({ collection }: { collection: CollectionSummary }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="flex items-center gap-2 truncate rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    >
      {collection.isFavorite ? (
        <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
      ) : (
        <span
          className="size-2 shrink-0 rounded-full"
          title={collection.dominantType?.name}
          style={{
            backgroundColor:
              collection.dominantType?.color ?? "var(--muted-foreground)",
          }}
        />
      )}
      <span className="truncate">{collection.name}</span>
    </Link>
  );
}

function SidebarNav({
  collapsed,
  itemTypes,
  collections,
  currentUser,
}: SidebarShellProps & { collapsed: boolean }) {
  const initials = currentUser.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.filter((c) => !c.isFavorite);

  return (
    <>
      <nav className="flex flex-col gap-0.5 p-2">
        {NAV_LINKS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            className={navLinkClasses(collapsed)}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 p-2">
        {!collapsed && (
          <h3 className="px-2.5 pt-2 pb-1 text-xs font-medium text-muted-foreground">
            Types
          </h3>
        )}
        {itemTypes.map((type) => {
          const Icon = getTypeIcon(type.icon);
          return (
            <Link
              key={type.id}
              href={`/items/${type.slug}`}
              title={collapsed ? type.name : undefined}
              className={navLinkClasses(collapsed)}
            >
              <Icon className="size-4 shrink-0" style={{ color: type.color }} />
              {!collapsed && <span className="flex-1">{type.name}</span>}
              {!collapsed && (
                <span className="text-xs tabular-nums text-muted-foreground">
                  {type.count}
                </span>
              )}
              {!collapsed && type.isProOnly && (
                <Lock className="size-3 shrink-0 text-muted-foreground" />
              )}
            </Link>
          );
        })}
      </div>

      {!collapsed && (
        <div className="flex flex-col gap-0.5 p-2">
          <h3 className="px-2.5 pt-2 pb-1 text-xs font-medium text-muted-foreground">
            Collections
          </h3>

          {favoriteCollections.length > 0 && (
            <>
              <h4 className="px-2.5 pt-1 pb-1 text-[11px] font-medium text-muted-foreground">
                Favorites
              </h4>
              {favoriteCollections.map((collection) => (
                <CollectionLink key={collection.id} collection={collection} />
              ))}
            </>
          )}

          {recentCollections.length > 0 && (
            <>
              <h4 className="px-2.5 pt-1 pb-1 text-[11px] font-medium text-muted-foreground">
                Recent
              </h4>
              {recentCollections.map((collection) => (
                <CollectionLink key={collection.id} collection={collection} />
              ))}
            </>
          )}

          <Link
            href="/collections"
            className="rounded-md px-2.5 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            View all collections
          </Link>
        </div>
      )}

      <div
        className={cn(
          "mt-auto flex items-center gap-2.5 border-t border-border p-2.5",
          collapsed && "justify-center"
        )}
      >
        <Avatar size="sm">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {currentUser.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentUser.plan === "PRO" ? "Pro plan" : "Free plan"}
              </p>
            </div>
            <Button variant="ghost" size="icon-sm" title="Settings">
              <Settings className="size-4" />
            </Button>
          </>
        )}
      </div>
    </>
  );
}

// The only client-side piece of the sidebar: collapse/expand state and the
// mobile drawer. Data (item counts, recent collections, user) is resolved
// server-side in Sidebar.tsx and handed down as plain props.
export function SidebarShell(props: SidebarShellProps) {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } =
    useSidebar();

  return (
    <>
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-border transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 border-b border-border px-4 py-4",
            collapsed && "justify-center px-2"
          )}
        >
          <SidebarBrand />
          {!collapsed && (
            <span className="flex-1 text-sm font-semibold">DevStash</span>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={collapsed ? "hidden" : undefined}
          >
            <PanelLeftClose className="size-4" />
          </Button>
        </div>
        {collapsed && (
          <div className="flex justify-center border-b border-border py-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleCollapsed}
              title="Expand sidebar"
            >
              <PanelLeft className="size-4" />
            </Button>
          </div>
        )}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <SidebarNav collapsed={collapsed} {...props} />
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 gap-0 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Browse item types and collections
          </SheetDescription>
          <div className="flex items-center gap-2 border-b border-border px-4 py-4">
            <SidebarBrand />
            <span className="text-sm font-semibold">DevStash</span>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <SidebarNav collapsed={false} {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
