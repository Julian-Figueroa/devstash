"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/dashboard/sidebar-context";

// Opens the sidebar as a drawer on mobile — the only interactive piece of
// the top bar, split out so TopBar itself can stay a Server Component.
export function MobileSidebarTrigger() {
  const { setMobileOpen } = useSidebar();

  return (
    <Button
      variant="outline"
      size="icon"
      className="md:hidden"
      onClick={() => setMobileOpen(true)}
    >
      <Menu />
      <span className="sr-only">Open sidebar</span>
    </Button>
  );
}
