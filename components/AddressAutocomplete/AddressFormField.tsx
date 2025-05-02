'use client';

import React, { useState, useEffect } from 'react';
import { AddressSelectionManager, FormattedAddress } from './AddressSelectionManager';
import { AddressResult } from '@/lib/address/geoapifyResponseHandler';
import styles from './AddressFormField.module.css';

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
  /** Initial country code to restrict results (gb or pl) */
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
  /** Name attribute for the field (for form integration) */
  name?: string;
}

/**
 * Form field component for address selection with country selector and validation
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
  name,
}: AddressFormFieldProps) {
  // State for selected address and validation
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(initialAddress);
  const [touched, setTouched] = useState(false);
  const [countryCode, setCountryCode] = useState<'gb' | 'pl'>(initialCountryCode);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Generate unique field id if not provided
  const fieldId = id || `address-field-${Math.random().toString(36).substring(2, 9)}`;
  const countryId = `${fieldId}-country`;
  
  /**
   * Handle address change from AddressSelectionManager
   */
  const handleAddressChange = (address: FormattedAddress | null) => {
    // Convert FormattedAddress back to AddressResult for internal state
    const addressResult = address ? {
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      formattedAddress: address.formattedAddress,
      coordinates: address.coordinates ? {
        longitude: address.coordinates.longitude,
        latitude: address.coordinates.latitude
      } : undefined
    } as AddressResult : null;
    
    setSelectedAddress(addressResult);
    
    // Validate if the field has been touched
    if (touched) {
      validateAddress(addressResult);
    }
    
    // Notify parent component if callback provided
    if (onChange) {
      onChange(address);
    }
  };
  
  /**
   * Handle country code change
   */
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountryCode = e.target.value as 'gb' | 'pl';
    setCountryCode(newCountryCode);
    
    // Reset selected address when country changes
    setSelectedAddress(null);
    
    // Notify parent component if callback provided
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
  }, [required, touched]);
  
  // Update country code when prop changes
  useEffect(() => {
    if (initialCountryCode !== countryCode) {
      setCountryCode(initialCountryCode);
    }
  }, [initialCountryCode]);
  
  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <label 
          htmlFor={fieldId}
          className={styles.label}
        >
          {label}
          {required && <span className={styles.requiredMark}>*</span>}
        </label>
      )}
      
      <div className={styles.countrySelectContainer}>
        <label 
          htmlFor={countryId}
          className={styles.countrySelectLabel}
        >
          {countrySelectLabel}
        </label>
        <select 
          id={countryId}
          name={name ? `${name}-country` : undefined}
          value={countryCode} 
          onChange={handleCountryChange}
          disabled={disabled}
          className={styles.countrySelect}
          aria-label="Select country"
        >
          <option value="gb">United Kingdom</option>
          <option value="pl">Poland</option>
        </select>
      </div>
      
      <div onBlur={handleBlur} className={styles.addressSelectionContainer}>
        <AddressSelectionManager
          initialAddress={selectedAddress}
          onAddressChange={handleAddressChange}
          countryCode={countryCode}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      
      {(validationError || error) && (
        <p className={styles.errorMessage} role="alert">
          {validationError || error}
        </p>
      )}
      
      {/* Hidden input for form serialization */}
      {name && (
        <input 
          type="hidden" 
          name={name} 
          value={selectedAddress?.formattedAddress || ''} 
        />
      )}
    </div>
  );
}

export default AddressFormField;