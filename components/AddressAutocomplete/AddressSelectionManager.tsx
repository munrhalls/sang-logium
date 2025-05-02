'use client';

import React, { useState } from 'react';
import { Autocomplete } from './Autocomplete';
import { AddressResult } from '@/lib/address/geoapifyResponseHandler';
import styles from './AddressSelectionManager.module.css';

/**
 * Interface for a formatted address ready for form submission
 */
export interface FormattedAddress {
  streetAddress: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  formattedAddress: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Props for the AddressSelectionManager component
 */
export interface AddressSelectionManagerProps {
  /** Initial address to populate the component with */
  initialAddress?: AddressResult | null;
  /** Callback when selected address changes */
  onAddressChange?: (address: FormattedAddress | null) => void;
  /** Country code to restrict results (gb or pl) */
  countryCode?: 'gb' | 'pl';
  /** Placeholder text for the input */
  placeholder?: string;
  /** Additional CSS class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Label for the clear button */
  clearButtonLabel?: string;
  /** Selected address prefix label */
  selectedAddressLabel?: string;
}

/**
 * Component that manages the selection of an address
 */
export function AddressSelectionManager({
  initialAddress = null,
  onAddressChange,
  countryCode = 'gb',
  placeholder = 'Enter an address',
  className = '',
  disabled = false,
  clearButtonLabel = 'Clear',
  selectedAddressLabel = 'Selected:',
}: AddressSelectionManagerProps) {
  // State for input value and selected address
  const [inputValue, setInputValue] = useState(initialAddress?.formattedAddress || '');
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(initialAddress);
  
  /**
   * Format the selected address for form submission
   */
  const getFormattedAddress = (): FormattedAddress | null => {
    if (!selectedAddress) return null;
    
    return {
      streetAddress: selectedAddress.streetAddress || '',
      city: selectedAddress.city || '',
      state: selectedAddress.state || '',
      postalCode: selectedAddress.postalCode || '',
      country: selectedAddress.country || '',
      formattedAddress: selectedAddress.formattedAddress || '',
      coordinates: selectedAddress.coordinates ? {
        latitude: selectedAddress.coordinates.latitude,
        longitude: selectedAddress.coordinates.longitude
      } : undefined,
    };
  };
  
  /**
   * Handle input value changes
   */
  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // If the input is cleared, also clear the selected address
    if (!value) {
      clearSelectedAddress();
    }
  };
  
  /**
   * Handle address selection from autocomplete
   */
  const handleAddressSelect = (address: AddressResult) => {
    setSelectedAddress(address);
    setInputValue(address.formattedAddress || '');
    
    // Notify parent component if callback provided
    if (onAddressChange) {
      const formattedAddress = {
        streetAddress: address.streetAddress || '',
        city: address.city || '',
        state: address.state || '',
        postalCode: address.postalCode || '',
        country: address.country || '',
        formattedAddress: address.formattedAddress || '',
        coordinates: address.coordinates ? {
          latitude: address.coordinates.latitude,
          longitude: address.coordinates.longitude
        } : undefined,
      };
      
      onAddressChange(formattedAddress);
    }
  };
  
  /**
   * Clear the selected address
   */
  const clearSelectedAddress = () => {
    setSelectedAddress(null);
    setInputValue('');
    
    // Notify parent component if callback provided
    if (onAddressChange) {
      onAddressChange(null);
    }
  };
  
  return (
    <div className={`${styles.container} ${className}`}>
      <Autocomplete
        value={inputValue}
        onChange={handleInputChange}
        onAddressSelect={handleAddressSelect}
        placeholder={placeholder}
        countryCode={countryCode}
        disabled={disabled}
      />
      
      {selectedAddress && (
        <div className={styles.selectedAddressContainer}>
          <span className={styles.selectedAddressLabel}>
            {selectedAddressLabel} {selectedAddress.formattedAddress || 'Address selected'}
          </span>
          <button
            type="button"
            onClick={clearSelectedAddress}
            className={styles.clearButton}
            disabled={disabled}
            aria-label="Clear selected address"
          >
            {clearButtonLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default AddressSelectionManager;