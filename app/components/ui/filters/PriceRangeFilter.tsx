// filters/PriceRangeFilter.jsx
"use client";

import { useState, useEffect } from "react";

export default function PriceRangeFilter({ value = {}, onChange }) {
  const [localMin, setLocalMin] = useState(value.min || "");
  const [localMax, setLocalMax] = useState(value.max || "");

  // Update local state when props change (from URL)
  useEffect(() => {
    setLocalMin(value.min || "");
    setLocalMax(value.max || "");
  }, [value.min, value.max]);

  // Apply price filter after user stops typing
  const handleApply = () => {
    const min = localMin === "" ? undefined : Number(localMin);
    const max = localMax === "" ? undefined : Number(localMax);

    // Only update if at least one value is specified
    if (min !== undefined || max !== undefined) {
      onChange({ min, max });
    } else {
      // Clear the filter if both inputs are empty
      onChange({ min: undefined, max: undefined });
    }
  };

  // Handle clearing the price filter
  const handleClear = () => {
    setLocalMin("");
    setLocalMax("");
    onChange({ min: undefined, max: undefined });
  };

  // Apply filter when Enter key is pressed
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  return (
    <div className="border-b border-gray-800 pb-4">
      <h3 className="text-lg font-medium mb-3">Price Range</h3>

      <div className="flex items-center space-x-2 mb-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            $
          </span>
          <input
            type="number"
            min="0"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Min"
            className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <span className="text-gray-400">to</span>

        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            $
          </span>
          <input
            type="number"
            min="0"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Max"
            className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
        >
          Apply
        </button>

        {(value.min !== undefined || value.max !== undefined) && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {(value.min !== undefined || value.max !== undefined) && (
        <div className="mt-2 text-sm text-blue-400">
          Active: {value.min !== undefined ? `$${value.min}` : "$0"} -{" "}
          {value.max !== undefined ? `$${value.max}` : "Any"}
        </div>
      )}
    </div>
  );
}
