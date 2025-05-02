'use client';

import React, { useState } from 'react';
import { AddressSelectionManager, FormattedAddress } from './AddressSelectionManager';

/**
 * Example component demonstrating how to use the AddressSelectionManager
 */
export function AddressSelectionExample() {
  const [selectedAddress, setSelectedAddress] = useState<FormattedAddress | null>(null);
  
  const handleAddressChange = (address: FormattedAddress | null) => {
    setSelectedAddress(address);
    console.log('Address changed:', address);
  };
  
  return (
    <div style={{ maxWidth: '500px', padding: '20px' }}>
      <h2>Address Selection Example</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <AddressSelectionManager
          onAddressChange={handleAddressChange}
          countryCode="gb"
          placeholder="Enter your address"
        />
      </div>
      
      {selectedAddress && (
        <div style={{ marginTop: '20px' }}>
          <h3>Selected Address Details:</h3>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(selectedAddress, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default AddressSelectionExample;