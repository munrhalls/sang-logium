'use client';

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { formatAutocompleteRequest } from '@/lib/address/geoapifyRequestFormatter';
import { parseAutocompleteResponse, AddressResult } from '@/lib/address/geoapifyResponseHandler';
import styles from './AutocompleteInput.module.css';

/**
 * Props for the AutocompleteInput component
 */
export interface AutocompleteInputProps {
  /** The current input value */
  value: string;
  /** Callback when input value changes */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Callback when address suggestions are received */
  onAddressSuggestions: (suggestions: AddressResult[]) => void;
  /** Callback when an error occurs during API fetch */
  onError?: (error: Error) => void;
  /** Callback when loading state changes */
  onLoadingChange?: (isLoading: boolean) => void;
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
 * Autocomplete input component for Geoapify Address Autocomplete API
 */
export function AutocompleteInput({
  value,
  onChange,
  onAddressSuggestions,
  onError,
  onLoadingChange,
  placeholder = 'Enter an address',
  countryCode,
  debounceMs = 350,
  minLength = 3,
  className = '',
  disabled = false,
  id,
  ariaLabel = 'Address search',
}: AutocompleteInputProps) {
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref for debounce timeout
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref for abort controller to cancel pending requests
  const abortControllerRef = useRef<AbortController | null>(null);
  
  /**
   * Fetch address suggestions based on input value
   */
  const fetchAddressSuggestions = async (searchText: string) => {
    // Don't fetch if input is too short
    if (!searchText || searchText.length < minLength) {
      onAddressSuggestions([]);
      return;
    }
    
    try {
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      
      // Set loading state
      setIsLoading(true);
      if (onLoadingChange) {
        onLoadingChange(true);
      }
      
      // Generate request URL
      const requestUrl = formatAutocompleteRequest(searchText, countryCode);
      
      // Fetch suggestions
      const response = await fetch(requestUrl, { signal });
      
      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(`Address lookup failed: ${response.status} ${response.statusText}`);
      }
      
      // Parse response
      const data = await response.json();
      const suggestions = parseAutocompleteResponse(data);
      
      // Send suggestions to parent component
      onAddressSuggestions(suggestions);
    } catch (error) {
      // Don't process aborted requests
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      
      // Clear suggestions on error
      onAddressSuggestions([]);
      
      // Handle other errors
      if (error instanceof Error && onError) {
        onError(error);
      }
    } finally {
      // Reset loading state
      setIsLoading(false);
      if (onLoadingChange) {
        onLoadingChange(false);
      }
    }
  };
  
  /**
   * Handle input value changes with debounce
   */
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, debounceMs);
    
    // Cleanup on unmount or value change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Cancel any in-flight requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [value, countryCode]);
  
  return (
    <div className={`${styles['address-autocomplete-input']} ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        id={id}
        aria-label={ariaLabel}
        aria-autocomplete="list"
        autoComplete="off"
        className={`${styles['address-input']} ${isLoading ? styles['is-loading'] : ''}`}
      />
      {isLoading && (
        <span className={styles['loading-indicator']} aria-hidden="true">
          Loading...
        </span>
      )}
    </div>
  );
}

export default AutocompleteInput;