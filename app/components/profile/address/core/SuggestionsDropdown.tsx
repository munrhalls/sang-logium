"use client";
import React, { useRef, useEffect } from "react";
import { AddressResult } from "@/lib/address/geoapifyResponseHandler";
import styles from "./SuggestionsDropdown.module.css";
export interface SuggestionsDropdownProps {
  suggestions: AddressResult[];
  isOpen: boolean;
  isLoading: boolean;
  onSelect: (address: AddressResult) => void;
  onClose: () => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  inputRef: React.RefObject<HTMLDivElement>;
  noResultsMessage?: string;
  loadingMessage?: string;
  className?: string;
}
export function SuggestionsDropdown({
  suggestions,
  isOpen,
  isLoading,
  onSelect,
  onClose,
  highlightedIndex,
  setHighlightedIndex,
  inputRef,
  noResultsMessage = "No matching addresses found",
  loadingMessage = "Loading suggestions...",
  className = "",
}: SuggestionsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formatAddressForDisplay = (address: AddressResult): string => {
    if (address.formattedAddress) {
      return address.formattedAddress;
    }
    return [
      address.streetAddress,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, inputRef]);
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && dropdownRef.current) {
      const highlighted = dropdownRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      );
      if (highlighted instanceof HTMLElement) {
        highlighted.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);
  if (!isOpen) {
    return null;
  }
  // In SuggestionsDropdown.js/tsx
  return (
    <div
      className={`${styles.dropdown} ${className}`}
      ref={dropdownRef}
      role="listbox"
      aria-label="Address suggestions"
      id="address-suggestions-list"
    >
      {isLoading ? (
        <div className={styles.message}>{loadingMessage}</div>
      ) : suggestions.length === 0 ? (
        <div className={styles.message}>{noResultsMessage}</div>
      ) : (
        <ul
          className={styles.suggestionsList}
          id="city-suggestions-list"
          role="listbox"
        >
          {suggestions.map((city, index) => (
            <li
              key={`city-suggestion-${index}`}
              id={`city-suggestion-${index}`}
              className={styles.suggestionItem}
              role="option"
              aria-selected={index === highlightedIndex}
              data-index={index}
            >
              <button
                type="button"
                className={`${styles.suggestionButton} ${index === highlightedIndex ? styles.highlighted : ""}`}
                onClick={() => onSelect(city)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className={styles.cityName}>{city.name}</div>
                <div className={styles.cityLocation}>
                  {[city.state, city.country].filter(Boolean).join(", ")}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default SuggestionsDropdown;
