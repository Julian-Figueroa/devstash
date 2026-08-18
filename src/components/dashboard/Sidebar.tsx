import { SidebarShell } from "@/components/dashboard/SidebarShell";
import { currentUser } from "@/lib/mock-data";
import { CURRENT_USER_ID, getRecentCollections } from "@/lib/db/collections";
import { getSidebarItemTypes } from "@/lib/db/items";

const RECENT_COLLECTIONS_LIMIT = 5;

// Server Component: resolves the sidebar's data (item counts, recent
// collections) and hands it down as plain props. The interactive shell
// (collapse toggle, mobile drawer) is the only part that needs to be a
// Client Component.
export async function Sidebar() {
  const [itemTypesWithCounts, recentCollections] = await Promise.all([
    getSidebarItemTypes(CURRENT_USER_ID),
    getRecentCollections(CURRENT_USER_ID, RECENT_COLLECTIONS_LIMIT),
  ]);

  return (
    <SidebarShell
      itemTypes={itemTypesWithCounts}
      collections={recentCollections}
      currentUser={currentUser}
    />
  );
}
