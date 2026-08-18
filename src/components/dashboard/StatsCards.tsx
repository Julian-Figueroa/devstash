import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

export interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
}

export function StatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="flex-row items-center gap-3 p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="size-4.5" />
          </span>
          <div className="min-w-0">
            <p className="text-xl font-semibold tabular-nums">{value}</p>
            <p className="truncate text-xs text-muted-foreground">{label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
