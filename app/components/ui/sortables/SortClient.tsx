"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function SortClient({ initialSortOptions, currentSort }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortName = searchParams.get("sort") || "";
  const currentSortDir = searchParams.get("dir") || "asc";

  function handleSortChange(sortName, direction = "asc") {
    const params = new URLSearchParams(searchParams);

    if (sortName) {
      params.set("sort", sortName);
      params.set("dir", direction);
    } else {
      params.delete("sort");
      params.delete("dir");
    }

    // Update URL (single source of truth)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="sort-options">
      <h3>Sort By</h3>
      <div className="sort-buttons">
        {initialSortOptions.map((option) => (
          <button
            key={option.name}
            className={option.name === currentSortName ? "active" : ""}
            onClick={() => {
              const newDirection =
                option.name === currentSortName && currentSortDir === "asc"
                  ? "desc"
                  : "asc";
              handleSortChange(option.name, newDirection);
            }}
          >
            {option.label}
            {option.name === currentSortName &&
              (currentSortDir === "asc" ? " ↑" : " ↓")}
          </button>
        ))}
      </div>
    </div>
  );
}
