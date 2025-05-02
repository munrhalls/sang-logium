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
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
  
  // Reference to the input component
  const inputRef = useRef<HTMLInputElement>(null);
  
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
    onAddressSelect(address);
    setIsDropdownOpen(false);
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
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  /**
   * Reset highlighted index when suggestions change
   */
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);
  
  return (
    <div 
      className={`${styles.container} ${className}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.inputWrapper} ref={inputRef}>
        <AutocompleteInput
          value={value}
          onChange={onChange}
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
        inputRef={inputRef}
      />
    </div>
  );
}

export default Autocomplete;