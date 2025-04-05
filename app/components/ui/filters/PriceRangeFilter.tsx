import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";

const PriceRangeFilter = ({
  name,
  min = 0,
  max = 10000,
  step = 1,
  onChange,
  initialMin,
  initialMax,
}) => {
  // Initialize state with either the initial values or defaults
  const [minValue, setMinValue] = useState(initialMin || min);
  const [maxValue, setMaxValue] = useState(initialMax || max);

  // Handle min value change
  const handleMinChange = (newMin) => {
    // Ensure min doesn't exceed max
    const validMin = Math.min(newMin, maxValue);
    setMinValue(validMin);
    if (onChange) {
      onChange(name, { min: validMin, max: maxValue }, "range");
    }
  };

  // Handle max value change
  const handleMaxChange = (newMax) => {
    // Ensure max doesn't go below min
    const validMax = Math.max(newMax, minValue);
    setMaxValue(validMax);
    if (onChange) {
      onChange(name, { min: minValue, max: validMax }, "range");
    }
  };

  // Submit changes when user stops interacting
  const handleChangeComplete = () => {
    if (onChange) {
      // We send final values only when user stops sliding
      onChange(name, { min: minValue, max: maxValue }, "range");
    }
  };

  const debouncedHandleChangeComplete = debounce(handleChangeComplete, 800);

  // Update if initial values change (e.g., from URL params)
  useEffect(() => {
    if (initialMin !== undefined) setMinValue(initialMin);
    if (initialMax !== undefined) setMaxValue(initialMax);
  }, [initialMin, initialMax]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center gap-2">
          <input
            type="number"
            min={min}
            max={max}
            value={minValue}
            onChange={(e) =>
              handleMinChange(parseInt(e.target.value, 10) || min)
            }
            onBlur={debouncedHandleChangeComplete}
            className="w-24 p-1 border rounded text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            min={min}
            max={max}
            value={maxValue}
            onChange={(e) =>
              handleMaxChange(parseInt(e.target.value, 10) || max)
            }
            onBlur={debouncedHandleChangeComplete}
            className="w-24 p-1 border rounded text-sm"
          />
        </div>

        <div className="relative pt-5 flex flex-col gap-2">
          <label className="flex flex-col">
            <span className="text-gray-500 text-sm">MIN</span>
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
            className="w-full bg-white"
            style={{ zIndex: 3 }}
          />
          <label className="flex justify-right w-full">
            <span className="text-gray-500 text-sm text-right">MAX</span>
          </label>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxValue}
            onChange={(e) => handleMaxChange(parseInt(e.target.value, 10))}
            onMouseUp={debouncedHandleChangeComplete}
            onTouchEnd={debouncedHandleChangeComplete}
            className="w-full bg-white"
            style={{ zIndex: 4 }}
          />
        </div>
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span>${minValue}</span>
        <span>${maxValue}</span>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
