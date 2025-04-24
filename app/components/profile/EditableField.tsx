"use client";

import { useState } from "react";

interface ValidationRule {
  validator: (value: string) => boolean;
  message: string;
}

interface EditableFieldProps {
  label: string;
  value: string;
  onSaveAction: (value: string) => Promise<void>;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: { regex: RegExp; message: string };
  type?: "text" | "email" | "tel" | "number";
  isRequiredField?: boolean;
  customValidation?: ValidationRule[];
  onChange?: (value: string) => void;
}

export default function EditableField({
  label,
  value,
  onSaveAction,
  placeholder = "Not set",
  required = false,
  minLength,
  maxLength,
  pattern,
  type = "text",
  isRequiredField = false,
  customValidation = [],
  onChange,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
    setError(null);
    setValidationErrors([]);
    setSaveSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setValidationErrors([]);
  };

  const handleChange = (newValue: string) => {
    setEditValue(newValue);
    if (onChange) {
      onChange(newValue);
    }

    // Clear validation errors when user types
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const validateField = (): boolean => {
    const errors: string[] = [];

    // Check required
    if (required && !editValue.trim()) {
      errors.push(`${label} is required`);
    }

    // Check min length
    if (minLength && editValue.trim().length < minLength) {
      errors.push(`${label} must be at least ${minLength} characters`);
    }

    // Check max length
    if (maxLength && editValue.trim().length > maxLength) {
      errors.push(`${label} cannot exceed ${maxLength} characters`);
    }

    // Check pattern
    if (pattern && !pattern.regex.test(editValue)) {
      errors.push(pattern.message);
    }

    // Check type-specific validations
    if (type === "email" && editValue.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editValue)) {
        errors.push("Please enter a valid email address");
      }
    }

    // Check custom validations
    customValidation.forEach((rule) => {
      if (!rule.validator(editValue)) {
        errors.push(rule.message);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    // Validate before saving
    if (!validateField()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSaveAction(editValue);
      setIsEditing(false);
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
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-700">
          {label}
          {isRequiredField && <span className="text-red-500 ml-1">*</span>}
        </label>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div>
          <input
            type={type}
            value={editValue}
            onChange={(e) => handleChange(e.target.value)}
            className={`w-full px-3 py-2 border ${validationErrors.length > 0 ? "border-red-300" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isLoading}
            onBlur={validateField}
          />

          {validationErrors.length > 0 && (
            <ul className="mt-1">
              {validationErrors.map((err, index) => (
                <li key={index} className="text-xs text-red-600">
                  {err}
                </li>
              ))}
            </ul>
          )}

          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

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
                isLoading || validationErrors.length > 0
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isLoading || validationErrors.length > 0}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <p className="text-gray-900">
            {value || <span className="text-gray-400">{placeholder}</span>}
          </p>
          {saveSuccess && (
            <span className="ml-2 text-xs text-green-600 animate-fade-out">
              ✓ Saved
            </span>
          )}
        </div>
      )}
    </div>
  );
}
