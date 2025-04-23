"use client";

import { useState } from "react";
import { Address } from "@/sanity/lib/profiles/profileTypes";

interface EditableAddressProps {
  address: Address;
  onSave: (field: keyof Address, value: string) => Promise<void>;
}

export default function EditableAddress({
  address,
  onSave,
}: EditableAddressProps) {
  const [editField, setEditField] = useState<keyof Address | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<keyof Address | null>(null);

  const handleEdit = (field: keyof Address) => {
    setEditField(field);
    setEditValue(address[field] || "");
    setError(null);
  };

  const handleCancel = () => {
    setEditField(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!editField) return;
    
    if (editValue === address[editField]) {
      setEditField(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await onSave(editField, editValue);
      setEditField(null);
      setSaveSuccess(editField);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  const fields: { key: keyof Address; label: string }[] = [
    { key: "streetAddress", label: "Street Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State/Province" },
    { key: "postalCode", label: "Postal Code" },
    { key: "country", label: "Country" },
  ];

  return (
    <div className="border rounded-md p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Address Information</h3>
      
      {fields.map(({ key, label }) => (
        <div key={key} className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {editField !== key && (
              <button
                onClick={() => handleEdit(key)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            )}
          </div>

          {editField === key ? (
            <div>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              
              {error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
              )}
              
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-xs text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`px-3 py-1 text-xs text-white rounded-md ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <p className="text-gray-900">
                {address[key] || <span className="text-gray-400">Not set</span>}
              </p>
              {saveSuccess === key && (
                <span className="ml-2 text-xs text-green-600 animate-fade-out">
                  ✓ Saved
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}