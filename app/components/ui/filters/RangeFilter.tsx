import { useState, useEffect } from "react";
import debounce from "lodash/debounce";

interface RangeFilterProps {
  name: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (name: string, value: { min?: number; max?: number } | number, type: string) => void;
  initialMin?: number;
  initialMax?: number;
}

const RangeFilter = ({
  name,
  min = 0,
  max = 10000,
  step = 1,
  onChange,
  initialMin,
  initialMax,
  // Removed unused parameter
  // isMinOnly = false,
}: RangeFilterProps) => {
  const [minValue, setMinValue] = useState(initialMin || min);
  const [maxValue, setMaxValue] = useState(initialMax || max);
  const [minInputValue, setMinInputValue] = useState(String(minValue));
  const [maxInputValue, setMaxInputValue] = useState(String(maxValue));

  const handleMinChange = (newMin: number) => {
    const validMin = Math.min(newMin, maxValue);
    setMinValue(validMin);
    if (onChange) {
      onChange(name, { min: validMin, max: maxValue }, "range");
    }
  };

  const handleMaxChange = (newMax: number) => {
    const validMax = Math.max(newMax, minValue);
    setMaxValue(validMax);
    if (onChange) {
      onChange(name, { min: minValue, max: validMax }, "range");
    }
  };

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
            className="w-24 p-1 border rounded text-md font-semibold  text-black"
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
                setMinInputValue(String(minValue));
              } else {
                const numValue = parseInt(minInputValue, 10);
                if (numValue > maxValue) {
                  setMinInputValue(String(maxValue));
                  handleMinChange(maxValue);
                }
              }
              debouncedNumInputHandleChangeComplete();
            }}
          />
          <span className="text-white">to</span>
          <input
            className="w-24 p-1 border rounded text-md font-semibold  text-black"
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
                setMaxInputValue(String(maxValue));
              } else {
                const numValue = parseInt(maxInputValue, 10);
                if (numValue < minValue) {
                  setMaxInputValue(String(minValue));
                  handleMaxChange(minValue);
                }
              }
              debouncedNumInputHandleChangeComplete();
            }}
          />
        </div>

        <div className="relative flex flex-col gap-2">
          <label className="flex flex-col">
            <span className="text-white text-md font-black">MIN</span>
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
            className="w-full bg-slate-400 cursor-pointer text-black"
            style={{ zIndex: 3 }}
          />
          <label className="flex justify-right w-full">
            <span className="text-white text-right text-md font-black">
              MAX
            </span>
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
            className="w-full bg-slate-100 cursor-pointer text-black"
            style={{ zIndex: 4 }}
          />
        </div>
        <div className="flex justify-between text-md mt-1">
          <span className="font-black">${minValue}</span>
          <span className="font-black">${maxValue}</span>
        </div>
      </div>
    </div>
  );
};

export default RangeFilter;
