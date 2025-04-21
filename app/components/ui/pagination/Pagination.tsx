"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductsPerPageDropdown from "./ProductsPerPageDropdown";
import generatePageNumbers from "./generatePageNumbers";

const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_PAGE = 1;

export default function Pagination({
  totalProductsCount,
}: {
  totalProductsCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  if (totalProductsCount === undefined) return null;

  // console.log("totalProductsCount ", totalProductsCount);

  const currentPage = Number(searchParams.get("page")) || DEFAULT_PAGE;
  const pageSize = Number(searchParams.get("size")) || DEFAULT_PAGE_SIZE;
  const pagesCount = Math.ceil(totalProductsCount / pageSize);
  // console.log(
  //   "totalProductsCount /  ",
  //   totalProductsCount,
  //   "page size",
  //   pageSize,
  //   " === ",
  //   " pages count",
  //   pagesCount
  // );

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNum.toString());
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

  const pageNavItems = generatePageNumbers(currentPage, pagesCount);

  const NumberButton = ({ pageNum }: { pageNum: number }) => (
    <a
      href={createPageUrl(pageNum)}
      onClick={(e) => {
        e.preventDefault();
        router.push(createPageUrl(pageNum));
      }}
      className={`text-xs px-1 md:py-1 text-xs mx-1 md:px-3 py-1 rounded-xl ${
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
          className={`px-1 md:px-3 md:py-1 text-xs rounded ${
            currentPage <= 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Prev
        </button>

        <div className="flex">
          {pageNavItems.map((item, index) =>
            item === "..." ? (
              <span
                key={`text-xs ellipsis-${index}`}
                className="pagination-ellipsis"
              >
                ...
              </span>
            ) : (
              <NumberButton key={`page-${item}`} pageNum={item} />
            )
          )}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= pagesCount}
          className={`px-1 md:px-3 md:py-1 text-xs py-1 rounded ${
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
