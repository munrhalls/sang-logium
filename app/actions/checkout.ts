"use server";

import { Address, ServerResponse } from "@/app/(store)/checkout/checkout.types";

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
  missingComponentTypes?: string[];
}

interface GoogleValidationResponse {
  result?: {
    verdict?: {
      validationGranularity: string;
      hasReplacedComponents: boolean;
    };
    address?: GoogleAddress;
  };
}

// helper
function formatCleanAddress(
  googleAddress: GoogleAddress,
  input: Address
): Address {
  const getComp = (type: string) =>
    googleAddress.addressComponents.find((c) => c.componentType === type)
      ?.componentName?.text || "";

  return {
    street: getComp("route") || input.street,
    streetNumber:
      getComp("street_number") || getComp("subpremise") || input.streetNumber,
    city: getComp("locality") || getComp("postal_town") || input.city,
    postalCode: getComp("postal_code") || input.postalCode,
    regionCode: googleAddress.postalAddress?.regionCode || input.regionCode,
  };
}

export async function submitShippingAction(
  input: Address
): Promise<ServerResponse> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;

  const payload = {
    address: {
      regionCode: input.regionCode,
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

    if (
      !response.ok ||
      !data.result ||
      !data.result.verdict ||
      !data.result.address
    ) {
      console.error("Google Validation API Error:", data);
      return {
        status: "FIX",
        errors: { city: "Address validation service unavailable." },
      };
    }

    const verdict = data.result.verdict;
    const address = data.result.address;
    const components = address.addressComponents;

    const isPrecise =
      verdict.validationGranularity === "PREMISE" ||
      verdict.validationGranularity === "SUB_PREMISE";

    const countryComponent = components.find(
      (c) => c.componentType === "country"
    );
    const returnedRegionCode = countryComponent?.componentName?.text;
    const isCountryMatch = returnedRegionCode === input.regionCode;

    const hasMajorReplacements = verdict.hasReplacedComponents;

    const isMissingSubpremise =
      address.missingComponentTypes?.includes("subpremise");

    if (isPrecise && (!isCountryMatch || hasMajorReplacements)) {
      return {
        status: "FIX",
        errors: {
          regionCode: `We found this address in ${returnedRegionCode}, not ${input.regionCode}. Please check the country.`,
        },
      };
    }

    if (!isPrecise) {
      return {
        status: "FIX",
        errors: {
          street:
            "We could not locate this specific building. Please check the street number.",
        },
      };
    }

    if (isMissingSubpremise) {
      return {
        status: "CONFIRM",
        address: formatCleanAddress(address, input),
        errors: {
          streetNumber:
            "It looks like this building might need an apartment/suite number.",
        },
      };
    }

    return {
      status: "ACCEPT",
      address: formatCleanAddress(address, input),
    };
  } catch (error) {
    console.error("Critical Fetch Error:", error);
    return {
      status: "FIX",
      errors: { city: "Validation failed. Please check details." },
    };
  }
}
