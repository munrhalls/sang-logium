'use client';

import React, { useRef, useEffect } from 'react';
import { AddressResult } from '@/lib/address/geoapifyResponseHandler';
import styles from './SuggestionsDropdown.module.css';

/**
 * Props for the SuggestionsDropdown component
 */
export interface SuggestionsDropdownProps {
  /** Array of address suggestions */
  suggestions: AddressResult[];
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Callback when an address is selected */
  onSelect: (address: AddressResult) => void;
  /** Callback when dropdown is closed */
  onClose: () => void;
  /** The currently highlighted suggestion index */
  highlightedIndex: number;
  /** Callback to set the highlighted index */
  setHighlightedIndex: (index: number) => void;
  /** Input reference for positioning */
  inputRef: React.RefObject<HTMLDivElement>;
  /** No results message */
  noResultsMessage?: string;
  /** Loading message */
  loadingMessage?: string;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Component that displays address suggestions in a dropdown
 */
export function SuggestionsDropdown({
  suggestions,
  isOpen,
  isLoading,
  onSelect,
  onClose,
  highlightedIndex,
  setHighlightedIndex,
  inputRef,
  noResultsMessage = 'No matching addresses found',
  loadingMessage = 'Loading suggestions...',
  className = '',
}: SuggestionsDropdownProps) {
  // Reference to the dropdown element
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format an address for display
  const formatAddressForDisplay = (address: AddressResult): string => {
    if (address.formattedAddress) {
      return address.formattedAddress;
    }
    
    return [
      address.streetAddress,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(Boolean).join(', ');
  };

  // Handle click outside to close dropdown
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
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, inputRef]);

  // Scroll to highlighted item
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && dropdownRef.current) {
      const highlighted = dropdownRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlighted instanceof HTMLElement) {
        highlighted.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

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
        <ul className={styles.suggestionsList}>
          {suggestions.map((address, index) => (
            <li
              key={`suggestion-${index}`}
              className={`${styles.suggestionItem} ${index === highlightedIndex ? styles.highlighted : ''}`}
              onClick={() => onSelect(address)}
              onMouseEnter={() => setHighlightedIndex(index)}
              role="option"
              aria-selected={index === highlightedIndex}
              data-index={index}
              tabIndex={-1}
              id={`address-suggestion-${index}`}
            >
              {formatAddressForDisplay(address)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SuggestionsDropdown;