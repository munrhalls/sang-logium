'use client';
import React, { useState, FormEvent } from 'react';
import { AddressFormField } from './AddressFormField';
import { useAddressField } from '@/hooks/useAddressField';
import { FormattedAddress } from './AddressSelectionManager';
export function FormExample() {
  const [shippingAddress, setShippingAddress] = useState<FormattedAddress | null>(null);
  const {
    address: billingAddress,
    handleAddressChange: handleBillingAddressChange,
    isValid: isBillingAddressValid,
    error: billingAddressError,
    countryCode: billingCountryCode,
    handleCountryChange: handleBillingCountryChange,
    convertToAddressResult
  } = useAddressField({
    required: true
  });
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!shippingAddress) {
      alert('Please select a shipping address');
      return;
    }
    if (!isBillingAddressValid) {
      alert('Please select a valid billing address');
      return;
    }
    console.log('Form submitted with:', {
      shippingAddress,
      billingAddress
    });
    alert('Form submitted successfully!');
  };
  return (
    <div style={{ maxWidth: '600px', padding: '20px' }}>
      <h2>Address Form Example</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <h3>Example 1: Direct Component Usage</h3>
          <AddressFormField
            label="Shipping Address"
            required={true}
            countryCode="gb"
            onChange={setShippingAddress}
            placeholder="Enter shipping address"
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3>Example 2: Using useAddressField Hook</h3>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
            Billing Country
            {billingCountryCode === 'gb' ? ' (United Kingdom)' : ' (Poland)'}
          </label>
          <select 
            value={billingCountryCode}
            onChange={(e) => handleBillingCountryChange(e.target.value as 'gb' | 'pl')}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 12px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <option value="gb">United Kingdom</option>
            <option value="pl">Poland</option>
          </select>
          <AddressFormField
            label="Billing Address"
            initialAddress={convertToAddressResult(billingAddress)}
            onChange={handleBillingAddressChange}
            required={true}
            countryCode={billingCountryCode}
            placeholder="Enter billing address"
            error={billingAddressError || undefined}
          />
        </div>
        <button 
          type="submit"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 16px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Submit Form
        </button>
      </form>
      <div style={{ marginTop: '30px' }}>
        <h3>Form Values Preview:</h3>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '16px', 
          borderRadius: '4px' 
        }}>
          <h4>Shipping Address:</h4>
          <pre style={{ overflowX: 'auto' }}>
            {JSON.stringify(shippingAddress, null, 2) || 'Not selected'}
          </pre>
          <h4>Billing Address:</h4>
          <pre style={{ overflowX: 'auto' }}>
            {JSON.stringify(billingAddress, null, 2) || 'Not selected'}
          </pre>
        </div>
      </div>
    </div>
  );
}
export default FormExample;