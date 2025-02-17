import Link from "next/link";

export default function Breadcrumbs({ slugs }: { slugs: string[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600">
      <Link href="/products">Products</Link>
      {slugs.map((slug, index) => (
        <span key={slug}>
          <span className="mx-2">/</span>
          <Link
            href={`/products/${slugs.slice(0, index + 1).join("/")}`}
            className={`${index === slugs.length - 1 ? "font-semibold" : ""} truncate`}
          >
            {slug
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Link>
        </span>
      ))}
    </nav>
  );
}
