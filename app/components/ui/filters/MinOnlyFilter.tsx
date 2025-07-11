import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
interface MinOnlyFilterProps {
  name: string;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (name: string, value: { min: number }, type: string) => void;
  initialMin?: number;
}
const MinOnlyFilter: React.FC<MinOnlyFilterProps> = ({
  name,
  min = 0,
  max = 1500,
  step = 1,
  onChange,
  initialMin,
}) => {
  const [minValue, setMinValue] = useState(initialMin || min);
  const handleMinChange = (newMin: number) => {
    const validMin = Math.max(min, Math.min(newMin, max));
    setMinValue(validMin);
    if (onChange) {
      onChange(name, { min: validMin }, "range");
    }
  };
  const debouncedHandleChangeComplete = debounce(() => {
    if (onChange) {
      onChange(name, { min: minValue }, "range");
    }
  }, 800);
  useEffect(() => {
    if (initialMin !== undefined) {
      setMinValue(initialMin);
    }
  }, [initialMin]);
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 mb-4">
        <div className="relative">
          <label className="flex flex-col">
            {}
            <span className="text-md font-black">{minValue}</span>
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
        {}
        <div className="flex justify-between text-md font-black "></div>
      </div>
    </div>
  );
};
export default MinOnlyFilter;
