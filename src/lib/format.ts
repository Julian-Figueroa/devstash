// Display formatting for the dashboard — relative timestamps and file
// sizes. Both are computed at render time, not stored.

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();

  if (diffMs < MINUTE) return "just now";
  if (diffMs < HOUR) return `${Math.floor(diffMs / MINUTE)}m ago`;
  if (diffMs < DAY) return `${Math.floor(diffMs / HOUR)}h ago`;
  if (diffMs < 2 * DAY) return "yesterday";
  if (diffMs < WEEK) return `${Math.floor(diffMs / DAY)}d ago`;
  if (diffMs < 4 * WEEK) return `${Math.floor(diffMs / WEEK)}w ago`;

  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unitIndex]}`;
}
