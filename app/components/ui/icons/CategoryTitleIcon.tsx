import { Headphones, Speaker, Mic, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ROOT_CATEGORY_ICONS: Record<string, LucideIcon> = {
  headphones: Headphones,
  "hi-fi-audio": Speaker,
  "studio-equipment": Mic,
  accessories: Package,
};

export default function CategoryTitleIcon({ category }: { category: string }) {
  if (category === "on-sale") return null;
  const Icon = ROOT_CATEGORY_ICONS[category];
  return Icon ? <Icon className="h-6 w-6" /> : null;
}
