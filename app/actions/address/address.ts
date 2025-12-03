"use server";

import { Address, ServerResponse } from "@/app/(store)/checkout/checkout.types";

interface RequestBody {
  address: {
    regionCode: string;
    postalCode: string;
    locality: string;
    addressLines: string[];
  };
  enableUspsCass: boolean;
}

interface GoogleAddressComponent {
  componentType: string;
  componentName: {
    text: string;
  };
}

interface GoogleAddress {
  addressComponents: GoogleAddressComponent[];
  postalAddress?: {
    regionCode: string;
  };
  geocode?: {
    location: {
      latitude: number;
      longitude: number;
    };
    placeId?: string;
  };
}

interface GoogleValidationVerdict {
  inputGranularity: string;
  validationGranularity: string;
  geocodeGranularity: string;
  addressComplete: boolean;
  hasReplacedComponents: boolean;
  hasSpellCorrectedComponents: boolean;
}

interface GoogleValidationResponse {
  result?: {
    verdict?: GoogleValidationVerdict;
    address?: GoogleAddress;
  };
}

const formatCleanAddress = (
  googleAddress: GoogleAddress,
  input: Address,
  normalizedRegion: string
): Address => {
  const components = new Map(
    googleAddress.addressComponents.map((c) => [
      c.componentType,
      c.componentName.text,
    ])
  );

  const get = (type: string) => components.get(type);

  return {
    street: get("route") || input.street,
    streetNumber:
      [get("street_number"), get("subpremise")].filter(Boolean).join("/") ||
      input.streetNumber,
    city: get("locality") || get("postal_town") || input.city,
    postalCode: get("postal_code") || input.postalCode,
    regionCode: googleAddress.postalAddress?.regionCode || normalizedRegion,
  };
};

const ALLOWED_GRANULARITY = new Set(["PREMISE", "SUB_PREMISE"]);

function isAcceptedAddress(verdict: GoogleValidationVerdict): boolean {
  console.log("Validation Verdict:", verdict);
  if (!verdict.addressComplete) return false;
  if (verdict?.hasReplacedComponents || verdict?.hasSpellCorrectedComponents) {
    return false;
  }

  return (
    ALLOWED_GRANULARITY.has(verdict.inputGranularity) &&
    ALLOWED_GRANULARITY.has(verdict.validationGranularity)
  );
}

export async function submitShippingAction(
  input: Address
): Promise<ServerResponse> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;

  const regionCode = input.regionCode === "UK" ? "GB" : input.regionCode;
  console.log(input, "input");

  const payload: RequestBody = {
    address: {
      regionCode: regionCode,
      postalCode: input.postalCode,
      locality: input.city,
      addressLines: [`${input.street} ${input.streetNumber}`],
    },
    enableUspsCass: false,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as GoogleValidationResponse;
    console.log("Google API Response Data:", JSON.stringify(data, null, 2));

    const verdict = data.result?.verdict;
    if (!verdict) {
      console.error("Google API Response:", JSON.stringify(data, null, 2));
      throw new Error("No verdict in Google API response");
    }

    console.log("Full verdict:", JSON.stringify(verdict, null, 2));
    console.log("Is accepted?", isAcceptedAddress(verdict));

    if (isAcceptedAddress(verdict)) {
      const googleAddress = data.result?.address;
      if (!googleAddress)
        throw new Error("No address in Google API response despite acceptance");

      const cleanAddress = formatCleanAddress(googleAddress, input, regionCode);

      console.log("Cleaned Address:", cleanAddress);
      // TODO 5. FIX Typescript typing, geo outside address
      console.log("Geocode Info:", data.result?.geocode);
      console.log("Place ID:", data.result?.geocode?.placeId);

      return <ServerResponse>{
        status: "ACCEPT",
        address: cleanAddress,
        geocode: data.result?.geocode?.location,
        placeId: data.result?.geocode?.placeId,
      };
    }

    throw new Error(
      "//DEVELOPMENT// Outside of current tracer code, PURPOSEFUL ERROR THROW"
    );
  } catch (error) {
    console.error("Critical Fetch Error:", error);
    // TODO 5. Properly type error response
    return {
      status: "FIX",
      errors: { message: "Validation failed. Please check details." },
    };
  }
}
