"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import FilterItem from "./FilterItem";

export default function FiltersForm({ filters, initialValues }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [formValues, setFormValues] = useState(initialValues);

  function handleChange(name, value, type) {
    const newValues = {
      ...formValues,
      [name]: value,
    };
    setFormValues(newValues);

    // Immediately update URL when a filter changes
    const params = new URLSearchParams(searchParams.toString());

    if (!value || (Array.isArray(value) && value.length === 0)) {
      params.delete(name);
    } else if (type === "multiselect") {
      params.set(name, JSON.stringify(value));
    } else {
      params.set(name, String(value));
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleReset() {
    router.push(pathname, { scroll: false });
  }

  return (
    <form className="space-y-4">
      {filters.map((filter, index) => (
        <FilterItem
          key={`${filter.name}-${index}`}
          filter={filter}
          value={formValues[filter.name]}
          onChange={(value) => handleChange(filter.name, value, filter.type)}
        />
      ))}

      <div className="mt-4">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          Clear All
        </button>
      </div>
    </form>
  );
}
