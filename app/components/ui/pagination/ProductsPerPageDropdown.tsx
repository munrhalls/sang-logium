"use client";
import { useState } from "react";

export default function ProductsPerPageDropdown() {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const options = [5, 10, 15, 25, 50];

  const handleChange = (e) => {
    setItemsPerPage(Number(e.target.value));
  };

  return (
    <div className="flex items-center mb-4">
      <label htmlFor="itemsPerPage" className="mr-2 text-sm">
        Items per page:
      </label>
      <select
        id="itemsPerPage"
        value={itemsPerPage}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
