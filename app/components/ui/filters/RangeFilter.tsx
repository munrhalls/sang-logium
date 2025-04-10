import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";

const RangeFilter = ({
  name,
  min = 0,
  max = 10000,
  step = 1,
  onChange,
  initialMin,
  initialMax,
}) => {
  // Fix initialization order - define minValue/maxValue first
  const [minValue, setMinValue] = useState(initialMin || min);
  const [maxValue, setMaxValue] = useState(initialMax || max);
  const [minInputValue, setMinInputValue] = useState(String(minValue));
  const [maxInputValue, setMaxInputValue] = useState(String(maxValue));

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
      onChange(name, { min: minValue, max: maxValue }, "range");
    }
  };

  const debouncedHandleChangeComplete = debounce(handleChangeComplete, 800);
  const debouncedNumInputHandleChangeComplete = debounce(
    handleChangeComplete,
    2500
  );

  // Update if initial values change
  useEffect(() => {
    if (initialMin !== undefined) {
      setMinValue(initialMin);
      setMinInputValue(String(initialMin));
    }
    if (initialMax !== undefined) {
      setMaxValue(initialMax);
      setMaxInputValue(String(initialMax));
    }
  }, [initialMin, initialMax]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={minInputValue}
            onChange={(e) => {
              const newValue = e.target.value;
              if (
                newValue === "" ||
                (/^\d*$/.test(newValue) && newValue.length <= 5)
              ) {
                setMinInputValue(newValue);

                if (newValue !== "") {
                  const numValue = parseInt(newValue, 10);
                  handleMinChange(numValue);
                }
              }
            }}
            onBlur={() => {
              if (minInputValue === "") {
                // Restore previous value if empty
                setMinInputValue(String(minValue));
              } else {
                // Ensure value doesn't exceed max
                const numValue = parseInt(minInputValue, 10);
                if (numValue > maxValue) {
                  setMinInputValue(String(maxValue));
                  handleMinChange(maxValue);
                }
              }
              debouncedNumInputHandleChangeComplete();
            }}
            className="w-24 p-1 border rounded text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="text"
            inputMode="numeric"
            value={maxInputValue}
            onChange={(e) => {
              const newValue = e.target.value;
              if (
                newValue === "" ||
                (/^\d*$/.test(newValue) && newValue.length <= 5)
              ) {
                setMaxInputValue(newValue);

                if (newValue !== "") {
                  const numValue = parseInt(newValue, 10);
                  handleMaxChange(numValue);
                }
              }
            }}
            onBlur={() => {
              if (maxInputValue === "") {
                // Restore previous value if empty
                setMaxInputValue(String(maxValue));
              } else {
                // Ensure value isn't below min
                const numValue = parseInt(maxInputValue, 10);
                if (numValue < minValue) {
                  setMaxInputValue(String(minValue));
                  handleMaxChange(minValue);
                }
              }
              debouncedNumInputHandleChangeComplete();
            }}
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
            className="w-full bg-slate-400 cursor-pointer"
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
            className="w-full bg-slate-100 cursor-pointer"
            style={{ zIndex: 4 }}
          />
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>${minValue}</span>
          <span>${maxValue}</span>
        </div>

        {/* Rest of component remains the same */}
      </div>
    </div>
  );
};

export default RangeFilter;
