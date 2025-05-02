'use client';

import React, { useState, ChangeEvent } from 'react';
import { AddressResult } from '@/lib/address/geoapifyResponseHandler';
import { Autocomplete } from './Autocomplete';

/**
 * Props for the AddressSelectionManager component
 */
export interface AddressSelectionManagerProps {
  /** Initial address to populate the component with */
  initialAddress?: AddressResult | null;
  /** Callback when selected address changes */
  onAddressChange?: (address: AddressResult | null) => void;
  /** Optional country code to restrict results (gb or pl) */
  countryCode?: 'gb' | 'pl';
  /** Placeholder text for the input */
  placeholder?: string;
  /** Additional CSS class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Interface for address data ready for form submission
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
 * Component for managing the selection of an address
 */
export function AddressSelectionManager({
  initialAddress = null,
  onAddressChange,
  countryCode,
  placeholder = 'Enter an address',
  className = '',
  disabled = false,
}: AddressSelectionManagerProps) {
  // State for input value and selected address
  const [inputValue, setInputValue] = useState(initialAddress?.formattedAddress || '');
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(initialAddress);
  
  /**
   * Handle input change
   */
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    
    // If input is cleared, also clear the selected address
    if (!value) {
      clearSelectedAddress();
    }
  };
  
  /**
   * Handle address selection
   */
  const handleAddressSelect = (address: AddressResult) => {
    setSelectedAddress(address);
    setInputValue(address.formattedAddress || '');
    
    // Notify parent component if callback provided
    if (onAddressChange) {
      onAddressChange(address);
    }
  };
  
  /**
   * Clear selected address
   */
  const clearSelectedAddress = () => {
    setSelectedAddress(null);
    
    // Notify parent component if callback provided
    if (onAddressChange) {
      onAddressChange(null);
    }
  };
  
  /**
   * Format selected address for form submission
   */
  const getFormattedAddress = (): FormattedAddress | null => {
    if (!selectedAddress) return null;
    
    return {
      streetAddress: selectedAddress.streetAddress || '',
      city: selectedAddress.city || '',
      state: selectedAddress.state || '',
      postalCode: selectedAddress.postalCode,
      country: selectedAddress.country || '',
      formattedAddress: selectedAddress.formattedAddress || '',
      coordinates: selectedAddress.coordinates ? {
        latitude: selectedAddress.coordinates.latitude,
        longitude: selectedAddress.coordinates.longitude
      } : undefined,
    };
  };
  
  return (
    <div className="address-selection-manager">
      <Autocomplete
        value={inputValue}
        onChange={handleInputChange}
        onAddressSelect={handleAddressSelect}
        placeholder={placeholder}
        countryCode={countryCode}
        className={className}
        disabled={disabled}
      />
      
      {selectedAddress && (
        <div className="mt-2 flex items-center">
          <span className="text-sm text-gray-700 mr-2">
            Selected: {selectedAddress.formattedAddress || 'Address selected'}
          </span>
          <button
            type="button"
            onClick={() => {
              setInputValue('');
              clearSelectedAddress();
            }}
            className="text-xs text-gray-500 hover:text-gray-700"
            disabled={disabled}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default AddressSelectionManager;