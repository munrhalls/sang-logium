import { FaHeadphones } from "react-icons/fa";
import { Mic2, Radio, Cable, Headset, Speaker, HelpCircle } from "lucide-react";

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

  const IconComponent = (title && ICON_MAP[title.toLowerCase()]) || HelpCircle;

  return <IconComponent size={18} />;
};
