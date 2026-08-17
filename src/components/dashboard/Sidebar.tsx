// Placeholder for phase 1 — collapsible nav, type/collection links, and the
// user avatar area land in phase 2.
export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border">
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
          DS
        </span>
        <span className="text-sm font-semibold">DevStash</span>
      </div>
      <div className="flex-1 p-4">
        <h2>Sidebar</h2>
      </div>
    </aside>
  );
}
