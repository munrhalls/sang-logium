"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function SortClient({
  initialSortOptions = [],
  currentSort = "",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [options, setOptions] = useState(initialSortOptions);

  const currentSortName = searchParams.get("sort") || "";
  const currentSortDir = searchParams.get("dir") || "asc";

  // Ensure options have display names
  useEffect(() => {
    if (initialSortOptions && initialSortOptions.length > 0) {
      // Map options to ensure they have displayName
      const processedOptions = initialSortOptions.map((option) => ({
        name: option.name,
        displayName: option.displayName || formatSortName(option.name),
        type: option.type || "alphabetic",
        field: option.field || option.name,
        defaultDirection: option.defaultDirection || "asc",
      }));

      setOptions(processedOptions);
    }
  }, [initialSortOptions]);

  function formatSortName(name) {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/_/g, " ");
  }

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

  function getDirectionIcon(isActive, direction) {
    if (!isActive)
      return <ArrowUp className="h-5 w-5 text-slate-500 opacity-15" />;

    return (
      <>
        {direction === "asc" ? (
          <ArrowUp className="h-5 w-5 text-orange-500" />
        ) : (
          <ArrowDown className="h-5 w-5 text-orange-500" />
        )}
      </>
    );
  }

  // Handle different sort types
  function getSortLabel(option) {
    const { displayName, type } = option;

    switch (type) {
      case "alphabetic":
        return `${displayName} (A-Z)`;
      case "numeric":
        return `${displayName} (Low-High)`;
      case "date":
        return `${displayName} (Newest)`;
      case "boolean":
        return `${displayName}`;
      default:
        return displayName;
    }
  }

  if (!options || options.length === 0) {
    return <div className="p-4 text-gray-500">No sort options available</div>;
  }

  return (
    <div className="sort-options space-y-4">
      <div className="sort-buttons space-y-2">
        {options.map((option) => {
          const isActive = option.name === currentSortName;
          return (
            <button
              key={option.name}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "bg-white hover:bg-blue-400 text-black"
              }`}
              onClick={() => {
                const newDirection =
                  isActive && currentSortDir === "asc"
                    ? "desc"
                    : option.defaultDirection || "asc";
                handleSortChange(option.name, newDirection);
              }}
            >
              <span>{getSortLabel(option)}</span>
              <div className="flex items-center">
                {/* {isActive && <Check className="mr-1 h-5 w-5" />} */}
                {getDirectionIcon(isActive, currentSortDir)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
