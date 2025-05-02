'use client';

import { useState, useCallback } from 'react';
import { FormattedAddress } from '@/components/AddressAutocomplete/AddressSelectionManager';
import { AddressResult } from '@/lib/address/geoapifyResponseHandler';

/**
 * Props for the useAddressField hook
 */
export interface UseAddressFieldProps {
  /** Initial address to populate the field with */
  initialAddress?: FormattedAddress | null;
  /** Callback when address changes */
  onAddressChange?: (address: FormattedAddress | null) => void;
  /** Whether the field is required for validation */
  required?: boolean;
}

/**
 * Hook for easy integration of address fields with form libraries
 */
export function useAddressField({
  initialAddress = null,
  onAddressChange,
  required = false,
}: UseAddressFieldProps = {}) {
  // State for address and validation
  const [address, setAddress] = useState<FormattedAddress | null>(initialAddress);
  const [isValid, setIsValid] = useState(!required || !!initialAddress);
  const [isTouched, setIsTouched] = useState(false);
  
  /**
   * Handle address change
   */
  const handleAddressChange = useCallback((newAddress: FormattedAddress | null) => {
    setAddress(newAddress);
    setIsValid(!required || !!newAddress);
    
    if (isTouched) {
      setIsTouched(true);
    }
    
    if (onAddressChange) {
      onAddressChange(newAddress);
    }
  }, [onAddressChange, required, isTouched]);
  
  /**
   * Handle field blur
   */
  const handleBlur = useCallback(() => {
    setIsTouched(true);
    setIsValid(!required || !!address);
  }, [address, required]);
  
  /**
   * Convert FormattedAddress to AddressResult for the component
   */
  const convertToAddressResult = useCallback((formattedAddress: FormattedAddress | null): AddressResult | null => {
    if (!formattedAddress) return null;
    
    return {
      streetAddress: formattedAddress.streetAddress || '',
      city: formattedAddress.city || '',
      state: formattedAddress.state || '',
      postalCode: formattedAddress.postalCode || '',
      country: formattedAddress.country || '',
      formattedAddress: formattedAddress.formattedAddress || '',
      coordinates: formattedAddress.coordinates ? {
        longitude: formattedAddress.coordinates.longitude,
        latitude: formattedAddress.coordinates.latitude
      } : undefined,
    };
  }, []);
  
  /**
   * Reset the address field
   */
  const resetField = useCallback(() => {
    setAddress(null);
    setIsValid(!required);
    setIsTouched(false);
  }, [required]);
  
  /**
   * Validate the field and return error message if invalid
   */
  const validate = useCallback((): string | null => {
    if (required && !address) {
      return 'Please select an address';
    }
    return null;
  }, [address, required]);
  
  return {
    // State
    address,
    setAddress,
    isValid,
    isTouched,
    
    // Handlers
    handleAddressChange,
    handleBlur,
    resetField,
    validate,
    
    // Utility
    convertToAddressResult,
    
    // Address components for direct form access
    addressValue: address?.formattedAddress || '',
    streetAddress: address?.streetAddress || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postalCode || '',
    country: address?.country || '',
    coordinates: address?.coordinates,
    
    // Form field object (compatible with React Hook Form)
    field: {
      value: address,
      onChange: handleAddressChange,
      onBlur: handleBlur,
    },
  };
}

export default useAddressField;