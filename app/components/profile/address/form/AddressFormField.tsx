'use client';
import React, { useState, useEffect } from 'react';
import { AddressSelectionManager, FormattedAddress } from './AddressSelectionManager';
import { AddressResult } from '@/lib/address/geoapifyResponseHandler';
import styles from './AddressFormField.module.css';
export interface AddressFormFieldProps {
  label?: string;
  initialAddress?: AddressResult | null;
  required?: boolean;
  countryCode?: 'gb' | 'pl';
  countrySelectLabel?: string;
  onChange?: (address: FormattedAddress | null) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
}
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
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(initialAddress);
  const [touched, setTouched] = useState(false);
  const [countryCode, setCountryCode] = useState<'gb' | 'pl'>(initialCountryCode);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fieldId = id || `address-field-${Math.random().toString(36).substring(2, 9)}`;
  const countryId = `${fieldId}-country`;
  const handleAddressChange = (address: FormattedAddress | null) => {
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
    if (touched) {
      validateAddress(addressResult);
    }
    if (onChange) {
      onChange(address);
    }
  };
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountryCode = e.target.value as 'gb' | 'pl';
    setCountryCode(newCountryCode);
    setSelectedAddress(null);
    if (onChange) {
      onChange(null);
    }
  };
  const handleBlur = () => {
    setTouched(true);
    validateAddress(selectedAddress);
    if (onBlur) {
      onBlur();
    }
  };
  const validateAddress = (address: AddressResult | null): boolean => {
    if (required && !address) {
      setValidationError('Please select an address');
      return false;
    }
    setValidationError(null);
    return true;
  };
  useEffect(() => {
    if (touched) {
      validateAddress(selectedAddress);
    }
  }, [required, touched]);
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
      {}
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