'use client';
import React, { useState } from 'react';
import { Autocomplete } from './Autocomplete';
import { AddressResult } from '@/lib/address/geoapifyResponseHandler';
import styles from './AddressSelectionManager.module.css';
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
export interface AddressSelectionManagerProps {
  initialAddress?: AddressResult | null;
  onAddressChange?: (address: FormattedAddress | null) => void;
  countryCode?: 'gb' | 'pl';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  clearButtonLabel?: string;
  selectedAddressLabel?: string;
}
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
  const [inputValue, setInputValue] = useState(initialAddress?.formattedAddress || '');
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(initialAddress);
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
  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (!value) {
      clearSelectedAddress();
    }
  };
  const handleAddressSelect = (address: AddressResult) => {
    setSelectedAddress(address);
    setInputValue(address.formattedAddress || '');
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
  const clearSelectedAddress = () => {
    setSelectedAddress(null);
    setInputValue('');
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