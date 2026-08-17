"use client";

import { FolderPlus, Menu, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/dashboard/sidebar-context";

// Search and the new item/collection buttons are still display only —
// wiring them up is a later phase. The mobile menu button opens the
// sidebar as a drawer, since it's always a drawer below `md`.
export function TopBar() {
  const { setMobileOpen } = useSidebar();

  return (
    <header className="flex items-center gap-4 border-b border-border px-6 py-4">
      <Button
        variant="outline"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu />
        <span className="sr-only">Open sidebar</span>
      </Button>

      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search everything..."
          disabled
          className="h-9 pr-12 pl-8"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="lg" disabled>
          <FolderPlus />
          New Collection
        </Button>
        <Button size="lg" disabled>
          <Plus />
          New Item
        </Button>
      </div>
    </header>
  );
}
