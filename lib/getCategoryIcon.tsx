import { FaHeadphones, FaMicrophone } from "react-icons/fa";

export const getCategoryIcon = (title: string | undefined) => {
  switch (title) {
    case "headphones":
      return <FaHeadphones />;
    case "microphone":
      return <FaMicrophone />;
    default:
      return null;
  }
  return null;
};
