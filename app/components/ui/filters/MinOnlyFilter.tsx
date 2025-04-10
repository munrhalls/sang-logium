import { useState, useEffect } from "react";
import debounce from "lodash/debounce";

const MinOnlyFilter = ({
  name,
  min = 0,
  max = 10000,
  step = 1,
  onChange,
  initialMin,
}) => {
  // Initialize state for the minimum value
  const [minValue, setMinValue] = useState(initialMin || min);
  const [minInputValue, setMinInputValue] = useState(String(minValue));

  // Handle min value change from slider
  const handleMinChange = (newMin) => {
    // Ensure min is valid
    const validMin = Math.max(min, Math.min(newMin, max));
    setMinValue(validMin);
    setMinInputValue(String(validMin));

    if (onChange) {
      onChange(name, { min: validMin }, "range-min");
    }
  };

  // Debounce change events to avoid too many updates
  const debouncedHandleChangeComplete = debounce(() => {
    if (onChange) {
      onChange(name, { min: minValue }, "range-min");
    }
  }, 800);

  // Update if initial value changes
  useEffect(() => {
    if (initialMin !== undefined) {
      setMinValue(initialMin);
      setMinInputValue(String(initialMin));
    }
  }, [initialMin]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 mb-4">
        {/* Single slider for minimum value */}
        <div className="relative pt-5">
          <label className="flex flex-col">
            <span className="text-gray-500 text-sm">Products available</span>
          </label>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minValue}
            onChange={(e) => handleMinChange(parseInt(e.target.value, 10))}
            onMouseUp={debouncedHandleChangeComplete}
            onTouchEnd={debouncedHandleChangeComplete}
            className="w-full bg-slate-400 cursor-pointer"
          />
        </div>

        {/* Show the current range */}
        <div className="flex justify-between text-sm mt-1">
          <span>{minValue} and above</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
};

export default MinOnlyFilter;
