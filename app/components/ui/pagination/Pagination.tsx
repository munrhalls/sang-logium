"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductsPerPageDropdown from "./ProductsPerPageDropdown";
import generatePageNumbers from "./generatePageNumbers";

const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_PAGE = 1;

export default function Pagination({ totalProductsCount }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  if (totalProductsCount === undefined) return null;

  console.log("totalProductsCount ", totalProductsCount);

  const currentPage = Number(searchParams.get("page")) || DEFAULT_PAGE;
  const pageSize = Number(searchParams.get("size")) || DEFAULT_PAGE_SIZE;
  const pagesCount = Math.ceil(totalProductsCount / pageSize);
  console.log(
    "totalProductsCount /  ",
    totalProductsCount,
    "page size",
    pageSize,
    " === ",
    " pages count",
    pagesCount
  );

  const createPageUrl = (pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNum);
    return `${pathname}?${params.toString()}`;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      router.push(createPageUrl(currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagesCount) {
      router.push(createPageUrl(currentPage + 1));
    }
  };

  const initialNums = [1, 2, 3];
  const throughNums = [7];
  const lastNum = 12;
  const pageNumbers = generatePageNumbers(currentPage, pagesCount);

  const NumberButton = ({ pageNum }) => (
    <a
      href={createPageUrl(pageNum)}
      onClick={(e) => {
        e.preventDefault();
        router.push(createPageUrl(pageNum));
      }}
      className={`mx-1 px-3 py-1 rounded ${
        pageNum === currentPage
          ? "bg-blue-500 text-white"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      {pageNum}
    </a>
  );

  return (
    <div>
      <h1>
        Page {currentPage} of {pagesCount}
      </h1>
      <ProductsPerPageDropdown />
      <div className="flex justify-around items-center max-w-[400px] my-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className={`px-3 py-1 rounded ${
            currentPage <= 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Prev
        </button>

        <div className="flex">
          {/* {initialNums.map((pageNum) => (
            <NumberButton key={`init-${pageNum}`} pageNum={pageNum} />
          ))}
          <span className="mx-1 self-center">...</span>
          {throughNums.map((pageNum) => (
            <NumberButton key={`through-${pageNum}`} pageNum={pageNum} />
          ))}
          <span className="mx-1 self-center">...</span>
          <NumberButton key={`last-${lastNum}`} pageNum={lastNum} /> */}
          {pageNumbers.map((pageNum) => (
            <NumberButton key={pageNum} pageNum={pageNum} />
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= pagesCount}
          className={`px-3 py-1 rounded ${
            currentPage >= pagesCount
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
