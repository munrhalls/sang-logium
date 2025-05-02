'use client';

import React, { useState, useEffect } from 'react';
import AddressSelectionManager, { FormattedAddress } from './AddressSelectionManager';
import { AddressResult } from '@/lib/address/geoapifyResponseHandler';

/**
 * Props for the AddressFormField component
 */
export interface AddressFormFieldProps {
  /** Label for the address field */
  label?: string;
  /** Initial address to populate the field with */
  initialAddress?: AddressResult | null;
  /** Whether the field is required */
  required?: boolean;
  /** Country code to restrict results (gb or pl) */
  countryCode?: 'gb' | 'pl';
  /** Label for the country selector */
  countrySelectLabel?: string;
  /** Callback when address changes */
  onChange?: (address: FormattedAddress | null) => void;
  /** Callback when field is blurred */
  onBlur?: () => void;
  /** Error message to display */
  error?: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Additional CSS class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** ID attribute for the field */
  id?: string;
}

/**
 * Form field component for address selection
 */
export function AddressFormField({
  label = 'Address',
  initialAddress = null,
  required = false,
  countryCode: initialCountryCode = 'gb',
  countrySelectLabel = 'Country',
  onChange,
  onBlur,
  error,
  placeholder = 'Enter an address',
  className = '',
  disabled = false,
  id,
}: AddressFormFieldProps) {
  // State for selected address and validation
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(initialAddress);
  const [touched, setTouched] = useState(false);
  const [countryCode, setCountryCode] = useState<'gb' | 'pl'>(initialCountryCode);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  /**
   * Handle address change from AddressSelectionManager
   */
  const handleAddressChange = (address: AddressResult | null) => {
    setSelectedAddress(address);
    
    // Validate if the field has been touched
    if (touched) {
      validateAddress(address);
    }
    
    // Notify parent component if callback provided
    if (onChange && address) {
      const formattedAddress: FormattedAddress = {
        streetAddress: address.streetAddress || '',
        city: address.city || '',
        state: address.state || '',
        postalCode: address.postalCode || '',
        country: address.country || '',
        formattedAddress: address.formattedAddress || '',
        coordinates: address.coordinates,
      };
      onChange(formattedAddress);
    } else if (onChange) {
      onChange(null);
    }
  };
  
  /**
   * Handle country code change
   */
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value as 'gb' | 'pl');
    // Reset selected address when country changes
    setSelectedAddress(null);
    if (onChange) {
      onChange(null);
    }
  };
  
  /**
   * Handle blur event
   */
  const handleBlur = () => {
    setTouched(true);
    validateAddress(selectedAddress);
    if (onBlur) {
      onBlur();
    }
  };
  
  /**
   * Validate address
   */
  const validateAddress = (address: AddressResult | null): boolean => {
    if (required && !address) {
      setValidationError('Please select an address');
      return false;
    }
    
    setValidationError(null);
    return true;
  };
  
  // Update validation when required prop changes
  useEffect(() => {
    if (touched) {
      validateAddress(selectedAddress);
    }
  }, [required, touched, selectedAddress]);
  
  // Update country code when prop changes
  useEffect(() => {
    if (initialCountryCode !== countryCode) {
      setCountryCode(initialCountryCode);
    }
  }, [initialCountryCode]);
  
  // Generate unique ID for accessibility
  const fieldId = id || `address-field-${Math.random().toString(36).substr(2, 9)}`;
  const countryId = `${fieldId}-country`;
  
  return (
    <div className={`address-form-field ${className}`}>
      {label && (
        <label 
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="mb-2">
        <label 
          htmlFor={countryId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {countrySelectLabel}
        </label>
        <select 
          id={countryId}
          value={countryCode} 
          onChange={handleCountryChange}
          disabled={disabled}
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          aria-label="Select country"
        >
          <option value="gb">United Kingdom</option>
          <option value="pl">Poland</option>
        </select>
      </div>
      
      <div onBlur={handleBlur}>
        <AddressSelectionManager
          initialAddress={selectedAddress}
          onAddressChange={handleAddressChange}
          countryCode={countryCode}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      
      {(validationError || error) && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {validationError || error}
        </p>
      )}
    </div>
  );
}

export default AddressFormField;