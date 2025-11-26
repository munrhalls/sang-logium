"use server";

import { Address, ServerResponse } from "@/app/(store)/checkout/checkout.types";

export async function submitShippingAction(
  input: Address
): Promise<ServerResponse> {
  // 1. Setup the Fetch Request
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // 2. Safety Check: Did Google fail or return garbage?
    if (!response.ok || !data.result || !data.result.verdict) {
      console.error("Google Validation API Error:", data);
      return {
        status: "FIX",
        errors: { city: "Address validation service unavailable." },
      };
    }

    const verdict = data.result.verdict;
    const address = data.result.address;

    // 3. Helper to extract clean address data
    const getComp = (type: string) =>
      address?.addressComponents?.find((c: any) => c.componentType === type)
        ?.componentName?.text || "";

    const cleanAddress: Address = {
      street: getComp("route") || input.street,
      streetNumber:
        getComp("street_number") || getComp("subpremise") || input.streetNumber,
      city: getComp("locality") || input.city,
      postalCode: getComp("postal_code") || input.postalCode,
      regionCode: address?.postalAddress?.regionCode || input.regionCode,
    };

    // --- LOGIC GATES (Same as before) ---

    // GATE 1: NONSENSE or MISSING STREET
    if (
      verdict.validationGranularity === "OTHER" ||
      verdict.validationGranularity === "ROUTE"
    ) {
      if (verdict.validationGranularity === "ROUTE") {
        return {
          status: "FIX",
          errors: { streetNumber: "Please include a house/apartment number." },
        };
      }

      return {
        status: "FIX",
        errors: { street: "We could not locate this address." },
      };
    }

    // GATE 2: MISSING SUBPREMISE (Apt/Suite)
    if (address?.missingComponentTypes?.includes("subpremise")) {
      return {
        status: "PARTIAL",
        address: cleanAddress,
        errors: { streetNumber: "Missing apartment or suite number?" },
      };
    }

    // GATE 3: CORRECTIONS / INFERENCES
    if (
      verdict.hasInferredComponents ||
      verdict.hasSpellCorrectedComponents ||
      verdict.hasReplacedComponents
    ) {
      return {
        status: "CONFIRM",
        address: cleanAddress,
      };
    }

    // GATE 4: PERFECT
    return {
      status: "CONFIRM",
      address: cleanAddress,
    };
  } catch (error) {
    console.error("Critical Fetch Error:", error);
    return {
      status: "FIX",
      errors: { city: "Validation failed. Please check details." },
    };
  }
}
