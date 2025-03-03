import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getFiltersForCategoryPathAction } from "@/app/actions/getFiltersForCategoryPathAction";

function FiltersSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((item) => (
        <div key={item}>
          <div className="h-5 w-24 bg-gray-700 rounded mb-3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((option) => (
              <div
                key={option}
                className="h-4 w-full bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Filters() {
  const pathname = usePathname();
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    setLoading(true);
    getFiltersForCategoryPathAction(pathname)
      .then((data) => {
        console.log("Client received data:", data);
        setFilters(data || []);

        // Initialize selected options with default values
        const initialSelections = {};
        (data || []).forEach((filter) => {
          if (filter.type === "multiselect") {
            // For multiselect, initialize with empty array
            initialSelections[filter.name] = [];

            // Add default value if specified
            if (filter.defaultValue) {
              initialSelections[filter.name] = [filter.defaultValue];
            }
          } else if (filter.defaultValue) {
            initialSelections[filter.name] = filter.defaultValue;
          }
        });
        setSelectedOptions(initialSelections);
      })
      .catch((err) => console.error("Client error:", err))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleOptionSelect = (filterName, option, filterType) => {
    if (filterType === "multiselect") {
      setSelectedOptions((prev) => {
        const currentSelections = prev[filterName] || [];

        // Toggle selection
        if (currentSelections.includes(option)) {
          return {
            ...prev,
            [filterName]: currentSelections.filter((item) => item !== option),
          };
        } else {
          return {
            ...prev,
            [filterName]: [...currentSelections, option],
          };
        }
      });
    } else {
      // For radio buttons
      setSelectedOptions((prev) => ({
        ...prev,
        [filterName]: option,
      }));
    }
  };

  if (loading) return <FiltersSkeleton />;
  if (!filters.length) return <p>No filters available</p>;

  return (
    <div className="space-y-6">
      {filters.map((filter) => (
        <div key={filter.name} className="border-b border-gray-800 pb-4">
          <h3 className="text-lg font-medium mb-3">{filter.name}</h3>

          {filter.type === "radio" && (
            <div className="space-y-3">
              {filter.options
                .filter((option) => option !== "") // Filter out empty options
                .map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 cursor-pointer group"
                  >
                    <span className="flex-grow text-sm">{option}</span>
                    <div
                      className={`rounded-full  relative w-5 h-5 flex items-center justify-center border  ${
                        selectedOptions[filter.name] === option
                          ? "border-blue-500 bg-[rgb(29,78,216)]"
                          : "border-gray-400 hover:border-blue-400"
                      }`}
                      onClick={() =>
                        handleOptionSelect(filter.name, option, "radio")
                      }
                    >
                      {selectedOptions[filter.name] === option && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </label>
                ))}
            </div>
          )}

          {filter.type === "multiselect" && (
            <div className="space-y-3">
              {filter.options
                .filter((option) => option !== "") // Filter out empty options
                .map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 cursor-pointer group"
                  >
                    <span className="flex-grow text-sm">{option}</span>
                    <div
                      className={`relative w-5 h-5 flex items-center justify-center border rounded ${
                        selectedOptions[filter.name]?.includes(option)
                          ? "border-blue-500 bg-[rgb(29,78,216)]"
                          : "border-gray-400 hover:border-blue-400"
                      }`}
                      onClick={() =>
                        handleOptionSelect(filter.name, option, "multiselect")
                      }
                    >
                      {selectedOptions[filter.name]?.includes(option) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </label>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
