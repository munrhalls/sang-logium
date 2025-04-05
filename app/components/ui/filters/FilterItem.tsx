import PriceRangeFilter from "./PriceRangeFilter";
import { useSearchParams } from "next/navigation";

export default function FilterItem({
  filter,
  value,
  onChange,
  onChangeMin,
  onChangeMax,
}) {
  const searchParams = useSearchParams();

  if (!filter) return null;

  const { type, name, options, min, max, step } = filter;
  const normalizedName = name.toLowerCase();
  const priceMin = searchParams.get(`${normalizedName}_min`)
    ? parseInt(searchParams.get(`${normalizedName}_min`), 10)
    : undefined;
  const priceMax = searchParams.get(`${normalizedName}_max`)
    ? parseInt(searchParams.get(`${normalizedName}_max`), 10)
    : undefined;

  switch (type) {
    case "checkbox":
      return (
        <div className="filter-item mb-3">
          <h4 className="font-medium mb-1">{name}</h4>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked, "checkbox")}
              className="mr-2"
            />
            <span>{options && options[0] ? options[0] : "Enable"}</span>
          </label>
        </div>
      );

    case "range":
      return (
        <div className="filter-item mb-3">
          <h4 className="font-medium mb-1 font-black uppercase">{name}</h4>
          <PriceRangeFilter
            name={name.toLowerCase()}
            min={min || 0}
            max={max || 10000}
            step={step || 1}
            onChange={(e) => onChange({ min: min, max: max }, "range")}
            initialMin={priceMin}
            initialMax={priceMax}
          />
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
                      onChange([...safeValue, option], "multiselect");
                    } else {
                      onChange(
                        safeValue.filter((item) => item !== option),
                        "multiselect"
                      );
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

    case "radio":
      const radioOptions = Array.isArray(options) ? options : [];
      return (
        <div className="filter-item mb-3">
          <h4 className="font-medium mb-1">{name}</h4>
          <div className="space-y-1">
            {radioOptions.map((option, i) => (
              <label key={i} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={name.toLowerCase()}
                  checked={value === option}
                  onChange={() => onChange(option, "radio")}
                  className="mr-2"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case "boolean":
      return (
        <div className="filter-item mb-3">
          <h4 className="font-medium mb-1">{name}</h4>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked, "checkbox")}
              className="mr-2"
            />
            <span>{name}</span>
          </label>
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
