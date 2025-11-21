import { FaHeadphones } from "react-icons/fa";
import { Mic2, Radio, Cable, Headset, Speaker } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  mic2: Mic2,
  radio: Radio,
  cable: Cable,
  earbuds: Headset,
  speaker: Speaker,
  headphones: FaHeadphones,
};

export const AdaptiveCategoryIcon = ({ title }: { title?: string }) => {
  if (!title) return null;

  const IconComponent = ICON_MAP[title.toLowerCase()];

  if (!IconComponent) return null;

  return <IconComponent size={18} />;
};
