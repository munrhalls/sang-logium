import { FaHeadphones, FaMicrophone } from "react-icons/fa";
import { SiAudioboom } from "react-icons/si";
import { TbWaveSawTool } from "react-icons/tb";

export const getCategoryIcon = (title: string | undefined) => {
  switch (title) {
    case "headphones":
      return <FaHeadphones />;
    case "microphone":
      return <FaMicrophone />;
    case "audioboom":
      return <SiAudioboom />;
    case "wave":
      return <TbWaveSawTool />;
    default:
      return null;
  }
  return null;
};
