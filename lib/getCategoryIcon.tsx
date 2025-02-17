import { FaHeadphones } from "react-icons/fa";
import { Mic2, Radio, Cable, Headphones, Speaker } from "lucide-react";

export const getCategoryIcon = (title: string | undefined) => {
  switch (title?.toLowerCase()) {
    case "mic2":
      return <Mic2 />;
    case "radio":
      return <Radio />;
    case "cable":
      return <Cable />;
    case "earbuds":
      return <Headphones />;
    case "speaker":
      return <Speaker />;
    case "headphones":
      return <FaHeadphones />;
    default:
      return null;
  }
};
