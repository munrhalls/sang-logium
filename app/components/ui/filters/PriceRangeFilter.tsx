// In your range filter component
import { useState, useEffect } from "react";

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
            onChange={(e) => handleMinChange(parseInt(e.target.value, 10) || min)}
            onBlur={handleChangeComplete}
            className="w-24 p-1 border rounded text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            min={min}
            max={max}
            value={maxValue}
            onChange={(e) => handleMaxChange(parseInt(e.target.value, 10) || max)}
            onBlur={handleChangeComplete}
            className="w-24 p-1 border rounded text-sm"
          />
        </div>
        
        <div className="relative pt-5">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minValue}
            onChange={(e) => handleMinChange(parseInt(e.target.value, 10))}
            onMouseUp={handleChangeComplete}
            onTouchEnd={handleChangeComplete}
            className="absolute w-full pointer-events-none appearance-none bg-transparent"
            style={{ zIndex: 3 }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxValue}
            onChange={(e) => handleMaxChange(parseInt(e.target.value, 10))}
            onMouseUp={handleChangeComplete}
            onTouchEnd={handleChangeComplete}
            className="absolute w-full pointer-events-none appearance-none bg-transparent"
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
