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
    onChange(name, { min: validMin, max: maxValue }, "range");
  };

  // Handle max value change
  const handleMaxChange = (newMax) => {
    // Ensure max doesn't go below min
    const validMax = Math.max(newMax, minValue);
    setMaxValue(validMax);
    onChange(name, { min: minValue, max: validMax }, "range");
  };

  // Update if initial values change (e.g., from URL params)
  useEffect(() => {
    if (initialMin !== undefined) setMinValue(initialMin);
    if (initialMax !== undefined) setMaxValue(initialMax);
  }, [initialMin, initialMax]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={(e) => handleMinChange(parseInt(e.target.value, 10))}
          className="w-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={(e) => handleMaxChange(parseInt(e.target.value, 10))}
          className="w-full"
        />
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span>${minValue}</span>
        <span>${maxValue}</span>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
