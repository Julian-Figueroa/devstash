// Maps `ItemType.icon` (a lucide-react icon name stored as a string) to the
// actual component. Shared by anything that renders a type badge — the
// sidebar nav, collection cards, item cards.

import {
  Code,
  File,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

export const TYPE_ICONS: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

export function getTypeIcon(icon: string): LucideIcon {
  return TYPE_ICONS[icon] ?? Code;
}
