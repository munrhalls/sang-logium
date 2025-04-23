"use client";

import { useState } from "react";

interface EditableToggleProps {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => Promise<void>;
}

export default function EditableToggle({
  label,
  value,
  onToggle,
}: EditableToggleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await onToggle(!value);
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {error && (
            <span className="text-xs text-red-600 mt-1">{error}</span>
          )}
          {saveSuccess && (
            <span className="text-xs text-green-600 animate-fade-out">
              ✓ Saved
            </span>
          )}
        </div>
        
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            value ? "bg-blue-600" : "bg-gray-200"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}