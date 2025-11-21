import { FaHeadphones } from "react-icons/fa";
import { Mic2, Radio, Cable, Headset, Speaker } from "lucide-react";
export const AdaptiveCategoryIcon = (title: string | undefined) => {
  const iconSize = 18;
  switch (title?.toLowerCase()) {
    case "mic2":
      return <Mic2 size={iconSize} />;
    case "radio":
      return <Radio size={iconSize} />;
    case "cable":
      return <Cable size={iconSize} />;
    case "earbuds":
      return <Headset size={iconSize} />;
    case "speaker":
      return <Speaker size={iconSize} />;
    case "headphones":
      return <FaHeadphones size={iconSize} />;
    default:
      return null;
  }
};
