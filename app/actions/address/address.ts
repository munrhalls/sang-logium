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
  };
  placeId?: string;
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
    const verdict = data.result?.verdict;
    if (!verdict) throw new Error("No verdict in Google API response");

    if (isAcceptedAddress(verdict)) {
      const googleAddress = data.result?.address;
      if (!googleAddress)
        throw new Error("No address in Google API response despite acceptance");

      const cleanAddress = formatCleanAddress(googleAddress, input, regionCode);

      return {
        status: "ACCEPT",
        address: cleanAddress,
        geocode: data.result?.address?.geocode,
        placeId: data.result?.address?.placeId,
      };
    }

    throw new Error(
      "//DEVELOPMENT// Outside of current tracer code, PURPOSEFUL ERROR THROW"
    );
  } catch (error) {
    console.error("Critical Fetch Error:", error);
    return {
      status: "FIX",
      errors: { message: "Validation failed. Please check details." },
    };
  }
}
