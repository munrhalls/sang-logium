"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function AppliedFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateSearchParams = (key: string, value: string | null) => {
    const current = new URLSearchParams(searchParams.toString());
    if (value === null) {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    router.push(`${pathname}?${current.toString()}`);
  };

  const toggleSortDirection = (currentSort: string) => {
    const [field, direction] = currentSort.split("-");
    const newDirection = direction === "asc" ? "desc" : "asc";
    updateSearchParams("sort", `${field}-${newDirection}`);
  };

  const filters = {
    price: searchParams.get("price"),
    color: searchParams.get("color"),
    sort: searchParams.get("sort"),
  };

  return (
    <div className="flex gap-2">
      {Object.entries(filters).map(
        ([key, value]) =>
          value && (
            <div
              key={key}
              className="flex items-center border rounded px-3 py-1"
            >
              <span>
                {key}: {value}
              </span>

              {key === "sort" && (
                <button
                  onClick={() => toggleSortDirection(value)}
                  className="ml-2"
                >
                  {value.endsWith("asc") ? "↑" : "↓"}
                </button>
              )}

              <button
                onClick={() => updateSearchParams(key, null)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ⨯
              </button>
            </div>
          )
      )}
    </div>
  );
}
