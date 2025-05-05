"use client";

import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import styles from "./Autocomplete.module.css";

export interface CityResult {
  id: string;
  name: string;
  state?: string;
  country?: string;
}
export interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onCitySelect: (city: CityResult) => void;
  placeholder?: string;
  countryCode?: "gb" | "pl";
  debounceMs?: number;
  minLength?: number;
  className?: string;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
}
export function Autocomplete({
  value,
  onChange,
  onCitySelect,
  placeholder = "Enter city name",
  countryCode,
  debounceMs = 300,
  minLength = 2,
  className = "",
  disabled = false,
  id = "city-input",
  ariaLabel = "City",
}: AutocompleteProps) {
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fetchCitySuggestions = async (query: string) => {
    if (!query || query.length < minLength) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      // Create the URL object with the base endpoint
      const apiUrl = new URL(
        "https://api.geoapify.com/v1/geocode/autocomplete"
      );

      // Add query parameters
      apiUrl.searchParams.append("text", query);
      apiUrl.searchParams.append("type", "city");
      apiUrl.searchParams.append("format", "json");

      // Add country filter if provided
      if (countryCode) {
        apiUrl.searchParams.append("filter", `countrycode:${countryCode}`);
      }

      // Limit results if needed (optional)
      apiUrl.searchParams.append("limit", "5");

      // Add API key
      apiUrl.searchParams.append(
        "apiKey",
        process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || ""
      );

      const response = await fetch(apiUrl.toString());
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const cityResults: CityResult[] = data.results.map((result: any) => ({
        id: result.place_id || `${result.lat}-${result.lon}`,
        name: result.city || result.name,
        state: result.state,
        country: result.country,
      }));
      setSuggestions(cityResults);
      setIsDropdownOpen(cityResults.length > 0);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCitySuggestions(value);
    }, debounceMs);
    return () => {
      clearTimeout(handler);
    };
  }, [value, countryCode, debounceMs, minLength]);
  const handleCitySelect = (city: CityResult) => {
    onCitySelect(city);
    onChange(city.name);
    setIsDropdownOpen(false);
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
    if (!newValue.trim()) {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isDropdownOpen) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleCitySelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        setIsDropdownOpen(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);
  return (
    <div
      className={`${styles.container} ${className}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        City
      </label>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          id={id}
          className="w-full px-4 py-2 border rounded-md"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-expanded={isDropdownOpen}
          aria-controls={isDropdownOpen ? "city-suggestions-list" : undefined}
          aria-activedescendant={
            isDropdownOpen && highlightedIndex >= 0
              ? `city-suggestion-${highlightedIndex}`
              : undefined
          }
        />
      </div>

      {isDropdownOpen && (
        <ul
          id="city-suggestions-list"
          className={styles.dropdown}
          role="listbox"
        >
          {isLoading ? (
            <li className={styles.loadingItem}>Loading...</li>
          ) : suggestions.length > 0 ? (
            suggestions.map((city, index) => (
              <li
                key={city.id}
                id={`city-suggestion-${index}`}
                className={`${styles.suggestionItem} ${
                  index === highlightedIndex ? styles.highlighted : ""
                }`}
                role="option"
                aria-selected={index === highlightedIndex}
                onClick={() => handleCitySelect(city)}
              >
                <span className={styles.mainText}>{city.name}</span>
                {(city.state || city.country) && (
                  <span className={styles.secondaryText}>
                    {[city.state, city.country].filter(Boolean).join(", ")}
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className={styles.noResults}>No cities found</li>
          )}
        </ul>
      )}
    </div>
  );
}
export default Autocomplete;
