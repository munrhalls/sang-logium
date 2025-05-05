'use client';
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { formatAutocompleteRequest } from '@/lib/address/geoapifyRequestFormatter';
import { parseAutocompleteResponse, AddressResult } from '@/lib/address/geoapifyResponseHandler';
import styles from './AutocompleteInput.module.css';
export interface AutocompleteInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAddressSuggestions: (suggestions: AddressResult[]) => void;
  onError?: (error: Error) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  placeholder?: string;
  countryCode?: 'gb' | 'pl';
  debounceMs?: number;
  minLength?: number;
  className?: string;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
}
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
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchAddressSuggestions = async (searchText: string) => {
    if (!searchText || searchText.length < minLength) {
      onAddressSuggestions([]);
      return;
    }
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      setIsLoading(true);
      if (onLoadingChange) {
        onLoadingChange(true);
      }
      const requestUrl = formatAutocompleteRequest(searchText, countryCode);
      const response = await fetch(requestUrl, { signal });
      if (!response.ok) {
        throw new Error(`Address lookup failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const suggestions = parseAutocompleteResponse(data);
      onAddressSuggestions(suggestions);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      onAddressSuggestions([]);
      if (error instanceof Error && onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
      if (onLoadingChange) {
        onLoadingChange(false);
      }
    }
  };
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, debounceMs);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
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