export default function FilterItem({ filter, value, onChange }) {
  if (!filter) return null;

  const { type, name, options, min, max, step } = filter;

  switch (type) {
    case "checkbox":
      return (
        <div className="filter-item mb-3">
          <h4 className="font-medium mb-1">{name}</h4>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              className="mr-2"
            />
            <span>{options && options[0] ? options[0] : "Enable"}</span>
          </label>
        </div>
      );

    case "range":
      return (
        <div className="filter-item mb-3">
          <h4 className="font-medium mb-1">{name}</h4>
          <div className="flex flex-col">
            <input
              type="range"
              min={min || 0}
              max={max || 1000}
              step={step || 1}
              value={value !== null && value !== undefined ? value : min || 0}
              onChange={(e) => onChange(parseInt(e.target.value, 10))}
              className="w-full"
            />
            <div className="flex justify-between text-sm mt-1">
              <span>${min || 0}</span>
              <span>
                ${value !== null && value !== undefined ? value : min || 0}
              </span>
              <span>${max || 1000}</span>
            </div>
          </div>
        </div>
      );

    case "multiselect":
      const safeOptions = Array.isArray(options) ? options : [];
      const safeValue = Array.isArray(value) ? value : [];

      return (
        <div className="filter-item mb-3">
          <h4 className="font-medium mb-1">{name}</h4>
          <div className="space-y-1">
            {safeOptions.map((option, i) => (
              <label key={i} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={safeValue.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...safeValue, option]);
                    } else {
                      onChange(safeValue.filter((item) => item !== option));
                    }
                  }}
                  className="mr-2"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="filter-item mb-3">
          <h4 className="font-medium mb-1">{name}</h4>
          <p className="text-sm text-gray-500">
            Unsupported filter type: {type}
          </p>
        </div>
      );
  }
}
