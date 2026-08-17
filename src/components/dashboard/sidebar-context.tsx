"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarContextValue {
  /** Desktop collapsed (icon-only) state. */
  collapsed: boolean;
  toggleCollapsed: () => void;
  /** Mobile drawer open state. */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

// Shares sidebar state between the sidebar itself and the top bar's mobile
// menu button, since they're siblings under the dashboard layout.
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggleCollapsed: () => setCollapsed((value) => !value),
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
