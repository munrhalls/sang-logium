import { FaHeadphones } from "react-icons/fa";
import { Mic2, Radio, Cable, Headset, Speaker } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ROOT_CATEGORY_ICONS: Record<string, LucideIcon | typeof FaHeadphones> = {
  "studio-equipment": Mic2,
  "home-audio": Radio,
  accessories: Cable,
  "personal-audio": Headset,
  speakers: Speaker,
  headphones: FaHeadphones,
};

export default function CategoryTitleIcon({ category }: { category: string }) {
  if (category === "on-sale") return null;
  const Icon = ROOT_CATEGORY_ICONS[category];
  return Icon ? <Icon size={32} strokeWidth={3} /> : null;
}
