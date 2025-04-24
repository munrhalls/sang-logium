"use client";

import { useState, useEffect } from "react";

interface EditableToggleProps {
  label: string;
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}

export default function EditableToggle({
  label,
  value,
  onChange,
  disabled = false,
}: EditableToggleProps) {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when the prop changes (for reset functionality)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleToggle = () => {
    if (disabled) return;

    const newValue = !localValue;
    setLocalValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>

        <div className="flex items-center">
          <button
            onClick={handleToggle}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              localValue ? "bg-blue-600" : "bg-gray-500"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${
              localValue !== value ? "border-2 border-blue-300" : ""
            }`}
            aria-pressed={localValue}
            role="switch"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-slate-100 transition-transform ${
                localValue ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
