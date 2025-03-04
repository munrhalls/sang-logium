// filters/FilterGroup.jsx
"use client";

export default function FilterGroup({ filter, value, onChange }) {
  // Skip rendering for empty options
  if (!filter?.options?.length) return null;

  // Filter out empty options
  const options = filter.options.filter((option) => option !== "");

  // Handle option selection based on filter type
  const handleOptionSelect = (option) => {
    if (filter.type === "multiselect") {
      const currentSelections = Array.isArray(value) ? value : [];

      // Toggle selection
      if (currentSelections.includes(option)) {
        onChange(currentSelections.filter((item) => item !== option));
      } else {
        onChange([...currentSelections, option]);
      }
    } else if (filter.type === "checkbox") {
      const currentSelections = value || {};
      onChange({
        ...currentSelections,
        [option]: !currentSelections[option],
      });
    } else {
      // For radio buttons
      onChange(option);
    }
  };

  return (
    <div className="border-b border-gray-800 pb-4">
      <h3 className="text-lg font-medium mb-3">{filter.name}</h3>

      {filter.type === "radio" && (
        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <span className="flex-grow text-sm">{option}</span>
              <div
                className={`rounded-full relative w-5 h-5 flex items-center justify-center border ${
                  value === option
                    ? "border-blue-500 bg-[rgb(29,78,216)]"
                    : "border-gray-400 hover:border-blue-400"
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {value === option && (
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
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <span className="flex-grow text-sm">{option}</span>
              <div
                className={`relative w-5 h-5 flex items-center justify-center border rounded ${
                  Array.isArray(value) && value.includes(option)
                    ? "border-blue-500 bg-[rgb(29,78,216)]"
                    : "border-gray-400 hover:border-blue-400"
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {Array.isArray(value) && value.includes(option) && (
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

      {filter.type === "checkbox" && (
        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <span className="flex-grow text-sm">{option}</span>
              <div
                className={`relative w-5 h-5 flex items-center justify-center border rounded ${
                  value?.[option]
                    ? "border-blue-500 bg-[rgb(29,78,216)]"
                    : "border-gray-400 hover:border-blue-400"
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {value?.[option] && (
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
  );
}
