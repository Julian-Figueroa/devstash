import { SidebarShell } from "@/components/dashboard/SidebarShell";
import {
  collections,
  currentUser,
  getItemCountByType,
  itemTypes,
} from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 5;

// Server Component: resolves the sidebar's data (item counts, recent
// collections) and hands it down as plain props. The interactive shell
// (collapse toggle, mobile drawer) is the only part that needs to be a
// Client Component. Swapping mock-data for Prisma queries later only
// touches this file.
export function Sidebar() {
  const recentCollections = collections.slice(0, RECENT_COLLECTIONS_LIMIT);
  const itemTypesWithCounts = itemTypes.map((type) => ({
    ...type,
    count: getItemCountByType(type.id),
  }));

  return (
    <SidebarShell
      itemTypes={itemTypesWithCounts}
      collections={recentCollections}
      currentUser={currentUser}
    />
  );
}
