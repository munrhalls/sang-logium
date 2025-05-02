'use client';

import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { AutocompleteInput } from './AutocompleteInput';
import SuggestionsDropdown from './SuggestionsDropdown';
import { AddressResult } from '@/lib/address/geoapifyResponseHandler';
import styles from './Autocomplete.module.css';

/**
 * Props for the Autocomplete component
 */
export interface AutocompleteProps {
  /** The current input value */
  value: string;
  /** Callback when input value changes */
  onChange: (value: string) => void;
  /** Callback when an address is selected from suggestions */
  onAddressSelect: (address: AddressResult) => void;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Optional country code to restrict results (gb or pl) */
  countryCode?: 'gb' | 'pl';
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Minimum length before triggering suggestions */
  minLength?: number;
  /** Additional CSS class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Optional ID attribute */
  id?: string;
  /** Optional label for accessibility */
  ariaLabel?: string;
}

/**
 * Autocomplete component that integrates input and suggestions dropdown
 */
export function Autocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder,
  countryCode,
  debounceMs,
  minLength,
  className = '',
  disabled = false,
  id,
  ariaLabel,
}: AutocompleteProps) {
  // State for suggestions
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  
  // State for dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  
  // State for keyboard navigation
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  // Reference to the input wrapper
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  
  // Container ref for the component
  const containerRef = useRef<HTMLDivElement>(null);
  
  /**
   * Handle suggestions received from API
   */
  const handleSuggestions = (newSuggestions: AddressResult[]) => {
    setSuggestions(newSuggestions);
    setIsDropdownOpen(newSuggestions.length > 0);
    setHighlightedIndex(-1);
  };
  
  /**
   * Handle address selection from dropdown
   */
  const handleAddressSelect = (address: AddressResult) => {
    // Call the parent component's handler
    onAddressSelect(address);
    
    // Update the input value to the selected address
    if (address.formattedAddress) {
      onChange(address.formattedAddress);
    } else {
      const formattedAddress = [
        address.streetAddress,
        address.city,
        address.state,
        address.postalCode,
        address.country
      ].filter(Boolean).join(', ');
      onChange(formattedAddress);
    }
    
    // Close the dropdown
    setIsDropdownOpen(false);
  };
  
  /**
   * Handle input value changes
   */
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
    
    // If the input is cleared, also clear suggestions
    if (!newValue.trim()) {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  };
  
  /**
   * Handle loading state changes
   */
  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };
  
  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isDropdownOpen) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
        
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleAddressSelect(suggestions[highlightedIndex]);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        setIsDropdownOpen(false);
        break;
        
      default:
        break;
    }
  };
  
  /**
   * Reset highlighted index when suggestions change
   */
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);
  
  /**
   * Update ARIA attributes for accessibility
   */
  useEffect(() => {
    // Find the input element
    const inputElement = inputWrapperRef.current?.querySelector('input');
    
    if (inputElement) {
      // Set ARIA attributes based on dropdown state
      if (isDropdownOpen) {
        inputElement.setAttribute('aria-expanded', 'true');
        inputElement.setAttribute('aria-controls', 'address-suggestions-list');
      } else {
        inputElement.setAttribute('aria-expanded', 'false');
        inputElement.removeAttribute('aria-controls');
      }
      
      // Set active descendant for keyboard navigation
      if (isDropdownOpen && highlightedIndex >= 0) {
        inputElement.setAttribute('aria-activedescendant', `address-suggestion-${highlightedIndex}`);
      } else {
        inputElement.removeAttribute('aria-activedescendant');
      }
    }
  }, [isDropdownOpen, highlightedIndex]);
  
  return (
    <div 
      className={`${styles.container} ${className}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.inputWrapper} ref={inputWrapperRef}>
        <AutocompleteInput
          value={value}
          onChange={handleInputChange}
          onAddressSuggestions={handleSuggestions}
          onLoadingChange={handleLoadingChange}
          placeholder={placeholder}
          countryCode={countryCode}
          debounceMs={debounceMs}
          minLength={minLength}
          disabled={disabled}
          id={id}
          ariaLabel={ariaLabel}
        />
      </div>
      
      <SuggestionsDropdown
        suggestions={suggestions}
        isOpen={isDropdownOpen}
        isLoading={isLoading}
        onSelect={handleAddressSelect}
        onClose={() => setIsDropdownOpen(false)}
        highlightedIndex={highlightedIndex}
        setHighlightedIndex={setHighlightedIndex}
        inputRef={inputWrapperRef}
      />
    </div>
  );
}

export default Autocomplete;