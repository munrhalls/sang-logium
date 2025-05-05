import { Address } from "@/sanity/lib/profiles/profileTypes";
export interface AddressVerificationResult {
  isValid: boolean;
  errors: string[];
  suggestions?: Partial<Address>;
  originalAddress: Partial<Address>;
  usingFallbackValidation?: boolean;
}
interface GeoapifyGeocodingResponse {
  features: Array<{
    properties: {
      formatted: string;
      country: string;
      country_code: string;
      county: string;
      city: string;
      municipality: string;
      postcode: string;
      street: string;
      housenumber: string;
      state: string;
      confidence: number;
    };
  }>;
}
function getGeoapifyApiKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY ||
    "2954b2442d2d4731a391d34936e4e181"
  );
}
function performBasicValidation(address: Partial<Address>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!address.streetAddress || address.streetAddress.trim().length < 3) {
    errors.push("Street address is required and must be at least 3 characters");
  }
  if (!address.city || address.city.trim().length < 2) {
    errors.push("City is required and must be at least 2 characters");
  }
  if (!address.country || address.country.trim().length < 2) {
    errors.push("Country is required");
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}
export async function verifyAddress(
  address: Partial<Address>,
  options: { useExternalApi?: boolean } = { useExternalApi: true }
): Promise<AddressVerificationResult> {
  if (options.useExternalApi === false) {
    const validation = performBasicValidation(address);
    return {
      ...validation,
      originalAddress: address,
      usingFallbackValidation: true,
    };
  }
  const basicValidation = performBasicValidation(address);
  if (!basicValidation.isValid) {
    return {
      isValid: false,
      errors: basicValidation.errors,
      originalAddress: address,
    };
  }
  const isPoland = address.country?.toLowerCase() === "poland";
  const apiKey = getGeoapifyApiKey();
  if (!apiKey) {
    console.error("Geoapify API key missing");
    return {
      isValid: false,
      errors: ["Address validation service is unavailable"],
      originalAddress: address,
      usingFallbackValidation: true,
    };
  }
  try {
    const url = new URL("https:
    url.searchParams.append("apiKey", apiKey);
    url.searchParams.append("format", "json");
    url.searchParams.append("limit", "1");
    if (address.streetAddress) {
      url.searchParams.append("street", address.streetAddress);
    }
    if (address.city) {
      url.searchParams.append("city", address.city);
    }
    if (address.state) {
      url.searchParams.append("state", address.state);
    }
    if (address.postalCode) {
      url.searchParams.append("postcode", address.postalCode);
    }
    if (address.country) {
      url.searchParams.append("country", address.country);
    }
    const addressText = [
      address.streetAddress,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
    url.searchParams.append("text", addressText);
    if (isPoland) {
      url.searchParams.append("filter", "countrycode:pl");
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      console.error(`Geoapify API error (${response.status})`);
      return {
        isValid: false,
        errors: ["Address validation service is currently unavailable"],
        originalAddress: address,
        usingFallbackValidation: true,
      };
    }
    const data: GeoapifyGeocodingResponse = await response.json();
    if (!data.features || data.features.length === 0) {
      return {
        isValid: false,
        errors: ["The address could not be found or validated"],
        originalAddress: address,
      };
    }
    const bestMatch = data.features[0];
    const props = bestMatch.properties;
    const confidenceThreshold = isPoland ? 0.4 : 0.6;
    const isValid = props.confidence >= confidenceThreshold;
    if (isValid) {
      return {
        isValid: true,
        errors: [],
        originalAddress: address,
      };
    } else {
      const suggestions: Partial<Address> = {};
      if (props.housenumber && props.street) {
        suggestions.streetAddress = `${props.housenumber} ${props.street}`;
      } else if (props.street) {
        suggestions.streetAddress = props.street;
      }
      if (props.city) suggestions.city = props.city;
      if (props.state) suggestions.state = props.state;
      if (props.postcode) suggestions.postalCode = props.postcode;
      if (props.country) suggestions.country = props.country;
      return {
        isValid: false,
        errors: ["The address could not be fully validated"],
        suggestions:
          Object.keys(suggestions).length > 0 ? suggestions : undefined,
        originalAddress: address,
      };
    }
  } catch (error) {
    console.error("Error calling Geoapify Geocoding API:", error);
    return {
      isValid: false,
      errors: ["External address validation service unavailable"],
      originalAddress: address,
      usingFallbackValidation: true,
    };
  }
}
