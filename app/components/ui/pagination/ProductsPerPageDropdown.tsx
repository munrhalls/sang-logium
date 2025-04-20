"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ProductsPerPageDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const itemsPerPage = Number(searchParams.get("size")) || 10;
  const options = [5, 10, 15, 25, 50];

  const handleChange = (e) => {
    const newSize = Number(e.target.value);
    const params = new URLSearchParams(searchParams);
    params.set("size", newSize);
    params.set("page", 1);
    router.push(`${pathname}?${params.toString()}`);
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
