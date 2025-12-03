"use server";
import { Address, ServerResponse } from "@/app/(store)/checkout/checkout.types";
import Error from "next/error";

// TODO 1. ou are using throw new Error to handle valid logic branches (when an address is not accepted). This is an anti-pattern; simple conditional returns are more performant and readable.
// TODO 2 Payload Construction: Concatenating street and streetNumber into a single string inside addressLines is risky. If the user inputs a complex street name, this concatenation might confuse the validation engine.
// TODO 3 Safety: The try/catch block is too broad. It catches both network errors and your intentional logic errors, making debugging difficult.

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
}

interface GoogleValidationVerdict {
  inputGranularity: string;
  validationGranularity: string;
  geocodeGranularity: string;
  addressComplete: boolean;
  hasReplacedComponents: boolean;
  hasSpellCorrectedComponents: boolean;
}

export interface GoogleValidationResponse {
  result?: {
    verdict?: GoogleValidationVerdict;
    address?: GoogleAddress;
    geocode?: {
      location: {
        latitude: number;
        longitude: number;
      };
      placeId?: string;
    };
  };
}

const ALLOWED_GRANULARITY = new Set(["PREMISE", "SUB_PREMISE"]);

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

function isAcceptedAddress(verdict: GoogleValidationVerdict): boolean {
  if (!verdict.addressComplete) return false;

  if (verdict.hasReplacedComponents || verdict.hasSpellCorrectedComponents) {
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
  if (!apiKey) {
    return {
      status: "FIX",
      errors: { message: "Internal configuration error." },
    };
  }

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

    if (!response.ok) {
      return {
        status: "FIX",
        errors: { message: `Google API Error: ${response.statusText}` },
      };
    }

    const data = (await response.json()) as GoogleValidationResponse;
    const verdict = data.result?.verdict;
    const googleAddress = data.result?.address;

    if (verdict && googleAddress && isAcceptedAddress(verdict)) {
      const cleanAddress = formatCleanAddress(googleAddress, input, regionCode);

      return {
        status: "ACCEPT",
        address: cleanAddress,
        geocode: data.result?.geocode?.location,
        placeId: data.result?.geocode?.placeId,
      };
    }

    return {
      status: "FIX",
      errors: { message: "Address could not be strictly validated." },
    };
    // TODO annotate error type properly in catch
  } catch (err) {
    return {
      status: "FIX",
      errors: {
        err,
        message: "Validation service temporarily unavailable.",
      },
    };
  }
}
