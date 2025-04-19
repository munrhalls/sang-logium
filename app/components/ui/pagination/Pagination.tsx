import ArrowLeft from "react-icons/";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Book } from "lucide-react";
import { FaBookOpen } from "react-icons/fa";

const PaginationArrows = function () {
  return (
    <div className="flex gap-3 items-center justify-center">
      <button className="text-xs flex items-center justify-center  font-light uppercase">
        <FaChevronLeft size="10" /> PREVIOUS
      </button>
      <FaBookOpen />
      <button className="text-xs flex items-center justify-center  font-light uppercase ">
        NEXT <FaChevronRight size="10" />
      </button>
    </div>
  );
};
export default function Pagination() {
  return (
    <div className="px-2 flex flex-col bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-3">
        <h1 className="font-black">Page</h1>
        <PaginationArrows />
      </div>
      <div className="flex items-center justify-center">
        <div className="flex flex-nowrap gap-3">
          <button className="text-black">1</button>
          <button className="text-black">2</button>
          <button className="text-black">3</button>
          ...
          <button className="text-black">last</button>
        </div>
      </div>
    </div>
  );
}
