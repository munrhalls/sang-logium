import Link from "next/link";
interface BreadcrumbsProps {
  categoryParts: string[];
  isMobile: boolean;
}
export default function Breadcrumbs({
  categoryParts,
  isMobile,
}: BreadcrumbsProps) {
  console.log(categoryParts, "categoryParts");
  const shouldSlice = isMobile && categoryParts[0] === "products";
  const partsToRender = shouldSlice ? categoryParts.slice(1) : categoryParts;
  const indexOffset = shouldSlice ? 1 : 0;
  console.log(shouldSlice, partsToRender, "partsToRender");
  return (
    <nav className="md:px-4 flex items-center md:gap-2 text-xs md:text-sm text-gray-600 lg:row-start-1 lg:col-start-2">
      {!isMobile && <Link href="/products">Products</Link>}
      {partsToRender.map((part, index) => {
        const originalIndex = index + indexOffset;
        return (
          <span key={index}>
            <span className="mx-1 md:mx-2">/</span>
            <Link
              href={`/products/${categoryParts.slice(indexOffset, originalIndex + 1).join("/")}`}
              className={`${originalIndex === categoryParts.length - 1 ? "font-semibold" : ""} truncate`}
            >
              {part
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
