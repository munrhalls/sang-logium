import axios from 'axios';
import { Address } from '@/sanity/lib/profiles/profileTypes';

// Interface for verification results
export interface AddressVerificationResult {
  isValid: boolean;
  errors: string[];
  suggestions?: Partial<Address>;
  originalAddress: Partial<Address>;
}

// List of US states for basic validation
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
  'Wisconsin', 'Wyoming', 'District of Columbia'
];

// List of Canadian provinces
const CANADA_PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
  'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
  'Quebec', 'Saskatchewan', 'Yukon'
];

// Sample of major cities for basic validation
const MAJOR_CITIES = [
  // US
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
  'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus',
  'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Boston',
  // Canada
  'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg',
  'Quebec City', 'Hamilton', 'Halifax',
  // UK
  'London', 'Birmingham', 'Manchester', 'Glasgow', 'Edinburgh', 'Liverpool', 'Bristol',
  // Australia
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
  // Other major international cities
  'Tokyo', 'Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'Warsaw', 'Moscow', 'Athens',
  'Shanghai', 'Beijing', 'Hong Kong', 'Singapore', 'Seoul', 'Bangkok', 'Mumbai', 'Dubai',
  'Istanbul', 'Cairo', 'Buenos Aires', 'Mexico City', 'São Paulo', 'Rio de Janeiro',
  'Johannesburg', 'Cape Town', 'Auckland'
];

// Postal/ZIP code patterns for basic validation
const POSTAL_CODE_PATTERNS: { [country: string]: RegExp } = {
  'United States': /^\d{5}(-\d{4})?$/,
  'Canada': /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
  'United Kingdom': /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
  'Australia': /^\d{4}$/,
  'Germany': /^\d{5}$/,
  'France': /^\d{5}$/,
  'Japan': /^\d{3}-\d{4}$/,
  'China': /^\d{6}$/,
  'India': /^\d{6}$/,
  'Brazil': /^\d{5}-\d{3}$/,
  'Mexico': /^\d{5}$/,
  'Italy': /^\d{5}$/,
  'Spain': /^\d{5}$/,
  'Netherlands': /^\d{4} [A-Z]{2}$/,
  'South Korea': /^\d{5}$/,
  'Russia': /^\d{6}$/
};

/**
 * Performs a basic address verification using local data
 * This function handles basic checks without external API calls
 */
const performBasicVerification = (address: Partial<Address>): AddressVerificationResult => {
  const errors: string[] = [];
  const suggestions: Partial<Address> = {};
  let isValid = true;

  // Basic check - Require street address, city and country
  if (!address.streetAddress || address.streetAddress.trim().length < 5) {
    errors.push('Street address is too short or missing');
    isValid = false;
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.push('City is too short or missing');
    isValid = false;
  }

  if (!address.country || address.country.trim().length < 2) {
    errors.push('Country is required');
    isValid = false;
  }

  // Check if city looks like a real city
  if (address.city && !isLikelyRealCity(address.city)) {
    errors.push('City name appears to be non-standard');
    isValid = false;
  }

  // Check state/province for certain countries
  if (address.country === 'United States' && address.state) {
    if (!US_STATES.some(state => 
      state.toLowerCase() === address.state?.toLowerCase() ||
      stateAbbreviationToFull(address.state?.toUpperCase()) !== null
    )) {
      errors.push('Invalid US state');
      isValid = false;
    }
  }
  
  if (address.country === 'Canada' && address.state) {
    if (!CANADA_PROVINCES.some(province => 
      province.toLowerCase() === address.state?.toLowerCase() ||
      provinceAbbreviationToFull(address.state?.toUpperCase()) !== null
    )) {
      errors.push('Invalid Canadian province');
      isValid = false;
    }
  }

  // Check postal code for specific countries
  if (address.country && address.postalCode) {
    const pattern = POSTAL_CODE_PATTERNS[address.country];
    if (pattern && !pattern.test(address.postalCode)) {
      errors.push(`Invalid postal code format for ${address.country}`);
      isValid = false;
    }
  }

  // Check for potential address quality issues
  if (address.streetAddress) {
    // Street address should typically include numbers
    if (!/\d/.test(address.streetAddress)) {
      errors.push('Street address appears to be missing a number');
      isValid = false;
    }
    
    // Check for gibberish (just a single word or excessive repetition)
    if (/^[a-zA-Z]+$/.test(address.streetAddress.trim()) || /(.)\1{3,}/.test(address.streetAddress)) {
      errors.push('Street address appears to be incomplete or invalid');
      isValid = false;
    }
    
    // Check for keyboard patterns (qwerty, asdf, etc.)
    const keyboardPatterns = [
      'qwerty', 'asdfgh', 'zxcvbn', 'yuiop', 'hjkl', 
      'poiuyt', 'lkjhgf', 'mnbvcx', 'qazwsx', 'edcrfv'
    ];
    
    if (keyboardPatterns.some(pattern => address.streetAddress.toLowerCase().includes(pattern))) {
      errors.push('Street address contains suspicious keyboard patterns');
      isValid = false;
    }
    
    // Check for abnormal character distribution
    const letterCount = (address.streetAddress.match(/[a-zA-Z]/g) || []).length;
    const numberCount = (address.streetAddress.match(/[0-9]/g) || []).length;
    const spaceCount = (address.streetAddress.match(/\s/g) || []).length;
    
    // Typical addresses have a reasonable mix of letters, numbers and spaces
    // If the ratio is way off, it's likely nonsense
    if (address.streetAddress.length > 5) {
      // Check if almost all characters are the same type
      if (letterCount > 0 && letterCount / address.streetAddress.length > 0.9) {
        errors.push('Street address contains too many letters without numbers or spaces');
        isValid = false;
      }
      
      // Addresses generally have spaces between components
      if (spaceCount === 0 && address.streetAddress.length > 10) {
        errors.push('Street address appears to be missing spaces between words');
        isValid = false;
      }
      
      // Check word pattern - most addresses have 2+ words
      const words = address.streetAddress.trim().split(/\s+/);
      if (words.length < 2) {
        errors.push('Street address should typically contain multiple words or parts');
        isValid = false;
      }
    }
  }

  return {
    isValid,
    errors,
    suggestions,
    originalAddress: address
  };
};

/**
 * Get API keys from environment variables
 */
function getApiKeys(): { geocodio: string | null; googleMaps: string | null } {
  // Get keys from environment variables
  const geocodioKey = process.env.NEXT_PUBLIC_GEOCODIO_API_KEY || null;
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null;
  
  // For development/testing, use placeholders if environment variables aren't set
  return {
    geocodio: geocodioKey || 'demo_geocodio_key_placeholder',
    googleMaps: googleMapsKey || 'demo_google_maps_key_placeholder'
  };
}

/**
 * Interface for Google Maps Platform Address Validation API response
 */
interface GoogleMapsAddressValidationResponse {
  result?: {
    verdict: {
      addressComplete: boolean;
      hasUnconfirmedComponents: boolean;
      hasInferredComponents: boolean;
      hasReplacedComponents: boolean;
    };
    address: {
      formattedAddress: string;
      postalAddress: {
        regionCode: string;
        languageCode: string;
        administrativeArea: string;
        locality: string;
        addressLines: string[];
        recipients: string[];
        organization: string;
        postalCode: string;
      };
      addressComponents: Array<{
        componentType: string;
        componentName: {
          text: string;
          languageCode: string;
        };
        confirmationLevel: string;
        inferred?: boolean;
        spellCorrected?: boolean;
        replaced?: boolean;
      }>;
    };
    geocode?: {
      location: {
        latitude: number;
        longitude: number;
      };
      plusCode: {
        globalCode: string;
        compoundCode: string;
      };
      bounds: {
        low: {
          latitude: number;
          longitude: number;
        };
        high: {
          latitude: number;
          longitude: number;
        };
      };
      featureSizeMeters: number;
      placeId: string;
    };
    metadata: {
      business: boolean;
      poBox: boolean;
      residential: boolean;
    };
    uspsData?: {
      standardizedAddress: {
        firstAddressLine: string;
        cityStateZipAddressLine: string;
        city: string;
        state: string;
        zipCode: string;
        zipCodeExtension: string;
      };
      deliveryPointCode: string;
      deliveryPointCheckDigit: string;
      dpvConfirmation: string;
      dpvFootnotes: string[];
      businessAddress: boolean;
      centralDeliveryPoint: boolean;
      vacant: boolean;
    };
  };
}

/**
 * Performs an address verification using available external APIs (Geocodio or Google Maps)
 */
const performExternalVerification = async (address: Partial<Address>): Promise<AddressVerificationResult> => {
  // Format the address for API
  const formattedAddress = formatAddressForApi(address);
  
  // Create a fallback result in case the API call fails
  const fallbackResult: AddressVerificationResult = {
    isValid: false, // Change to false - if API fails, fallback to basic validation
    errors: ['Address verification service unavailable. Please check your address carefully.'],
    originalAddress: address
  };

  // Get the API keys
  const { geocodio: geocodioKey, googleMaps: googleMapsKey } = getApiKeys();
  
  // If no API keys, return the fallback
  if (!geocodioKey && !googleMapsKey) {
    console.error('No address verification API keys found');
    return fallbackResult;
  }

  try {
    let response;
    let useGoogleMaps = false;
    
    // Check if we're in a dev/test environment or if the API keys are placeholders
    if (process.env.NODE_ENV === 'development' || 
        (geocodioKey === 'demo_geocodio_key_placeholder' && googleMapsKey === 'demo_google_maps_key_placeholder')) {
      // Use simulated response in development/test environments
      console.log('Using simulated address verification response');
      
      // Decide which API to simulate based on a consistent pattern
      // This ensures that Google Maps API simulation is also tested in development
      const simulateGoogleApi = address.city?.length && address.city.length % 2 === 0;
      
      if (simulateGoogleApi) {
        console.log('Simulating Google Maps API response');
        response = { data: simulateApiResponse(address, 'google'), source: 'google' };
      } else {
        console.log('Simulating Geocodio API response');
        response = { data: simulateApiResponse(address, 'geocodio') };
      }
    } else {
      // Try Google Maps Address Validation API first (if available)
      if (googleMapsKey && googleMapsKey !== 'demo_google_maps_key_placeholder') {
        try {
          useGoogleMaps = true;
          // Prepare address for Google Maps Address Validation API
          const addressForValidation = {
            address: {
              regionCode: address.country === 'United States' ? 'US' : (address.country || ''),
              locality: address.city || '',
              administrativeArea: address.state || '',
              postalCode: address.postalCode || '',
              addressLines: [address.streetAddress || '']
            },
            enableUspsCass: true // Get USPS validation data when available
          };

          // Call Google Maps Platform Address Validation API
          const googleResponse = await axios.post(
            `https://addressvalidation.googleapis.com/v1:validateAddress?key=${googleMapsKey}`,
            addressForValidation
          );
          
          response = { data: googleResponse.data, source: 'google' };
        } catch (googleError) {
          console.error('Google Maps Address Validation API error:', googleError);
          useGoogleMaps = false;
          
          // Fall back to Geocodio if Google Maps fails
          if (geocodioKey && geocodioKey !== 'demo_geocodio_key_placeholder') {
            try {
              response = await axios.get(
                `https://api.geocod.io/v1.7/geocode?q=${encodeURIComponent(formattedAddress)}&api_key=${geocodioKey}`
              );
            } catch (geocodioError) {
              console.error('Geocodio API error:', geocodioError);
              throw new Error('All address verification APIs failed');
            }
          } else {
            throw new Error('No valid API key available after Google Maps API failure');
          }
        }
      } 
      // If no Google Maps key, try Geocodio
      else if (geocodioKey && geocodioKey !== 'demo_geocodio_key_placeholder') {
        try {
          response = await axios.get(
            `https://api.geocod.io/v1.7/geocode?q=${encodeURIComponent(formattedAddress)}&api_key=${geocodioKey}`
          );
        } catch (geocodioError) {
          console.error('Geocodio API error:', geocodioError);
          throw new Error('Geocodio address verification API failed');
        }
      } else {
        // No valid API keys available, use simulation
        console.log('No valid API keys, using simulated response');
        
        // Decide which API to simulate based on a consistent pattern
        const simulateGoogleApi = address.city?.length && address.city.length % 2 === 0;
        
        if (simulateGoogleApi) {
          console.log('Simulating Google Maps API response');
          response = { data: simulateApiResponse(address, 'google'), source: 'google' };
        } else {
          console.log('Simulating Geocodio API response');
          response = { data: simulateApiResponse(address, 'geocodio') };
        }
      }
    }
    
    // Process the API response based on which API was used
    if (useGoogleMaps || response.source === 'google') {
      // Process Google Maps API response
      const googleData = response.data as GoogleMapsAddressValidationResponse;
      
      if (googleData.result) {
        const verdict = googleData.result.verdict;
        const components = googleData.result.address.addressComponents || [];
        
        // Determine if address is valid based on Google's verdict
        const isValid = verdict.addressComplete && 
                        !verdict.hasUnconfirmedComponents && 
                        (!verdict.hasInferredComponents || verdict.hasInferredComponents === false);
        
        const errors: string[] = [];
        const suggestions: Partial<Address> = {};
        
        if (!isValid) {
          errors.push('Address could not be fully verified');
          
          // Add specific errors based on validation results
          if (!verdict.addressComplete) {
            errors.push('The address appears to be incomplete');
          }
          if (verdict.hasUnconfirmedComponents) {
            errors.push('Some parts of the address could not be confirmed');
          }
          if (verdict.hasInferredComponents) {
            errors.push('Some parts of the address were inferred (guessed)');
          }
          if (verdict.hasReplacedComponents) {
            errors.push('Some parts of the address were automatically corrected');
          }
          
          // Generate suggestions from the corrected address
          const addressLines = googleData.result.address.postalAddress?.addressLines || [];
          if (addressLines.length > 0) {
            suggestions.streetAddress = addressLines[0];
          }
          
          if (googleData.result.address.postalAddress) {
            suggestions.city = googleData.result.address.postalAddress.locality;
            suggestions.state = googleData.result.address.postalAddress.administrativeArea;
            suggestions.postalCode = googleData.result.address.postalAddress.postalCode;
            
            // Extract country code and convert to full country name if possible
            const regionCode = googleData.result.address.postalAddress.regionCode;
            if (regionCode) {
              // Convert country code to name (simplified example, would need complete mapping)
              const countryMapping: Record<string, string> = {
                'US': 'United States',
                'CA': 'Canada',
                'GB': 'United Kingdom',
                'AU': 'Australia',
                'DE': 'Germany',
                'FR': 'France',
                // Add more mappings as needed
              };
              suggestions.country = countryMapping[regionCode] || regionCode;
            }
          }
          
          // If we have USPS data, use it for US addresses
          if (googleData.result.uspsData) {
            const uspsData = googleData.result.uspsData;
            suggestions.streetAddress = uspsData.standardizedAddress.firstAddressLine;
            suggestions.city = uspsData.standardizedAddress.city;
            suggestions.state = uspsData.standardizedAddress.state;
            suggestions.postalCode = uspsData.standardizedAddress.zipCode;
            if (uspsData.standardizedAddress.zipCodeExtension) {
              suggestions.postalCode += '-' + uspsData.standardizedAddress.zipCodeExtension;
            }
            suggestions.country = 'United States';
            
            // Add USPS-specific validation information
            if (uspsData.dpvFootnotes && uspsData.dpvFootnotes.length > 0) {
              // Translate USPS footnotes into user-friendly messages
              const footnoteMessages: Record<string, string> = {
                'AA': 'Address was matched with the ZIP+4 file',
                'A1': 'Address not matched',
                'BB': 'Matched to the building number',
                'CC': 'Matched to the street name',
                'N1': 'Address not found',
                'M1': 'Missing secondary information (apartment, suite, etc.)',
                'P1': 'Missing PO Box, Rural Route, or Highway Contract box number',
                'RR': 'Confirmed address is a rural route',
                'R1': 'Confirmed with significant modifications',
                'U1': 'Matched to a unique ZIP code'
              };
              
              uspsData.dpvFootnotes.forEach(code => {
                if (footnoteMessages[code]) {
                  errors.push(`USPS: ${footnoteMessages[code]}`);
                }
              });
            }
            
            // Check if it's a vacant address
            if (uspsData.vacant) {
              errors.push('USPS indicates this address is vacant');
            }
          }
        }
        
        return {
          isValid,
          errors,
          suggestions: isValid ? undefined : suggestions,
          originalAddress: address
        };
      }
      
      // If no valid result was found in Google response
      return {
        isValid: false,
        errors: ['The address could not be recognized by Google Maps'],
        originalAddress: address
      };
    } else {
      // Process Geocodio API response (original implementation)
      if (response.data.results && response.data.results.length > 0) {
        const verifiedAddress = response.data.results[0];
        
        // Check if accuracy level is acceptable (typically above 0.8 is considered good)
        const isValid = verifiedAddress.accuracy >= 0.7; // Slightly more lenient
        
        const errors = [];
        const suggestions: Partial<Address> = {};
        
        if (!isValid) {
          errors.push('Address could not be verified with sufficient confidence');
          
          // Add more specific error based on the accuracy level
          if (verifiedAddress.accuracy < 0.5) {
            errors.push('The address appears to be significantly different from known addresses');
          } else {
            errors.push('The address may contain minor errors or non-standard formatting');
          }
          
          // Add suggestions if available
          if (verifiedAddress.address_components) {
            suggestions.streetAddress = verifiedAddress.address_components.street + 
                                      (verifiedAddress.address_components.number ? ' ' + verifiedAddress.address_components.number : '');
            suggestions.city = verifiedAddress.address_components.city;
            suggestions.state = verifiedAddress.address_components.state;
            suggestions.postalCode = verifiedAddress.address_components.zip;
            suggestions.country = address.country; // Keep original country
          }
        }
        
        return {
          isValid,
          errors,
          suggestions: isValid ? undefined : suggestions,
          originalAddress: address
        };
      }
      
      // If no results were found
      return {
        isValid: false,
        errors: ['Address could not be found in our verification database'],
        originalAddress: address
      };
    }
  } catch (error) {
    console.error('Error verifying address with external API:', error);
    // In case of API failure, use the fallback result
    return fallbackResult;
  }
};

/**
 * Main address verification function
 */
export async function verifyAddress(
  address: Partial<Address>, 
  options: { useExternalApi?: boolean, bypassBasicCheck?: boolean } = {}
): Promise<AddressVerificationResult> {
  // Default to using external API unless explicitly disabled
  const useExternalApi = options.useExternalApi !== false;
  
  // Always perform basic verification first
  const basicResult = performBasicVerification(address);
  
  // If the address doesn't pass basic verification, don't even try API verification
  // This prevents wasting API calls on obviously invalid addresses
  if (!basicResult.isValid && !options.bypassBasicCheck) {
    return basicResult;
  }
  
  // If external API verification is enabled, try that next
  if (useExternalApi) {
    try {
      const apiResult = await performExternalVerification(address);
      
      // If API verification fails but basic validation passed, combine the results
      if (!apiResult.isValid && basicResult.isValid) {
        // Add API errors to the basic result while preserving basic validation status
        return {
          ...basicResult,
          errors: [
            ...basicResult.errors,
            ...apiResult.errors.map(err => `API Verification: ${err}`)
          ],
          // Include API-provided suggestions if available
          suggestions: apiResult.suggestions
        };
      }
      
      // Return the API result
      return apiResult;
    } catch (error) {
      console.error('External verification failed, falling back to basic verification', error);
      // Add error message to basic result
      return {
        ...basicResult,
        errors: [
          ...basicResult.errors,
          'External address verification service unavailable.'
        ]
      };
    }
  }
  
  // If external API is disabled, return the basic verification result
  return basicResult;
}

/**
 * Helper Functions
 */

// Format address for API request
function formatAddressForApi(address: Partial<Address>): string {
  const parts = [];
  
  if (address.streetAddress) parts.push(address.streetAddress);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.postalCode) parts.push(address.postalCode);
  if (address.country) parts.push(address.country);
  
  return parts.join(', ');
}

/**
 * Simulate API response for demonstration purposes
 * Can return either a Geocodio-style response or a Google Maps-style response
 */
function simulateApiResponse(address: Partial<Address>, apiType: 'geocodio' | 'google' = 'geocodio') {
  // Function to check for suspicious patterns (used by both API simulations)
  const isNonsensicalText = (text: string): boolean => {
    if (!text) return false;
    
    // Check for keyboard patterns
    const keyboardPatterns = [
      'qwerty', 'asdfgh', 'zxcvbn', 'yuiop', 'hjkl', 
      'poiuyt', 'lkjhgf', 'mnbvcx', 'qazwsx', 'edcrfv'
    ];
    if (keyboardPatterns.some(pattern => text.toLowerCase().includes(pattern))) {
      return true;
    }
    
    // Check for excessive repetition
    if (/(.)\1{3,}/.test(text)) {
      return true;
    }
    
    // Check for abnormal letter/number distribution
    const lettersOnly = /^[a-zA-Z]+$/.test(text);
    const numbersOnly = /^\d+$/.test(text);
    
    // If text is long enough and only has one type of character, it's suspicious
    if (text.length > 4 && (lettersOnly || numbersOnly)) {
      return true;
    }
    
    // Check for natural language patterns - consonant/vowel distribution
    if (text.length > 5) {
      const vowelCount = (text.match(/[aeiou]/gi) || []).length;
      const totalCount = text.length;
      const vowelRatio = vowelCount / totalCount;
      
      // Real words typically have vowels making up 25-60% of letters
      // If far outside this range, it's likely nonsense
      if (vowelRatio < 0.1 || vowelRatio > 0.8) {
        return true;
      }
    }
    
    return false;
  };

  // Common validation checks
  const isObviouslyInvalid = 
    !address.streetAddress || 
    !address.city || 
    address.streetAddress?.length < 5 ||
    isNonsensicalText(address.streetAddress || '') ||
    isNonsensicalText(address.city || '');
  
  const hasSuspiciousComponents = 
    isNonsensicalText(address.state || '') ||
    (address.postalCode && !/^[a-zA-Z0-9\s-]{3,10}$/.test(address.postalCode || ''));
  
  const hasStreetNumber = /^\d+\s/.test(address.streetAddress || '');
  const hasStreetName = address.streetAddress && address.streetAddress.includes(' ');
  const hasCityInMajorList = MAJOR_CITIES.some(city => 
    city.toLowerCase() === address.city?.toLowerCase()
  );
  
  const isLikelyValidAddress = hasStreetNumber && hasStreetName && hasCityInMajorList;
  
  // If requested Google Maps API simulation
  if (apiType === 'google') {
    // Build a Google Maps Address Validation API-like response
    const buildGoogleResponse = (
      isComplete: boolean, 
      hasUnconfirmed: boolean,
      hasInferred: boolean,
      hasReplaced: boolean,
      streetAddress?: string,
      city?: string,
      state?: string,
      postalCode?: string,
      country?: string
    ) => {
      // Convert country to region code
      let regionCode = 'US'; // Default
      if (country) {
        const countryToRegionCode: Record<string, string> = {
          'United States': 'US',
          'Canada': 'CA',
          'United Kingdom': 'GB',
          'Australia': 'AU',
          'Germany': 'DE',
          'France': 'FR',
          // Add more as needed
        };
        regionCode = countryToRegionCode[country] || 'US';
      }
      
      // Extract street number and name for components
      const streetNumber = streetAddress?.match(/^\d+/)?.[0] || '';
      const streetName = streetAddress?.replace(/^\d+\s*/, '') || '';
      
      return {
        result: {
          verdict: {
            addressComplete: isComplete,
            hasUnconfirmedComponents: hasUnconfirmed,
            hasInferredComponents: hasInferred,
            hasReplacedComponents: hasReplaced
          },
          address: {
            formattedAddress: `${streetAddress || ''}, ${city || ''}, ${state || ''} ${postalCode || ''}`,
            postalAddress: {
              regionCode: regionCode,
              languageCode: 'en',
              administrativeArea: state || '',
              locality: city || '',
              addressLines: [streetAddress || ''],
              recipients: [],
              organization: '',
              postalCode: postalCode || ''
            },
            addressComponents: [
              {
                componentType: 'street_number',
                componentName: {
                  text: streetNumber,
                  languageCode: 'en'
                },
                confirmationLevel: hasUnconfirmed ? 'unconfirmed' : 'confirmed',
                inferred: hasInferred
              },
              {
                componentType: 'street_name',
                componentName: {
                  text: streetName,
                  languageCode: 'en'
                },
                confirmationLevel: hasUnconfirmed ? 'unconfirmed' : 'confirmed',
                inferred: hasInferred
              },
              {
                componentType: 'locality',
                componentName: {
                  text: city || '',
                  languageCode: 'en'
                },
                confirmationLevel: hasUnconfirmed ? 'unconfirmed' : 'confirmed',
                inferred: hasInferred
              },
              {
                componentType: 'administrative_area_level_1',
                componentName: {
                  text: state || '',
                  languageCode: 'en'
                },
                confirmationLevel: hasUnconfirmed ? 'unconfirmed' : 'confirmed',
                inferred: hasInferred
              },
              {
                componentType: 'postal_code',
                componentName: {
                  text: postalCode || '',
                  languageCode: 'en'
                },
                confirmationLevel: hasUnconfirmed ? 'unconfirmed' : 'confirmed',
                inferred: hasInferred
              }
            ]
          },
          metadata: {
            business: false,
            poBox: false,
            residential: true
          }
        }
      };
    };
    
    // Determine the appropriate response based on address quality
    if (isObviouslyInvalid) {
      // Clearly invalid address
      return buildGoogleResponse(
        false, // Not complete
        true,  // Has unconfirmed
        false, // No inference
        false  // No replacement
      );
    } else if (hasSuspiciousComponents) {
      // Some suspicious components
      return buildGoogleResponse(
        true,  // Complete but with issues
        true,  // Has unconfirmed parts
        true,  // Needed to infer some parts
        false, // No replacement
        address.streetAddress,
        address.city,
        address.state,
        address.postalCode,
        address.country
      );
    } else if (isLikelyValidAddress) {
      // Very likely valid address - could suggest minor formatting improvements
      const suggestedStreetAddress = address.streetAddress?.replace(/\b(\w+)\b/g, match => {
        // Capitalize first letter of each word except small words
        if (['the', 'and', 'of', 'in', 'on', 'at'].includes(match.toLowerCase())) {
          return match.toLowerCase();
        }
        return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
      });
      
      return buildGoogleResponse(
        true,  // Complete
        false, // No unconfirmed
        false, // No inference
        true,  // Some replacement (formatting)
        suggestedStreetAddress, // Suggested format
        address.city,
        address.state,
        address.postalCode,
        address.country
      );
    } else {
      // Standard address - seems okay but has some issues
      return buildGoogleResponse(
        true,  // Complete
        false, // No unconfirmed
        true,  // Some inference needed
        false, // No replacement
        address.streetAddress,
        address.city,
        address.state,
        address.postalCode,
        address.country
      );
    }
  } 
  
  // Default to Geocodio API response simulation
  else {
    if (isObviouslyInvalid) {
      // Clearly invalid - low accuracy
      return {
        results: [{
          accuracy: 0.2,
          address_components: null
        }]
      };
    } else if (hasSuspiciousComponents) {
      // Some suspicious elements - medium-low accuracy
      return {
        results: [{
          accuracy: 0.5,
          address_components: {
            number: address.streetAddress?.match(/\d+/)?.[0] || '',
            street: address.streetAddress?.replace(/^\d+\s*/, '') || '',
            city: address.city || '',
            state: address.state || '',
            zip: address.postalCode || ''
          }
        }]
      };
    } else if (isLikelyValidAddress) {
      // Very likely valid address - high accuracy
      return {
        results: [{
          accuracy: 0.95,
          address_components: {
            number: address.streetAddress?.match(/\d+/)?.[0] || '',
            street: address.streetAddress?.replace(/^\d+\s*/, '') || '',
            city: address.city || '',
            state: address.state || '',
            zip: address.postalCode || ''
          }
        }]
      };
    } else {
      // Otherwise, simulate a standard successful verification
      return {
        results: [{
          accuracy: 0.85,
          address_components: {
            number: address.streetAddress?.match(/\d+/)?.[0] || '',
            street: address.streetAddress?.replace(/^\d+\s*/, '') || '',
            city: address.city || '',
            state: address.state || '',
            zip: address.postalCode || ''
          }
        }]
      };
    }
  }
}

// Check if a city name looks like a real city
function isLikelyRealCity(cityName: string): boolean {
  // Check against known major cities (case-insensitive)
  if (MAJOR_CITIES.some(city => city.toLowerCase() === cityName.toLowerCase())) {
    return true;
  }
  
  // Perform pattern-based checks
  // City names typically don't have numbers
  if (/\d/.test(cityName)) {
    return false;
  }
  
  // City names don't have excessive repetition of characters
  if (/(.)\1{3,}/.test(cityName)) {
    return false;
  }
  
  // City names are typically at least 2 characters
  if (cityName.trim().length < 2) {
    return false;
  }
  
  // Check for keyboard patterns (qwerty, asdf, etc.)
  const keyboardPatterns = [
    'qwert', 'asdfg', 'zxcvb', 'yuiop', 'hjkl', 'bnm',
    'poiuy', 'lkjh', 'mnbv', 'trewq', 'gfdsa', 'bvcxz'
  ];
  
  if (keyboardPatterns.some(pattern => cityName.toLowerCase().includes(pattern))) {
    return false;
  }
  
  // Check for natural language patterns - consonant/vowel distribution
  const vowelCount = (cityName.match(/[aeiou]/gi) || []).length;
  const consonantCount = (cityName.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
  const totalCount = vowelCount + consonantCount;
  
  // Most real city names have a reasonable vowel-to-consonant ratio
  // If there are almost no vowels or almost all vowels, it's likely nonsense
  if (totalCount > 3) {
    const vowelRatio = vowelCount / totalCount;
    if (vowelRatio < 0.1 || vowelRatio > 0.8) {
      return false;
    }
  }
  
  // If city is very short, be stricter
  if (cityName.trim().length < 4) {
    // Short city names are usually well-known
    return MAJOR_CITIES.some(city => 
      city.toLowerCase().includes(cityName.toLowerCase()) ||
      cityName.toLowerCase().includes(city.toLowerCase())
    );
  }
  
  // For longer names, apply more lenient checks
  return true;
}

// Convert US state abbreviation to full name
function stateAbbreviationToFull(abbr: string): string | null {
  const stateMap: { [abbr: string]: string } = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
    'DC': 'District of Columbia'
  };
  
  return stateMap[abbr] || null;
}

// Convert Canadian province abbreviation to full name
function provinceAbbreviationToFull(abbr: string): string | null {
  const provinceMap: { [abbr: string]: string } = {
    'AB': 'Alberta', 'BC': 'British Columbia', 'MB': 'Manitoba', 'NB': 'New Brunswick',
    'NL': 'Newfoundland and Labrador', 'NT': 'Northwest Territories', 'NS': 'Nova Scotia',
    'NU': 'Nunavut', 'ON': 'Ontario', 'PE': 'Prince Edward Island', 'QC': 'Quebec',
    'SK': 'Saskatchewan', 'YT': 'Yukon'
  };
  
  return provinceMap[abbr] || null;
}