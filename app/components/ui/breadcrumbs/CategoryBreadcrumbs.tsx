import Link from "next/link";

export default function Breadcrumbs({
  categoryParts,
}: {
  categoryParts: string[];
}) {
  return (
    <nav className="px-4 flex items-center gap-2 text-sm text-gray-600 lg:row-start-1 lg:col-start-2">
      <Link href="/products">Products</Link>
      {categoryParts.map((part, index) => (
        <span key={part}>
          <span className="mx-2">/</span>
          <Link
            href={`/products/${categoryParts.slice(0, index + 1).join("/")}`}
            className={`${index === categoryParts.length - 1 ? "font-semibold" : ""} truncate`}
          >
            {part
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Link>
        </span>
      ))}
    </nav>
  );
}
