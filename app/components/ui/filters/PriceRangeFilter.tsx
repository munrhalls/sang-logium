import React, { useState } from "react";

const PriceRangeFilter = ({
  minPrice = 0,
  maxPrice = 5000,
  onChange = () => {},
}) => {
  // Start with full range selected
  const [minValue, setMinValue] = useState(minPrice);
  const [maxValue, setMaxValue] = useState(maxPrice);

  // Handle slider changes
  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    // Prevent min from exceeding max
    if (newMin <= maxValue) {
      setMinValue(newMin);
      onChange({ min: newMin, max: maxValue });
    }
  };

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    // Prevent max from being less than min
    if (newMax >= minValue) {
      setMaxValue(newMax);
      onChange({ min: minValue, max: newMax });
    }
  };

  // Handle input field changes
  const handleMinInput = (e) => {
    const newMin = parseInt(e.target.value) || minPrice;
    if (newMin >= minPrice && newMin <= maxValue) {
      setMinValue(newMin);
      onChange({ min: newMin, max: maxValue });
    }
  };

  const handleMaxInput = (e) => {
    const newMax = parseInt(e.target.value) || maxPrice;
    if (newMax <= maxPrice && newMax >= minValue) {
      setMaxValue(newMax);
      onChange({ min: minValue, max: newMax });
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-3">Price Range</h3>

      {/* Price input fields */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
          <input
            type="number"
            min={minPrice}
            max={maxValue}
            value={minValue}
            onChange={handleMinInput}
            className="w-24 pl-6 py-2 border rounded"
            aria-label="Minimum price"
          />
        </div>

        <span className="text-gray-400">to</span>

        <div className="relative">
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
          <input
            type="number"
            min={minValue}
            max={maxPrice}
            value={maxValue}
            onChange={handleMaxInput}
            className="w-24 pl-6 py-2 border rounded"
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* Range sliders */}
      <div className="mb-6">
        <label className="block text-xl text-white mb-1">
          Min: ${minValue}
        </label>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={minValue}
          onChange={handleMinChange}
          className="w-full mb-4"
        />

        <label className="block text-xl text-white mb-1">
          Max: ${maxValue}
        </label>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={maxValue}
          onChange={handleMaxChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PriceRangeFilter;
