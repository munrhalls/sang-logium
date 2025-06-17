"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useErrorHandler } from "./hooks/useErrorHandler";
import { searchAddresses } from "@/app/services/AddressService";
import { Address } from "@/sanity/lib/profiles/profileTypes";

interface AddressFormProps {
  address: string;
  onChange: (address: string) => Promise<void>;
}

interface ValidationState {
  isValid: boolean;
  errors: string[];
}

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function AddressForm({ address, onChange }: AddressFormProps) {
  const { error, handleError, clearError } = useErrorHandler();
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(address);
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    isValid: true,
    errors: [],
  });
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update input value when address prop changes
  useEffect(() => {
    setInputValue(address);
  }, [address]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (value.length > 2) {
        setIsLoading(true);
        try {
          const results = await searchAddresses(value);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (err) {
          handleError(err);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateAddress = (address: Address): ValidationState => {
    const errors: string[] = [];

    if (!address.streetAddress?.trim()) {
      errors.push("Street address is required");
    }
    if (!address.city?.trim()) {
      errors.push("City is required");
    }
    if (!address.postalCode?.trim()) {
      errors.push("Postal code is required");
    }
    if (!address.country?.trim()) {
      errors.push("Country is required");
    }

    // UK postal code validation (basic format)
    if (
      address.postalCode &&
      !/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(address.postalCode)
    ) {
      errors.push("Invalid UK postal code format");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    clearError();
    setValidation({ isValid: true, errors: [] });
    debouncedSearch(value);
  };

  const formatAddress = (address: Address): string => {
    const parts = [
      address.streetAddress,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const handleSuggestionClick = async (suggestion: Address) => {
    const validationResult = validateAddress(suggestion);
    setValidation(validationResult);

    if (validationResult.isValid) {
      const formattedAddress = formatAddress(suggestion);
      setInputValue(formattedAddress);
      setShowSuggestions(false);
      try {
        await onChange(formattedAddress);
      } catch (err) {
        handleError(err);
      }
    } else {
      setShowSuggestions(false);
      handleError(new Error(validationResult.errors.join(", ")));
    }
  };

  return (
    <div className="mb-4 relative" ref={suggestionsRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Address
      </label>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-md ${
            !validation.isValid ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your address"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
        )}
        {!validation.isValid && !isLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <svg
              className="h-5 w-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>
      {!validation.isValid && (
        <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
          {validation.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {formatAddress(suggestion)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
